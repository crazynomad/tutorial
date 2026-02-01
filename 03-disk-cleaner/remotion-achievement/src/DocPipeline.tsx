import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  color,
  font,
  fontWeight,
  gradient,
  radius,
  shadow,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── 文档处理四步流水线 ──
//
// Timeline (1380 frames @ 30fps = 46s):
//    0–90    整条管线淡入，4 步灰色待激活
//   90–150   4 个标签依次快速亮一下（预览闪烁）
//  150–300   Step 1 高亮橙色 + 进度填充
//  300–750   Step 2 高亮蓝色 + 🔒 隐私标识
//  750–840   Step 2 完成 ✓
//  840–1290  Step 3 高亮紫色 + 子标签
// 1290–1350  Step 3 完成 ✓，Step 4 高亮绿色 + 完成
// 1350–1380  全部 ✓，金色光晕一闪

const steps = [
  {
    icon: "📄",
    label: "转格式",
    desc: "PPT/PDF → 纯文本",
    accent: color.orange,
  },
  {
    icon: "🤖",
    label: "提摘要",
    desc: "本地 AI 生成摘要",
    extra: "🔒 本地运行",
    accent: color.blue,
  },
  {
    icon: "🗂️",
    label: "分类",
    desc: "主题 · 用途 · 客户",
    subTags: ["主题", "用途", "客户"],
    accent: color.purple,
  },
  {
    icon: "📦",
    label: "归档",
    desc: "软链接有序归档",
    accent: color.green,
  },
];

// Step activation windows: [highlightStart, completeFrame]
const stepTimeline: [number, number][] = [
  [150, 300], // Step 1
  [300, 840], // Step 2
  [840, 1290], // Step 3
  [1290, 1350], // Step 4
];

const PILL_W = s(260);
const PILL_H = s(90);
const GAP = s(60);
const BADGE_SIZE = s(36);
const Y_POS = s(140);

