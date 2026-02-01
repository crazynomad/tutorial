import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import {
  color,
  font,
  fontWeight,
  gradient,
  shadow,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── 文档智能放射图 ──
// 中心 doc-mindmap 节点 + 5 个功能分支放射连线
//
// Timeline (450 frames @ 30fps = 15s):
//   0–20    背景渐入
//  20–50    中心节点 spring 弹入
//  60–90    "convert" 节点弹出 + 连线绘制
//  95–125   "summarize" 节点弹出 + 连线
// 130–160   "classify" 节点弹出 + 连线
// 165–195   "rename" 节点弹出 + 连线
// 200–230   "mindmap" 节点弹出 + 连线
// 240–380   Hold，节点微浮动 + 脉冲光晕
// 390–420   底部说明文字淡入
// 420–450   淡出至黑

const features = [
  { cmd: "convert", desc: "批量转 Markdown", icon: "📝", color: color.blue },
  { cmd: "summarize", desc: "Ollama 本地摘要", icon: "🤖", color: color.green },
  { cmd: "classify", desc: "三维度分类", icon: "🗂️", color: color.gold },
  { cmd: "rename", desc: "智能重命名", icon: "✏️", color: color.orange },
  { cmd: "mindmap", desc: "思维导图生成", icon: "🧠", color: color.purple },
];

// Positions around center (angle in degrees, converted to radians)
const angles = [-90, -18, 54, 126, 198]; // evenly spaced starting from top
const RADIUS = s(280);
const CENTER_X = 960;
const CENTER_Y = 480;

export const DocMindmapFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Center node ──
  const centerScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.8 },
  });
  const centerOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Center glow pulse
  const glowPulse =
    frame > 50 ? 0.3 + Math.sin(frame * 0.06) * 0.15 : 0;

  // ── Bottom text ──
  const bottomOpacity = interpolate(frame, [390, 415], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [390, 415], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [420, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* Connection lines + Feature nodes */}
        {features.map((feat, i) => {
          const delay = 60 + i * 35;
          const rad = (angles[i] * Math.PI) / 180;
          const targetX = CENTER_X + Math.cos(rad) * RADIUS;
          const targetY = CENTER_Y + Math.sin(rad) * RADIUS;

          // Line draw progress
          const lineProgress = interpolate(
            frame,
            [delay, delay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Node entrance
          const nodeScale = spring({
            frame: frame - (delay + 10),
            fps,
            config: { damping: 10, stiffness: 160, mass: 0.6 },
          });
          const nodeOpacity = interpolate(
            frame,
            [delay + 10, delay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Float after settled
          const float =
            frame > delay + 40
              ? Math.sin((frame - delay) * 0.04 + i * 1.2) * 4
              : 0;

          // Current line end point (animated)
          const lineEndX = CENTER_X + (targetX - CENTER_X) * lineProgress;
          const lineEndY = CENTER_Y + (targetY - CENTER_Y) * lineProgress;

          return (
            <React.Fragment key={i}>
              {/* Connection line */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 1920,
                  height: 1080,
                  pointerEvents: "none",
                }}
              >
                <line
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={lineEndX}
                  y2={lineEndY}
                  stroke={feat.color}
                  strokeWidth={2}
                  strokeOpacity={lineProgress * 0.6}
                />
                {/* Glow line */}
                <line
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={lineEndX}
                  y2={lineEndY}
                  stroke={feat.color}
                  strokeWidth={4}
                  strokeOpacity={lineProgress * 0.15}
                  filter="url(#glow)"
                />
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              {/* Feature node */}
              <div
                style={{
                  position: "absolute",
                  left: targetX - s(75),
                  top: targetY - s(50) + float,
                  width: s(150),
                  opacity: nodeOpacity,
                  transform: `scale(${Math.min(nodeScale, 1.05)})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: s(8),
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: s(72),
                    height: s(72),
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${feat.color}22, ${feat.color}08)`,
                    border: `2px solid ${feat.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: s(32),
                    boxShadow: shadow.glow(feat.color, 0.12),
                  }}
                >
                  {feat.icon}
                </div>
                {/* Command name */}
                <div
                  style={{
                    fontFamily: font.mono,
                    fontSize: s(18),
                    fontWeight: fontWeight.semibold,
                    color: feat.color,
                    letterSpacing: "0.02em",
                  }}
                >
                  {feat.cmd}
                </div>
                {/* Description */}
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: s(14),
                    color: color.textSecondary,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {feat.desc}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Center doc-mindmap node */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - s(65),
            top: CENTER_Y - s(65),
            width: s(130),
            height: s(130),
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #f3f0e8 0%, #efe9dc 100%)",
            border: `2px solid ${color.borderAccent}`,
            boxShadow: `0 0 30px rgba(217,119,87,${glowPulse}), 0 4px 16px rgba(19,19,20,0.06)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: s(4),
            opacity: centerOpacity,
            transform: `scale(${Math.min(centerScale, 1.05)})`,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: s(42) }}>🧠</span>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: s(12),
              fontWeight: fontWeight.bold,
              color: color.text,
              letterSpacing: "0.05em",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            doc-mindmap
          </div>
        </div>

        {/* Bottom text */}
        <div
          style={{
            position: "absolute",
            bottom: s(80),
            width: "100%",
            textAlign: "center",
            fontFamily: font.display,
            fontSize: s(24),
            color: color.textTertiary,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
          }}
        >
          文档智能整理：从格式转换到知识提取
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
