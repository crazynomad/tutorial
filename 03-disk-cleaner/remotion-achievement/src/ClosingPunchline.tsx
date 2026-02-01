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

// ── 收尾金句：冲击力拉满 (13:19–13:33) ──
//
// 口播：
//   "Claude.ai 聊天机器人是用来讨论的"
//   "Claude Code 通用 Agent 是用来行动的"
//   "每个人都可以用得上 Claude Code"
//   "它可真不是为程序员而发明的"
//   "只要你能说人话，他就能办实事"
//
// Timeline (420 frames @ 30fps = 14s):
//   0–15     暗幕渐入
//  15–70     Beat 1: "讨论" — 小字 + 大字砸入，红色
//  70–140    Beat 2: "行动" — 绿色大字从右砸入，取代讨论
// 140–210    Beat 3: "不是为程序员发明的" — 划线 + 强调
// 210–320    Beat 4: "说人话 → 办实事" — 金色终极 punchline
// 320–390    Hold + 光晕脉冲
// 390–420    淡出至黑

export const ClosingPunchline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ══════════════════════════════════════
  // Beat 1: "聊天机器人是用来讨论的" (15–70)
  // ══════════════════════════════════════
  const beat1Opacity = interpolate(
    frame,
    [15, 25, 65, 75],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slamScale1 = spring({
    frame: frame - 20,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.8 },
  });

  // "讨论" emphasis word
  const discussScale = spring({
    frame: frame - 28,
    fps,
    config: { damping: 6, stiffness: 300, mass: 1.2 },
  });

  // ══════════════════════════════════════
  // Beat 2: "通用 Agent 是用来行动的" (70–140)
  // ══════════════════════════════════════
  const beat2Opacity = interpolate(
    frame,
    [70, 80, 135, 145],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slamScale2 = spring({
    frame: frame - 75,
    fps,
    config: { damping: 6, stiffness: 250, mass: 1.0 },
  });

  // "行动" slam — bigger, more dramatic
  const actionScale = spring({
    frame: frame - 85,
    fps,
    config: { damping: 5, stiffness: 350, mass: 1.5 },
  });

  // Screen shake on slam
  const shakeX =
    frame >= 85 && frame <= 95
      ? Math.sin((frame - 85) * 2.5) * 8 * (1 - (frame - 85) / 10)
      : 0;
  const shakeY =
    frame >= 85 && frame <= 95
      ? Math.cos((frame - 85) * 3) * 5 * (1 - (frame - 85) / 10)
      : 0;

  // ══════════════════════════════════════
  // Beat 3: "不是为程序员发明的" (140–210)
  // ══════════════════════════════════════
  const beat3Opacity = interpolate(
    frame,
    [140, 155, 205, 215],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const beat3Y = interpolate(frame, [140, 160], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Strikethrough animation for "程序员"
  const strikeProgress = interpolate(frame, [165, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "每个人" emphasis scale
  const everyoneScale = spring({
    frame: frame - 175,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.7 },
  });

  // ══════════════════════════════════════
  // Beat 4: "说人话 → 办实事" (210–390)
  // ══════════════════════════════════════
  const beat4Opacity = interpolate(
    frame,
    [210, 230, 385, 395],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "说人话" enters from left
  const leftWordX = interpolate(frame, [215, 240], [-200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const leftWordOpacity = interpolate(frame, [215, 235], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow appears
  const arrowOpacity = interpolate(frame, [245, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowScale = spring({
    frame: frame - 248,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.6 },
  });

  // "办实事" slams in from right
  const rightWordX = interpolate(frame, [255, 280], [200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightWordScale = spring({
    frame: frame - 260,
    fps,
    config: { damping: 5, stiffness: 280, mass: 1.3 },
  });
  const rightWordOpacity = interpolate(frame, [255, 275], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse on hold
  const glowPulse =
    frame > 290 && frame < 390
      ? 0.15 + 0.1 * Math.sin((frame - 290) * 0.08)
      : 0;

  // Screen shake on "办实事" slam
  const shake2X =
    frame >= 265 && frame <= 275
      ? Math.sin((frame - 265) * 2.5) * 6 * (1 - (frame - 265) / 10)
      : 0;
  const shake2Y =
    frame >= 265 && frame <= 275
      ? Math.cos((frame - 265) * 3) * 4 * (1 - (frame - 265) / 10)
      : 0;

  // ── Final fade ──
  const fadeOut = interpolate(frame, [395, 420], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combined shake
  const totalShakeX = shakeX + shake2X;
  const totalShakeY = shakeY + shake2Y;

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
          transform: `translate(${totalShakeX}px, ${totalShakeY}px)`,
        }}
      >
        <div style={noiseOverlay} />

        {/* ══ Beat 1: 讨论 ══ */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: s(16),
            opacity: beat1Opacity,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              opacity: Math.min(slamScale1, 1),
              transform: `scale(${Math.min(slamScale1, 1.02)})`,
            }}
          >
            Claude.ai 聊天机器人
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              opacity: Math.min(slamScale1, 1),
            }}
          >
            是用来
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(96),
              fontWeight: fontWeight.heavy,
              color: color.red,
              transform: `scale(${Math.min(discussScale, 1.15)})`,
              textShadow: shadow.textGlow(color.red, 0.25),
              letterSpacing: "0.05em",
            }}
          >
            讨论
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              opacity: Math.min(slamScale1, 1),
            }}
          >
            的
          </div>
        </AbsoluteFill>

        {/* ══ Beat 2: 行动 ══ */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: s(16),
            opacity: beat2Opacity,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              opacity: Math.min(slamScale2, 1),
              transform: `scale(${Math.min(slamScale2, 1.02)})`,
            }}
          >
            Claude Code 通用 Agent
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              opacity: Math.min(slamScale2, 1),
            }}
          >
            是用来
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(120),
              fontWeight: fontWeight.heavy,
              color: color.green,
              transform: `scale(${Math.min(actionScale, 1.2)})`,
              textShadow: shadow.textGlow(color.green, 0.35),
              letterSpacing: "0.08em",
            }}
          >
            行动
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              opacity: Math.min(slamScale2, 1),
            }}
          >
            的
          </div>
        </AbsoluteFill>

        {/* ══ Beat 3: 不是为程序员发明的 ══ */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: s(24),
            opacity: beat3Opacity,
            transform: `translateY(${beat3Y}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: s(8),
              fontFamily: font.display,
              fontSize: s(36),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
            }}
          >
            它可真不是为
            <span
              style={{
                position: "relative",
                display: "inline-block",
                color: color.textTertiary,
              }}
            >
              程序员
              {/* Animated strikethrough */}
              <div
                style={{
                  position: "absolute",
                  top: "52%",
                  left: 0,
                  width: `${strikeProgress * 100}%`,
                  height: s(3),
                  background: color.red,
                  borderRadius: s(2),
                }}
              />
            </span>
            发明的
          </div>

          <div
            style={{
              fontFamily: font.display,
              fontSize: s(64),
              fontWeight: fontWeight.heavy,
              color: color.orange,
              transform: `scale(${Math.min(everyoneScale, 1.1)})`,
              textShadow: shadow.textGlow(color.orange, 0.2),
              letterSpacing: "0.04em",
            }}
          >
            每个人都可以用
          </div>
        </AbsoluteFill>

        {/* ══ Beat 4: 说人话 → 办实事 ══ */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: s(40),
            opacity: beat4Opacity,
          }}
        >
          {/* 说人话 */}
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(80),
              fontWeight: fontWeight.heavy,
              color: color.blue,
              transform: `translateX(${leftWordX}px)`,
              opacity: leftWordOpacity,
              textShadow: shadow.textGlow(color.blue, 0.15 + glowPulse),
              letterSpacing: "0.04em",
            }}
          >
            说人话
          </div>

          {/* Arrow */}
          <div
            style={{
              fontSize: s(60),
              opacity: arrowOpacity,
              transform: `scale(${Math.min(arrowScale, 1.1)})`,
              color: color.gold,
              textShadow: shadow.textGlow(color.gold, 0.2 + glowPulse),
            }}
          >
            →
          </div>

          {/* 办实事 */}
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(96),
              fontWeight: fontWeight.heavy,
              color: color.gold,
              transform: `translateX(${rightWordX}px) scale(${Math.min(rightWordScale, 1.15)})`,
              opacity: rightWordOpacity,
              textShadow: shadow.textGlow(color.gold, 0.3 + glowPulse),
              letterSpacing: "0.06em",
            }}
          >
            办实事
          </div>
        </AbsoluteFill>
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
