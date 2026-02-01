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
} from "./lib/theme";

// ── Scene 01: 文字特写 (0:25–0:35) ──
// "而且你完全不需要会写代码"
// "不需要" 三字放大 + 变色 + 弹跳强调
//
// Timeline (300 frames @ 30fps = 10s):
//   0–30    从黑屏渐入
//  30–60    "而且你完全" 逐字淡入
//  60–70    短暂停顿
//  70–110   "不需要" 弹跳登场（spring + 放大 + 变色）
// 110–130   "不需要" 呼吸脉冲
// 130–160   "会写代码" 逐字淡入
// 160–230   全句展示，"不需要"持续微脉冲
// 230–260   底部副标题淡入："只需要和 AI 聊天"
// 270–300   淡出至黑

export const TextEmphasis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Fade in from black ──
  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Part 1: "而且你完全" ──
  const part1Chars = "而且你完全";
  const part1Progress = interpolate(frame, [30, 55], [0, part1Chars.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Part 2: "不需要" (emphasis) ──
  const emphasisScale = spring({
    frame: frame - 70,
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.6 },
  });
  const emphasisOpacity = interpolate(frame, [68, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Breathing pulse after landing
  const emphasisPulse =
    frame > 110
      ? 1 + 0.03 * Math.sin((frame - 110) * 0.1)
      : 1;
  // Glow intensity
  const glowIntensity =
    frame > 80
      ? interpolate(frame, [80, 110], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // ── Part 3: "会写代码" ──
  const part3Chars = "会写代码";
  const part3Progress = interpolate(frame, [130, 155], [0, part3Chars.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Subtitle ──
  const subtitleOpacity = interpolate(frame, [230, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [230, 250], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [270, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Underline animation ──
  const underlineWidth = interpolate(frame, [90, 115], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Noise overlay */}
        <div style={noiseOverlay} />

        {/* Main text line */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: fontWeight.semibold,
            fontFamily: font.display,
            letterSpacing: "0.02em",
          }}
        >
          {/* Part 1: "而且你完全" */}
          {part1Chars.split("").map((char, i) => {
            const charOpacity = interpolate(
              part1Progress,
              [i, i + 1],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <span
                key={`p1-${i}`}
                style={{
                  color: color.text,
                  opacity: charOpacity,
                }}
              >
                {char}
              </span>
            );
          })}

          {/* Part 2: "不需要" */}
          <span
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: emphasisOpacity,
              transform: `scale(${emphasisScale * emphasisPulse})`,
              position: "relative",
              margin: "0 4px",
            }}
          >
            <span
              style={{
                fontSize: 88,
                fontWeight: fontWeight.heavy,
                color: color.red,
                textShadow: shadow.textGlow(color.red, glowIntensity * 0.5),
                letterSpacing: "0.05em",
              }}
            >
              不需要
            </span>
            {/* Underline */}
            <div
              style={{
                width: `${underlineWidth}%`,
                height: 4,
                background: gradient.accentLine(color.red),
                borderRadius: 2,
                marginTop: -4,
              }}
            />
          </span>

          {/* Part 3: "会写代码" */}
          {part3Chars.split("").map((char, i) => {
            const charOpacity = interpolate(
              part3Progress,
              [i, i + 1],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <span
                key={`p3-${i}`}
                style={{
                  color: color.text,
                  opacity: charOpacity,
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 48,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 32,
            fontWeight: fontWeight.regular,
            color: color.textSecondary,
            fontFamily: font.display,
            letterSpacing: "0.03em",
          }}
        >
          只需要和 AI 聊天
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
