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

// ── Scene 01: Skills 展示 (0:45–0:55) ──
// 展示两个 Skill 卡片: 磁盘清理 + 文件整理
//
// Timeline (300 frames @ 30fps = 10s):
//   0–20    从黑屏渐入背景
//  20–25    上方标题 "两个超实用的 Skills" 淡入
//  40–80    左卡片 (磁盘清理) spring 弹入
//  65–105   右卡片 (文件整理) spring 弹入 (交错 25 帧)
// 105–140   卡片标签文字依次淡入
// 140–220   Hold + 卡片微浮动
// 220–260   底部旁白文字淡入
// 270–300   淡出至黑

const skills = [
  {
    icon: "🧹",
    title: "瘦身",
    subtitle: "disk-cleaner",
    desc: "给磁盘做瘦身",
    color: color.orange,
  },
  {
    icon: "📂",
    title: "收纳",
    subtitle: "file-organizer",
    desc: "给文件做收纳",
    color: color.blue,
  },
  {
    icon: "🧠",
    title: "提炼",
    subtitle: "doc-mindmap",
    desc: "给文档做提炼",
    color: color.purple,
  },
];

export const SkillIcons: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title ──
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Bottom text ──
  const bottomOpacity = interpolate(frame, [300, 325], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [300, 325], [12, 0], {
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Noise overlay */}
        <div style={noiseOverlay} />

        {/* Title */}
        <div
          style={{
            fontSize: s(36),
            fontWeight: fontWeight.semibold,
            color: color.text,
            fontFamily: font.display,
            marginBottom: s(60),
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: "0.03em",
          }}
        >
          三个超实用的 Skills
        </div>

        {/* Skill cards — single row of 3 */}
        <div
          style={{
            display: "flex",
            gap: s(40),
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {skills.map((skill, i) => {
            const cardDelay = 40 + i * 30;
            const cardScale = spring({
              frame: frame - cardDelay,
              fps,
              config: { damping: 10, stiffness: 140, mass: 0.7 },
            });
            const cardOpacity = interpolate(
              frame,
              [cardDelay, cardDelay + 12],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            // Subtle float
            const float =
              frame > cardDelay + 40
                ? Math.sin((frame - cardDelay) * 0.05 + i * 1.5) * 4
                : 0;

            // Label fade in
            const labelDelay = cardDelay + 35;
            const labelOpacity = interpolate(
              frame,
              [labelDelay, labelDelay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const labelY = interpolate(
              frame,
              [labelDelay, labelDelay + 15],
              [10, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: s(24),
                  opacity: cardOpacity,
                  transform: `scale(${Math.min(cardScale, 1.05)}) translateY(${float}px)`,
                }}
              >
                {/* Card */}
                <div
                  style={{
                    ...cardStyle(skill.color),
                    width: s(260),
                    height: s(260),
                    borderRadius: radius.xl,
                    boxShadow: `0 20px 50px rgba(19,19,20,0.06), ${shadow.glow(skill.color, 0.1)}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: s(20),
                  }}
                >
                  <span style={{ fontSize: s(80) }}>{skill.icon}</span>
                  <div
                    style={{
                      fontSize: s(32),
                      fontWeight: fontWeight.bold,
                      color: color.text,
                      fontFamily: font.display,
                    }}
                  >
                    {skill.title}
                  </div>
                  <div
                    style={{
                      fontSize: s(16),
                      fontWeight: fontWeight.medium,
                      color: skill.color,
                      fontFamily: font.display,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {skill.subtitle}
                  </div>
                </div>

                {/* Description label */}
                <div
                  style={{
                    fontSize: s(18),
                    color: color.textSecondary,
                    fontFamily: font.display,
                    opacity: labelOpacity,
                    transform: `translateY(${labelY}px)`,
                    letterSpacing: "0.02em",
                  }}
                >
                  {skill.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <div
          style={{
            marginTop: s(60),
            fontSize: s(24),
            color: color.textTertiary,
            fontFamily: font.display,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
          }}
        >
          <span style={{ color: color.orange, fontWeight: fontWeight.semibold }}>瘦身</span>
          {" → "}
          <span style={{ color: color.blue, fontWeight: fontWeight.semibold }}>收纳</span>
          {" → "}
          <span style={{ color: color.purple, fontWeight: fontWeight.semibold }}>提炼</span>
          {"  一条龙搞定"}
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
