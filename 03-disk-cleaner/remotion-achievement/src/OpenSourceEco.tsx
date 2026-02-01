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
  shadow,
  gradient,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 05: 开源生态 (9:50–10:00) ──
// "Claude Code 的魔力：让普通人也能用上大神的工具"
// 简洁有力的文字 + 图标组合
//
// Timeline (300 frames @ 30fps = 10s):
//   0–20    背景渐入
//  20–50    左侧"大神"图标 + 标签弹入
//  50–80    中间连接线 + Claude Code logo 弹入
//  80–110   右侧"普通用户"图标 + 标签弹入
// 110–140   中间"开源 Skill"光束流动
// 140–170   底部金句打字机效果淡入
// 170–250   Hold，元素微浮动
// 260–300   淡出至黑

const Y_CENTER = 400;

export const OpenSourceEco: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Left node: Developer ──
  const leftScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.7 },
  });
  const leftOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Center: Claude Code ──
  const centerScale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.6 },
  });
  const centerOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Right node: User ──
  const rightScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.7 },
  });
  const rightOpacity = interpolate(frame, [80, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Connection lines ──
  const lineProgress = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Flow particles (beam effect) ──
  const beamOpacity = interpolate(frame, [110, 130], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamPhase = frame * 0.08;

  // ── Quote text ──
  const quoteText = "Claude Code 的魔力：让普通人也能用上大神的工具";
  const charsVisible =
    frame >= 140
      ? Math.min(
          Math.floor((frame - 140) * 0.7),
          quoteText.length
        )
      : 0;
  const quoteOpacity = interpolate(frame, [140, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Float ──
  const floatL =
    frame > 60 ? Math.sin(frame * 0.04) * 4 : 0;
  const floatR =
    frame > 120 ? Math.sin(frame * 0.04 + 2) * 4 : 0;
  const floatC =
    frame > 90 ? Math.sin(frame * 0.035 + 1) * 3 : 0;

  // ── Fade out ──
  const fadeOut = interpolate(frame, [260, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const LEFT_X = 320;
  const CENTER_X = 960;
  const RIGHT_X = 1600;

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        {/* Noise overlay */}
        <div style={noiseOverlay} />

        {/* Connection lines */}
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
          {/* Left to center line */}
          <line
            x1={LEFT_X + 70}
            y1={Y_CENTER}
            x2={LEFT_X + 70 + (CENTER_X - LEFT_X - 140) * lineProgress}
            y2={Y_CENTER}
            stroke={color.blue}
            strokeWidth={2}
            strokeOpacity={lineProgress * 0.5}
            strokeDasharray="8,6"
          />
          {/* Center to right line */}
          <line
            x1={CENTER_X + 70}
            y1={Y_CENTER}
            x2={CENTER_X + 70 + (RIGHT_X - CENTER_X - 140) * lineProgress}
            y2={Y_CENTER}
            stroke={color.green}
            strokeWidth={2}
            strokeOpacity={lineProgress * 0.5}
            strokeDasharray="8,6"
          />

          {/* Flow particles on left line */}
          {beamOpacity > 0 &&
            [0, 1, 2].map((p) => {
              const t = ((beamPhase + p * 0.33) % 1);
              const px = LEFT_X + 70 + (CENTER_X - LEFT_X - 140) * t;
              return (
                <circle
                  key={`lp-${p}`}
                  cx={px}
                  cy={Y_CENTER}
                  r={4}
                  fill={color.blue}
                  opacity={beamOpacity * (0.4 + 0.6 * Math.sin(t * Math.PI))}
                />
              );
            })}

          {/* Flow particles on right line */}
          {beamOpacity > 0 &&
            [0, 1, 2].map((p) => {
              const t = ((beamPhase + p * 0.33) % 1);
              const px = CENTER_X + 70 + (RIGHT_X - CENTER_X - 140) * t;
              return (
                <circle
                  key={`rp-${p}`}
                  cx={px}
                  cy={Y_CENTER}
                  r={4}
                  fill={color.green}
                  opacity={beamOpacity * (0.4 + 0.6 * Math.sin(t * Math.PI))}
                />
              );
            })}
        </svg>

        {/* Left: Developer */}
        <div
          style={{
            position: "absolute",
            left: LEFT_X - s(80),
            top: Y_CENTER - s(80) + floatL,
            width: s(160),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(12),
            opacity: leftOpacity,
            transform: `scale(${Math.min(leftScale, 1.05)})`,
          }}
        >
          <div
            style={{
              width: s(90),
              height: s(90),
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color.purple}22, ${color.purple}08)`,
              border: `2px solid ${color.purple}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: s(40),
              boxShadow: shadow.glow(color.purple, 0.09),
            }}
          >
            👨‍💻
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(20),
              fontWeight: fontWeight.bold,
              color: color.text,
            }}
          >
            开源大神
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(14),
              color: color.purple,
              fontWeight: fontWeight.medium,
            }}
          >
            写工具 · 分享代码
          </div>
        </div>

        {/* Center: Claude Code */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - s(80),
            top: Y_CENTER - s(85) + floatC,
            width: s(160),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(12),
            opacity: centerOpacity,
            transform: `scale(${Math.min(centerScale, 1.05)})`,
          }}
        >
          <div
            style={{
              width: s(100),
              height: s(100),
              borderRadius: s(20),
              background: `linear-gradient(135deg, ${color.blue}18, ${color.blue}08)`,
              border: `2px solid ${color.blue}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: s(44),
              boxShadow: shadow.glow(color.blue, 0.09),
            }}
          >
            🤖
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(20),
              fontWeight: fontWeight.bold,
              color: color.text,
            }}
          >
            Claude Code
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(14),
              color: color.blue,
              fontWeight: fontWeight.semibold,
            }}
          >
            Skill 桥梁
          </div>
        </div>

        {/* Right: User */}
        <div
          style={{
            position: "absolute",
            left: RIGHT_X - s(80),
            top: Y_CENTER - s(80) + floatR,
            width: s(160),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(12),
            opacity: rightOpacity,
            transform: `scale(${Math.min(rightScale, 1.05)})`,
          }}
        >
          <div
            style={{
              width: s(90),
              height: s(90),
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color.green}22, ${color.green}08)`,
              border: `2px solid ${color.green}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: s(40),
              boxShadow: shadow.glow(color.green, 0.09),
            }}
          >
            😊
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(20),
              fontWeight: fontWeight.bold,
              color: color.text,
            }}
          >
            普通用户
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(14),
              color: color.green,
              fontWeight: fontWeight.medium,
            }}
          >
            说人话 · 就能用
          </div>
        </div>

        {/* Quote text (typewriter) */}
        <div
          style={{
            position: "absolute",
            bottom: s(120),
            width: "100%",
            textAlign: "center",
            fontFamily: font.display,
            fontSize: s(30),
            fontWeight: fontWeight.semibold,
            color: color.text,
            opacity: quoteOpacity,
            letterSpacing: "0.02em",
          }}
        >
          {quoteText.slice(0, charsVisible)}
          {charsVisible < quoteText.length && charsVisible > 0 && (
            <span
              style={{
                opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                color: color.blue,
              }}
            >
              |
            </span>
          )}
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
