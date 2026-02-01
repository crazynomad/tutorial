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
  radius,
  cardStyle,
  iconBadge,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 05: Skill 封装原理 (9:35–9:50) ──
// 三层结构从上到下依次展开，箭头连线动画
//
// Timeline (450 frames @ 30fps = 15s):
//   0–20    背景渐入
//  20–60    顶层"用户"节点 spring 弹入
//  70–100   第一条箭头绘制 + "自然语言" 标签淡入
// 100–140   中间层 "Claude Code + Skill" 节点弹入
// 150–180   第二条箭头绘制 + "Skill 调用" 标签淡入
// 180–220   底层 3 个工具节点依次弹入
// 230–260   所有连线高亮脉冲一次
// 270–380   Hold，微浮动
// 390–420   底部说明文字淡入
// 420–450   淡出至黑

interface Layer {
  icon: string;
  title: string;
  subtitle: string;
  accentColor: string;
  y: number;
}

const layers: Layer[] = [
  {
    icon: "👤",
    title: "用户",
    subtitle: "自然语言指令",
    accentColor: color.green,
    y: s(165),
  },
  {
    icon: "🤖",
    title: "Claude Code",
    subtitle: "Skill 智能调度",
    accentColor: color.blue,
    y: s(400),
  },
];

const bottomTools = [
  { icon: "🐹", title: "Mole", subtitle: "磁盘清理", accentColor: color.red },
  {
    icon: "🤖",
    title: "Ollama",
    subtitle: "本地摘要",
    accentColor: color.purple,
  },
  {
    icon: "🍎",
    title: "macOS",
    subtitle: "智能文件夹",
    accentColor: color.blue,
  },
];
const BOTTOM_Y = s(635);

const arrowLabels = [
  { text: "\u201C帮我清理磁盘\u201D", accentColor: color.green },
  { text: "Skill 调用底层工具", accentColor: color.blue },
];

const CENTER_X = 960;
const BOX_W = s(340);
const BOX_H = s(90);
const TOOL_W = s(200);
const TOOL_H = s(100);
const TOOL_GAP = s(50);

