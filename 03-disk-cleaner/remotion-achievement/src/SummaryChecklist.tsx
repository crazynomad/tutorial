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
  iconBadge,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 09: 要点回顾 (17:07–17:33) ──
// 3 条要点依次出现，每条带 ✓ 打勾动画
//
// Timeline (1400 frames @ 30fps = ~47s):
//   0–30     背景 + 标题渐入
//  40–220    要点 1 滑入 + 打勾
// 230–410    要点 2 滑入 + 打勾
// 420–600    要点 3 滑入 + 打勾
// 600–1300   Hold，微浮动
// 1300–1400  淡出至黑

const items = [
  {
    text: "Claude Code 不只是给程序员用的——它是运行在你电脑上的 AI 助手，任何人都能使用",
    icon: "🤖",
    color: color.blue,
  },
  {
    text: "用 Skills 调用各种强大工具——大神写的开源项目，一句话就能用上",
    icon: "🛠️",
    color: color.purple,
  },
  {
    text: "磁盘瘦身、文件收纳、文档提炼——一条龙搞定",
    icon: "🎯",
    color: color.orange,
  },
];

export const SummaryChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title ──
  const titleOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [10, 35], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [1300, 1400], [0, 1], {
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
        }}
      >
        {/* Noise overlay */}
        <div style={noiseOverlay} />

        {/* Title */}
        <div
          style={{
            marginTop: s(80),
            fontSize: s(36),
            fontWeight: fontWeight.semibold,
            color: color.text,
            fontFamily: font.display,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: "0.03em",
          }}
        >
          今天我们学到了
        </div>

        {/* Checklist */}
        <div
          style={{
            marginTop: s(60),
            display: "flex",
            flexDirection: "column",
            gap: s(28),
            width: s(900),
          }}
        >
          {items.map((item, i) => {
            const delay = 40 + i * 190;

            // Row slide in
            const rowOpacity = interpolate(
              frame,
              [delay, delay + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const rowX = interpolate(
              frame,
              [delay, delay + 25],
              [-40, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            // Checkmark animation
            const checkDelay = delay + 50;
            const checkScale = spring({
              frame: frame - checkDelay,
              fps,
              config: { damping: 8, stiffness: 200, mass: 0.5 },
            });
            const checkOpacity = interpolate(
              frame,
              [checkDelay, checkDelay + 10],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // Glow pulse after check
            const glowPhase = frame - checkDelay - 10;
            const glow =
              glowPhase > 0 && glowPhase < 30
                ? interpolate(glowPhase, [0, 15, 30], [0, 0.4, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0;

            // Float after settled
            const float =
              frame > delay + 100
                ? Math.sin((frame - delay) * 0.03 + i * 1.2) * 2
                : 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: s(20),
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px) translateY(${float}px)`,
                }}
              >
                {/* Check circle */}
                <div
                  style={{
                    ...(checkOpacity > 0.5
                      ? {
                          ...iconBadge(item.color, s(52)),
                          background: `${item.color}20`,
                          border: `2px solid ${item.color}66`,
                        }
                      : {
                          ...iconBadge(item.color, s(52)),
                          background: "rgba(19,19,20,0.03)",
                          border: "2px solid rgba(19,19,20,0.08)",
                        }),
                    boxShadow:
                      glow > 0
                        ? `0 0 20px ${item.color}${Math.round(glow * 99)
                            .toString(16)
                            .padStart(2, "0")}`
                        : "none",
                  }}
                >
                  {checkOpacity > 0.5 ? (
                    <span
                      style={{
                        fontSize: s(24),
                        opacity: checkOpacity,
                        transform: `scale(${Math.min(checkScale, 1.2)})`,
                        display: "inline-block",
                      }}
                    >
                      ✓
                    </span>
                  ) : (
                    <span style={{ fontSize: s(22), opacity: 0.5 }}>
                      {item.icon}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div
                  style={{
                    fontSize: s(26),
                    fontWeight: fontWeight.medium,
                    color: checkOpacity > 0.5 ? color.text : color.textSecondary,
                    fontFamily: font.display,
                    lineHeight: 1.4,
                    transition: "color 0.3s",
                  }}
                >
                  {item.text}
                </div>
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