export const DocPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Pipeline fade in (0–90) ──
  const pipelineOpacity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Final golden glow (1350–1380) ──
  const goldenGlow = interpolate(frame, [1350, 1365, 1380], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Fade out (1360-1380) ──
  const fadeOut = interpolate(frame, [1360, 1380], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Total width for centering
  const totalW = PILL_W * 4 + GAP * 3;
  const startX = (1920 - totalW) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: s(48),
            width: "100%",
            textAlign: "center",
            opacity: pipelineOpacity,
          }}
        >
          <span
            style={{
              fontFamily: font.display,
              fontSize: s(36),
              fontWeight: fontWeight.bold,
              color: color.text,
              letterSpacing: "-0.02em",
            }}
          >
            文档处理流水线
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: Y_POS,
            left: 0,
            width: 1920,
            opacity: pipelineOpacity,
          }}
        >
          {/* Connection arrows between steps */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1920,
              height: PILL_H + s(80),
              pointerEvents: "none",
            }}
          >
            <defs>
              <marker
                id="pipeArrow"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0,0 10,3.5 0,7"
                  fill={color.textTertiary}
                  opacity={0.6}
                />
              </marker>
            </defs>
            {[0, 1, 2].map((i) => {
              const x1 = startX + (i + 1) * PILL_W + i * GAP + s(4);
              const x2 = x1 + GAP - s(8);
              const lineY = PILL_H / 2;

              const [, completeFrame] = stepTimeline[i];
              const arrowColor =
                frame >= completeFrame ? steps[i].accent : color.textTertiary;
              const arrowOpacity = interpolate(
                frame,
                [30 + i * 15, 60 + i * 15],
                [0, 0.5],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const doneOpacity =
                frame >= completeFrame
                  ? interpolate(
                      frame,
                      [completeFrame, completeFrame + 15],
                      [0.5, 0.8],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }
                    )
                  : arrowOpacity;

              return (
                <line
                  key={`arrow-${i}`}
                  x1={x1}
                  y1={lineY}
                  x2={x2}
                  y2={lineY}
                  stroke={arrowColor}
                  strokeWidth={2.5}
                  strokeOpacity={doneOpacity}
                  markerEnd="url(#pipeArrow)"
                />
              );
            })}
          </svg>

          {/* Step pills */}
          {steps.map((step, i) => {
            const pillX = startX + i * (PILL_W + GAP);
            const [highlightStart, completeFrame] = stepTimeline[i];

            const isHighlighted = frame >= highlightStart;
            const isComplete = frame >= completeFrame;

            // Preview flash (90–150)
            const flashStart = 90 + i * 15;
            const flash = interpolate(
              frame,
              [flashStart, flashStart + 8, flashStart + 15],
              [0, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Pill entrance
            const pillScale = spring({
              frame: frame - (15 + i * 12),
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.6 },
            });

            // Pulse when active
            const pulse =
              isHighlighted && !isComplete
                ? 1 + Math.sin(frame * 0.08) * 0.015
                : 1;

            // Progress bar within step
            const progress = isHighlighted
              ? interpolate(frame, [highlightStart, completeFrame], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;

            // Colors — Anthropic Editorial style
            const isActive = isHighlighted || flash > 0.3;
            const bgColor = isActive
              ? `${step.accent}12`
              : `${color.text}06`;
            const borderColor = isActive
              ? `${step.accent}40`
              : `${color.text}15`;
            const labelColor = isActive ? step.accent : color.textTertiary;
            const badgeBg = isActive ? step.accent : `${color.text}30`;

            // Golden glow on completion
            const glowShadow =
              goldenGlow > 0
                ? `0 0 ${30 * goldenGlow}px rgba(201, 168, 76, ${0.4 * goldenGlow})`
                : isHighlighted && !isComplete
                  ? `${shadow.glow(step.accent, 0.15)}`
                  : "none";

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: pillX,
                  top: 0,
                  width: PILL_W,
                }}
              >
                {/* Main pill */}
                <div
                  style={{
                    width: PILL_W,
                    height: PILL_H,
                    borderRadius: PILL_H / 2,
                    background: bgColor,
                    border: `1.5px solid ${borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    gap: s(10),
                    padding: `0 ${s(16)}px`,
                    transform: `scale(${Math.min(pillScale, 1.02) * pulse})`,
                    boxShadow: glowShadow,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Progress bar at bottom */}
                  {isHighlighted && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: `${progress * 100}%`,
                        height: 4,
                        background: step.accent,
                        borderRadius: 2,
                        opacity: isComplete ? 0 : 0.6,
                      }}
                    />
                  )}

                  {/* Badge */}
                  <div
                    style={{
                      width: BADGE_SIZE,
                      height: BADGE_SIZE,
                      borderRadius: "50%",
                      background: badgeBg,
                      color: "#fff",
                      fontFamily: font.display,
                      fontSize: s(15),
                      fontWeight: fontWeight.bold,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isComplete ? "✓" : i + 1}
                  </div>

                  {/* Icon */}
                  <span style={{ fontSize: s(28), flexShrink: 0 }}>
                    {step.icon}
                  </span>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: font.display,
                      fontSize: s(22),
                      fontWeight: fontWeight.semibold,
                      color: labelColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Description below pill */}
                {isHighlighted && (
                  <div
                    style={{
                      marginTop: s(10),
                      textAlign: "center",
                      fontFamily: font.display,
                      fontSize: s(14),
                      color: color.textSecondary,
                      opacity: interpolate(
                        frame,
                        [highlightStart, highlightStart + 20],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      ),
                      transform: `translateY(${interpolate(
                        frame,
                        [highlightStart, highlightStart + 20],
                        [8, 0],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      )}px)`,
                    }}
                  >
                    {step.desc}
                  </div>
                )}

                {/* Extra badge for Step 2 (privacy lock) */}
                {i === 1 && isHighlighted && !isComplete && (
                  <div
                    style={{
                      marginTop: s(6),
                      textAlign: "center",
                      opacity: interpolate(
                        frame,
                        [highlightStart + 30, highlightStart + 50],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      ),
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: `${s(3)}px ${s(12)}px`,
                        borderRadius: radius.full,
                        background: `${color.blue}15`,
                        border: `1.5px solid ${color.blue}30`,
                        fontFamily: font.display,
                        fontSize: s(12),
                        fontWeight: fontWeight.semibold,
                        color: color.blue,
                      }}
                    >
                      {step.extra}
                    </span>
                  </div>
                )}

                {/* Sub-tags for Step 3 (classification dimensions) */}
                {i === 2 && isHighlighted && step.subTags && (
                  <div
                    style={{
                      marginTop: s(6),
                      display: "flex",
                      justifyContent: "center",
                      gap: s(6),
                    }}
                  >
                    {step.subTags.map((tag, ti) => {
                      const tagDelay = highlightStart + 40 + ti * 20;
                      const tagOpacity = interpolate(
                        frame,
                        [tagDelay, tagDelay + 15],
                        [0, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }
                      );
                      const tagScale = spring({
                        frame: frame - tagDelay,
                        fps,
                        config: { damping: 12, stiffness: 180 },
                      });
                      return (
                        <span
                          key={tag}
                          style={{
                            display: "inline-block",
                            padding: `${s(2)}px ${s(10)}px`,
                            borderRadius: radius.full,
                            background: `${color.purple}15`,
                            border: `1.5px solid ${color.purple}30`,
                            fontFamily: font.display,
                            fontSize: s(11),
                            fontWeight: fontWeight.semibold,
                            color: color.purple,
                            opacity: tagOpacity,
                            transform: `scale(${Math.min(tagScale, 1.05)})`,
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: color.black,
          opacity: fadeOut,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