export const SkillArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title ──
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 30], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

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

  // Highlight pulse at frame 230–260
  const pulseAlpha =
    frame >= 230 && frame <= 260
      ? interpolate(frame, [230, 245, 260], [0, 0.4, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // Layer entrance delays
  const layerDelays = [20, 100, 180];
  // Arrow delays
  const arrowDelays = [70, 150];

  // Bottom tools total width for centering
  const totalToolW = TOOL_W * 3 + TOOL_GAP * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* Section title */}
        <div
          style={{
            position: "absolute",
            top: s(48),
            width: "100%",
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span
            style={{
              fontFamily: font.display,
              fontSize: s(38),
              fontWeight: fontWeight.bold,
              color: color.text,
              letterSpacing: "-0.02em",
            }}
          >
            Skill 封装原理
          </span>
        </div>

        {/* Top two layer cards (User + Claude Code) */}
        {layers.map((layer, i) => {
          const delay = layerDelays[i];
          const nodeScale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 140, mass: 0.7 },
          });
          const nodeOpacity = interpolate(
            frame,
            [delay, delay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const float =
            frame > delay + 50
              ? Math.sin((frame - delay) * 0.035 + i * 1.5) * 3
              : 0;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CENTER_X - BOX_W / 2,
                top: layer.y - BOX_H / 2 + float,
                width: BOX_W,
                height: BOX_H,
                ...cardStyle(layer.accentColor),
                borderRadius: radius.xl,
                boxShadow: `${shadow.elevated}, ${shadow.glow(layer.accentColor, pulseAlpha > 0 ? 0.25 : 0.08)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: s(16),
                opacity: nodeOpacity,
                transform: `scale(${Math.min(nodeScale, 1.03)})`,
              }}
            >
              <div style={iconBadge(layer.accentColor, s(52))}>
                <span style={{ fontSize: s(28) }}>{layer.icon}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: s(3),
                }}
              >
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: s(22),
                    fontWeight: fontWeight.bold,
                    color: color.text,
                  }}
                >
                  {layer.title}
                </div>
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: s(13),
                    color: layer.accentColor,
                    fontWeight: fontWeight.medium,
                    letterSpacing: "0.03em",
                  }}
                >
                  {layer.subtitle}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom layer: 3 parallel tool cards */}
        {bottomTools.map((tool, j) => {
          const delay = layerDelays[2];
          const nodeScale = spring({
            frame: frame - delay - j * 12,
            fps,
            config: { damping: 12, stiffness: 140, mass: 0.7 },
          });
          const nodeOpacity = interpolate(
            frame,
            [delay + j * 12, delay + j * 12 + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const float =
            frame > delay + 50
              ? Math.sin((frame - delay) * 0.035 + j * 1.5) * 3
              : 0;

          const toolX =
            CENTER_X - totalToolW / 2 + j * (TOOL_W + TOOL_GAP);

          return (
            <div
              key={`tool-${j}`}
              style={{
                position: "absolute",
                left: toolX,
                top: BOTTOM_Y - TOOL_H / 2 + float,
                width: TOOL_W,
                height: TOOL_H,
                ...cardStyle(tool.accentColor),
                borderRadius: radius.xl,
                boxShadow: `${shadow.elevated}, ${shadow.glow(tool.accentColor, pulseAlpha > 0 ? 0.25 : 0.08)}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: s(8),
                opacity: nodeOpacity,
                transform: `scale(${Math.min(nodeScale, 1.03)})`,
              }}
            >
              <div style={iconBadge(tool.accentColor, s(44))}>
                <span style={{ fontSize: s(24) }}>{tool.icon}</span>
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(18),
                  fontWeight: fontWeight.bold,
                  color: color.text,
                }}
              >
                {tool.title}
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(11),
                  color: tool.accentColor,
                  fontWeight: fontWeight.medium,
                  letterSpacing: "0.03em",
                }}
              >
                {tool.subtitle}
              </div>
            </div>
          );
        })}

        {/* SVG arrows layer */}
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
          <defs>
            <filter id="arrowGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Arrow 1: User → Claude Code */}
          {(() => {
            const delay = arrowDelays[0];
            const arrowProgress = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const startY = layers[0].y + BOX_H / 2;
            const endY = layers[1].y - BOX_H / 2;
            const currentEndY = startY + (endY - startY) * arrowProgress;

            return (
              <>
                <line
                  x1={CENTER_X}
                  y1={startY + 6}
                  x2={CENTER_X}
                  y2={currentEndY - 6}
                  stroke={arrowLabels[0].accentColor}
                  strokeWidth={2.5}
                  strokeOpacity={arrowProgress * 0.6}
                />
                {arrowProgress > 0.8 && (
                  <polygon
                    points={`${CENTER_X},${currentEndY - 2} ${CENTER_X - 8},${currentEndY - 16} ${CENTER_X + 8},${currentEndY - 16}`}
                    fill={arrowLabels[0].accentColor}
                    fillOpacity={arrowProgress * 0.6}
                  />
                )}
                <line
                  x1={CENTER_X}
                  y1={startY + 6}
                  x2={CENTER_X}
                  y2={currentEndY - 6}
                  stroke={arrowLabels[0].accentColor}
                  strokeWidth={8}
                  strokeOpacity={arrowProgress * 0.08 + pulseAlpha * 0.25}
                  filter="url(#arrowGlow)"
                />
              </>
            );
          })()}

          {/* Arrow 2: Claude Code → 3 bottom tools (fan-out) */}
          {(() => {
            const delay = arrowDelays[1];
            const arrowProgress = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const startY = layers[1].y + BOX_H / 2;
            const endY = BOTTOM_Y - TOOL_H / 2;

            return bottomTools.map((tool, j) => {
              const toolCenterX =
                CENTER_X -
                totalToolW / 2 +
                j * (TOOL_W + TOOL_GAP) +
                TOOL_W / 2;
              const currentEndX =
                CENTER_X + (toolCenterX - CENTER_X) * arrowProgress;
              const currentEndY =
                startY + 6 + (endY - 6 - startY - 6) * arrowProgress;

              return (
                <React.Fragment key={`fan-${j}`}>
                  <line
                    x1={CENTER_X}
                    y1={startY + 6}
                    x2={currentEndX}
                    y2={currentEndY}
                    stroke={tool.accentColor}
                    strokeWidth={2.5}
                    strokeOpacity={arrowProgress * 0.6}
                  />
                  {arrowProgress > 0.8 && (
                    <polygon
                      points={`${toolCenterX},${endY - 2} ${toolCenterX - 7},${endY - 14} ${toolCenterX + 7},${endY - 14}`}
                      fill={tool.accentColor}
                      fillOpacity={arrowProgress * 0.6}
                    />
                  )}
                  <line
                    x1={CENTER_X}
                    y1={startY + 6}
                    x2={currentEndX}
                    y2={currentEndY}
                    stroke={tool.accentColor}
                    strokeWidth={8}
                    strokeOpacity={arrowProgress * 0.08 + pulseAlpha * 0.25}
                    filter="url(#arrowGlow)"
                  />
                </React.Fragment>
              );
            });
          })()}
        </svg>

        {/* Arrow labels */}
        {arrowDelays.map((delay, i) => {
          const labelOpacity = interpolate(
            frame,
            [delay + 15, delay + 30],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const startY =
            i === 0
              ? layers[0].y + BOX_H / 2
              : layers[1].y + BOX_H / 2;
          const endY = i === 0 ? layers[1].y - BOX_H / 2 : BOTTOM_Y - TOOL_H / 2;
          const midY = (startY + endY) / 2;

          return (
            <div
              key={`label-${i}`}
              style={{
                position: "absolute",
                left: CENTER_X + s(24),
                top: midY - s(12),
                fontFamily: font.mono,
                fontSize: s(14),
                color: arrowLabels[i].accentColor,
                opacity: labelOpacity,
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                background: `${arrowLabels[i].accentColor}10`,
                padding: `${s(4)}px ${s(12)}px`,
                borderRadius: radius.full,
                border: `1px solid ${arrowLabels[i].accentColor}25`,
              }}
            >
              {arrowLabels[i].text}
            </div>
          );
        })}

        {/* Bottom text */}
        <div
          style={{
            position: "absolute",
            bottom: s(55),
            width: "100%",
            textAlign: "center",
            fontFamily: font.display,
            fontSize: s(22),
            color: color.textTertiary,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
          }}
        >
          Skill 把复杂工具封装成
          <span
            style={{
              color: color.blue,
              fontWeight: fontWeight.semibold,
            }}
          >
            {" "}
            自然语言接口
          </span>
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
