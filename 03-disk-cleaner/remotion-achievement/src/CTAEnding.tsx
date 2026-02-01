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
  radius,
  cardStyle,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 09: 结尾 CTA (17:32–17:42) ──
// 三张卡片式弹入 + 署名
//
// Timeline (600 frames @ 30fps = 20s):
//   0–20     背景渐入
//  30–80     卡片 1 "3 个 Skills · GitHub 链接在简介" spring 弹入
//  80–130    卡片 2 "一键三连" spring 弹入
// 130–180    卡片 3 "绿皮火车 · 下期见" spring 弹入
// 200–500    Hold，卡片微浮动
// 520–560    感谢文字淡入
// 560–600    淡出至黑

const cards = [
  {
    icon: "🔗",
    title: "3 个 Skills · 链接在简介",
    subtitle: "免费的，拿走不谢",
    color: color.blue,
  },
  {
    icon: "👍",
    title: "一键三连",
    subtitle: "如果这个视频对你有帮助",
    color: color.orange,
  },
  {
    icon: "🚂",
    title: "绿皮火车",
    subtitle: "我们下期见",
    color: color.green,
  },
];

export const CTAEnding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Thank you text ──
  const thanksOpacity = interpolate(frame, [520, 550], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thanksY = interpolate(frame, [520, 550], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [560, 600], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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

        {/* Cards row */}
        <div
          style={{
            display: "flex",
            gap: s(40),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cards.map((card, i) => {
            const delay = 30 + i * 50;
            const cardScale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 10, stiffness: 140, mass: 0.7 },
            });
            const cardOpacity = interpolate(
              frame,
              [delay, delay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Float
            const float =
              frame > delay + 60
                ? Math.sin((frame - delay) * 0.04 + i * 1.5) * 4
                : 0;

            return (
              <div
                key={i}
                style={{
                  width: s(280),
                  height: s(200),
                  ...cardStyle(card.color),
                  boxShadow: shadow.glow(card.color, 0.08),
                  borderRadius: radius.lg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: s(14),
                  opacity: cardOpacity,
                  transform: `scale(${Math.min(cardScale, 1.05)}) translateY(${float}px)`,
                }}
              >
                <span style={{ fontSize: s(48) }}>{card.icon}</span>
                <div
                  style={{
                    fontSize: s(22),
                    fontWeight: fontWeight.bold,
                    color: color.text,
                    fontFamily: font.display,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: s(14),
                    color: card.color,
                    fontFamily: font.display,
                    fontWeight: fontWeight.medium,
                  }}
                >
                  {card.subtitle}
                </div>
              </div>
            );
          })}
        </div>

        {/* Thank you */}
        <div
          style={{
            marginTop: s(60),
            fontSize: s(24),
            color: color.textTertiary,
            fontFamily: font.display,
            opacity: thanksOpacity,
            transform: `translateY(${thanksY}px)`,
          }}
        >
          感谢观看 🙏
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
