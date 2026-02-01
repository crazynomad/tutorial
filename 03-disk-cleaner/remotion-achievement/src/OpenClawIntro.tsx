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
  shadow,
  radius,
  noiseOverlay,
  cardStyle,
  s,
} from "./lib/theme";
import { fadeIn, slideUp } from "./lib/animations";

// ── Scene 04: OpenClaw 介绍动画 ──
// 口播背景：介绍 OpenClaw（原 Clawbot）——能自己操作电脑的 AI 助手
//
// Timeline (450 frames @ 30fps = 15s):
//   0–20    背景渐入
//  20–60    龙虾 Logo + "OpenClaw" 标题弹入
//  60–90    Tagline 淡入: "The AI that actually does things."
//  90–160   四个能力卡片依次弹入（操作电脑/多平台/记忆/Skills）
// 160–200   GitHub Stars 数字计数动画
// 200–260   多平台图标带淡入（WhatsApp / Telegram / Discord / Slack / Signal / iMessage）
// 260–400   Hold，微浮动
// 400–450   淡出至黑

const LOBSTER_COLOR = "#c4665a";

const capabilities = [
  { emoji: "🖱️", label: "操控电脑", desc: "自己点鼠标、切应用", accent: color.red },
  { emoji: "💬", label: "多平台对话", desc: "微信 / Telegram / Discord", accent: color.blue },
  { emoji: "🧠", label: "持久记忆", desc: "跨对话记住你的偏好", accent: color.purple },
  { emoji: "🔧", label: "Skills 扩展", desc: "社区插件无限扩展", accent: color.green },
];

const platforms = [
  "WhatsApp", "Telegram", "Discord", "Slack", "Signal", "iMessage",
];

export const OpenClawIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Logo ──
  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.8 },
  });
  const logoOpacity = fadeIn(frame, 20, 20);

  // ── Title ──
  const titleOpacity = fadeIn(frame, 30, 15);
  const titleY = slideUp(frame, 30, 15);

  // ── Tagline ──
  const tagOpacity = fadeIn(frame, 60, 20);
  const tagY = slideUp(frame, 60, 20);

  // ── Capability cards ──
  const cardEntries = capabilities.map((_, i) => {
    const start = 90 + i * 18;
    return {
      scale: spring({
        frame: frame - start,
        fps,
        config: { damping: 12, stiffness: 150, mass: 0.6 },
      }),
      opacity: fadeIn(frame, start, 15),
    };
  });

  // ── Stars count-up ──
  const starsStart = 160;
  const starsProgress = interpolate(frame, [starsStart, starsStart + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const starsEased = 1 - Math.pow(1 - starsProgress, 3);
  const starsValue = Math.floor(100000 * starsEased);
  const starsOpacity = fadeIn(frame, starsStart, 15);

  // ── Platform pills ──
  const platformEntries = platforms.map((_, i) => {
    const start = 200 + i * 10;
    return {
      opacity: fadeIn(frame, start, 12),
      y: slideUp(frame, start, 12),
    };
  });

  // ── Float ──
  const floatLogo = frame > 80 ? Math.sin(frame * 0.035) * 3 : 0;

  // ── Fade out ──
  const fadeOut = interpolate(frame, [400, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 35%, #faf9f0 0%, #f3f0e8 100%)",
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* ── Logo + Title area ── */}
        <div
          style={{
            position: "absolute",
            top: s(60),
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: s(8),
          }}
        >
          {/* Lobster logo */}
          <div
            style={{
              opacity: logoOpacity,
              transform: `scale(${Math.min(logoScale, 1.05)}) translateY(${floatLogo}px)`,
              fontSize: s(72),
              filter: `drop-shadow(0 0 20px ${LOBSTER_COLOR}50)`,
            }}
          >
            🦞
          </div>

          {/* OpenClaw text */}
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              fontFamily: font.display,
              fontSize: s(56),
              fontWeight: fontWeight.heavy,
              color: color.text,
              letterSpacing: "-0.03em",
              textShadow: shadow.textGlow(LOBSTER_COLOR, 0.15),
            }}
          >
            OpenClaw
          </div>

          {/* Tagline */}
          <div
            style={{
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
              fontFamily: font.display,
              fontSize: s(22),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
            }}
          >
            The AI that actually does things.
          </div>
        </div>

        {/* ── Capability cards ── */}
        <div
          style={{
            position: "absolute",
            top: s(310),
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: s(24),
            padding: `0 ${s(120)}px`,
          }}
        >
          {capabilities.map((cap, i) => (
            <div
              key={cap.label}
              style={{
                ...cardStyle(cap.accent),
                opacity: cardEntries[i].opacity,
                transform: `scale(${Math.min(cardEntries[i].scale, 1.02)})`,
                padding: `${s(24)}px ${s(20)}px`,
                width: s(200),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: s(10),
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: s(36) }}>{cap.emoji}</div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(18),
                  fontWeight: fontWeight.bold,
                  color: color.text,
                }}
              >
                {cap.label}
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(14),
                  color: cap.accent,
                  fontWeight: fontWeight.medium,
                }}
              >
                {cap.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── GitHub Stars ── */}
        <div
          style={{
            position: "absolute",
            top: s(520),
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: s(12),
            opacity: starsOpacity,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(16),
              color: color.textSecondary,
            }}
          >
            ⭐ GitHub
          </div>
          <div
            style={{
              fontFamily: font.mono,
              fontSize: s(28),
              fontWeight: fontWeight.bold,
              color: color.gold,
              textShadow: shadow.textGlow(color.gold, 0.12),
            }}
          >
            {starsValue.toLocaleString()}+
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(16),
              color: color.textSecondary,
            }}
          >
            Stars
          </div>
        </div>

        {/* ── Platform pills ── */}
        <div
          style={{
            position: "absolute",
            top: s(580),
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: s(16),
            flexWrap: "wrap",
            padding: `0 ${s(200)}px`,
          }}
        >
          {platforms.map((p, i) => (
            <div
              key={p}
              style={{
                opacity: platformEntries[i].opacity,
                transform: `translateY(${platformEntries[i].y}px)`,
                fontFamily: font.display,
                fontSize: s(15),
                fontWeight: fontWeight.semibold,
                color: color.text,
                padding: `${s(8)}px ${s(20)}px`,
                borderRadius: radius.full,
                background: "rgba(19,19,20,0.04)",
                border: `1px solid rgba(19,19,20,0.06)`,
              }}
            >
              {p}
            </div>
          ))}
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
