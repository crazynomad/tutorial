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
} from "./lib/theme";

// ── Scene: Achievement Page Showcase ──
// 0:15–0:25 in the video (300 frames @ 30fps, 1920×1080)
//
// Timeline:
//   0–25    Black → page card fades in with slight rise
//  25–55    Header (mole icon + "清理完成") animates in
//  40–80    GB number counts up 0 → 106.00
//  75–95    Money badge "相当于省了 ¥310.55" bounces in
//  95–140   Hold, quip typewriter
// 140–200   Camera zoom toward ¥310.55 (scale + translate)
// 200–250   Overlay text: "它能帮你释放几十 GB 空间，省下真金白银"
// 250–275   Hold
// 275–300   Fade to black

export const AchievementShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Card entrance ──
  const cardOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardRise = interpolate(frame, [0, 25], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Camera zoom toward money area ──
  // The money badge is roughly in the upper-center of the card.
  // We zoom from scale 1 → 1.8, translating focus upward to the money row.
  const zoomScale = interpolate(frame, [140, 210], [1, 1.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  // Translate Y to keep money badge centered during zoom.
  // Card center is at 50%. Money badge sits ~35% from top of card.
  // We need to shift up so 35% becomes the visual center.
  const zoomY = interpolate(frame, [140, 210], [0, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // ── Header icon ──
  const iconScale = spring({
    frame: frame - 22,
    fps,
    config: { damping: 8 },
  });
  const titleOpacity = interpolate(frame, [28, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [28, 45], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── GB count up ──
  const gbProgress = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const currentGB = 106.0 * gbProgress;
  const gbOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Bounce when counter finishes
  const gbScaleBounce = interpolate(frame, [78, 88], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gbScaleBack = interpolate(frame, [88, 96], [1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gbScale = frame < 88 ? gbScaleBounce : gbScaleBack;

  // ── Money badge ──
  const moneyScale = spring({
    frame: frame - 78,
    fps,
    config: { damping: 10 },
  });
  const moneyOpacity = interpolate(frame, [76, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Money glow pulse during zoom ──
  const moneyGlow =
    frame > 150
      ? 0.4 + 0.3 * Math.sin((frame - 150) * 0.12)
      : 0;

  // ── Quip typewriter ──
  const quip = "一顿火锅钱到手！";
  const quipChars = Math.floor(
    interpolate(frame, [95, 140], [0, quip.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayQuip = quip.slice(0, quipChars);
  const showCursor = frame >= 95 && frame <= 150 && frame % 10 < 6;
  const quipOpacity = interpolate(frame, [92, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Stats row ──
  const statsData = [
    { value: "26,500", label: "张照片" },
    { value: "21,200", label: "首歌曲" },
    { value: "¥3k/T", label: "SSD 价格" },
  ];

  // ── Callout ──
  const calloutOpacity = interpolate(frame, [115, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const calloutY = interpolate(frame, [115, 135], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Overlay text ──
  const overlayOpacity = interpolate(frame, [205, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const overlayY = interpolate(frame, [205, 225], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade to black ──
  const fadeOut = interpolate(frame, [275, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Background subtle gradient ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      {/* Subtle background */}
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      />

      {/* Noise overlay */}
      <div style={noiseOverlay} />

      {/* ── Achievement card with camera zoom ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoomScale}) translateY(${zoomY}px)`,
          transformOrigin: "50% 38%",
        }}
      >
        {/* The card */}
        <div
          style={{
            width: 520,
            ...cardStyle(),
            boxShadow: shadow.elevated,
            borderRadius: radius.lg,
            padding: "36px 40px 28px",
            opacity: cardOpacity,
            transform: `translateY(${cardRise}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: font.display,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                transform: `scale(${Math.min(iconScale, 1.15)})`,
              }}
            >
              <MoleIcon />
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: fontWeight.bold,
                letterSpacing: "-0.02em",
                color: color.text,
                margin: 0,
                fontFamily: font.display,
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
              }}
            >
              清理完成
            </h1>
          </div>

          {/* Hero section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 0",
              borderTop: `1px solid ${color.divider}`,
              borderBottom: `1px solid ${color.divider}`,
              width: "100%",
            }}
          >
            {/* GB number */}
            <div
              style={{
                opacity: gbOpacity,
                transform: `scale(${gbScale})`,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 72,
                  fontWeight: fontWeight.bold,
                  letterSpacing: "-0.03em",
                  color: color.text,
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: font.display,
                }}
              >
                {currentGB.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: fontWeight.semibold,
                  color: color.textSecondary,
                  marginLeft: 4,
                  fontFamily: font.display,
                }}
              >
                GB
              </span>
            </div>

            {/* Money badge */}
            <div style={{ height: 18 }} />
            <div
              style={{
                opacity: moneyOpacity,
                transform: `scale(${moneyScale})`,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                position: "relative",
              }}
            >
              {/* Glow behind money during zoom */}
              {moneyGlow > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: "-12px -20px",
                    borderRadius: 12,
                    background: `rgba(201, 168, 76, ${moneyGlow * 0.12})`,
                    boxShadow: `0 0 30px rgba(201, 168, 76, ${moneyGlow * 0.08})`,
                    pointerEvents: "none",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 22,
                  color: color.textSecondary,
                  fontFamily: font.display,
                }}
              >
                相当于省了
              </span>
              <span
                style={{
                  fontSize: 30,
                  fontWeight: fontWeight.bold,
                  color: color.gold,
                  fontFamily: font.display,
                  position: "relative",
                  zIndex: 1,
                  textShadow: shadow.textGlow(color.gold, moneyGlow),
                }}
              >
                ¥310.55
              </span>
            </div>

            {/* Quip */}
            <div
              style={{
                marginTop: 10,
                fontSize: 16,
                color: color.textTertiary,
                fontFamily: font.display,
                opacity: quipOpacity,
                height: 24,
              }}
            >
              {displayQuip}
              {showCursor && (
                <span style={{ color: "#9c958b", fontWeight: fontWeight.regular }}>|</span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              width: "100%",
              borderBottom: `1px solid ${color.divider}`,
            }}
          >
            {statsData.map((stat, i) => {
              const delay = 100 + i * 10;
              const statSlide = spring({
                frame: frame - delay,
                fps,
                config: { damping: 15, stiffness: 120 },
              });
              const statOpacity = interpolate(frame, [delay, delay + 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const statY = interpolate(statSlide, [0, 1], [30, 0]);

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "16px 8px",
                    borderRight:
                      i < statsData.length - 1
                        ? `1px solid ${color.divider}`
                        : "none",
                    opacity: statOpacity,
                    transform: `translateY(${statY}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: fontWeight.semibold,
                      color: color.text,
                      fontFamily: font.display,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: color.textTertiary,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginTop: 4,
                      fontFamily: font.display,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Callout */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              backgroundColor: color.bgElevated,
              borderRadius: 6,
              padding: "12px 14px",
              width: "100%",
              opacity: calloutOpacity,
              transform: `translateY(${calloutY}px)`,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>💬</span>
            <span
              style={{
                fontSize: 14,
                lineHeight: 1.5,
                color: color.textSecondary,
                fontFamily: font.display,
              }}
            >
              Mole 小而美，tw93 大而强！这才叫真正的极客精神，佩服佩服 🙇
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              color: color.textTertiary,
              fontFamily: font.display,
            }}
          >
            感谢开源，感谢 tw93
          </div>
        </div>
      </div>

      {/* ── Overlay text (appears during/after zoom) ── */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: overlayOpacity,
          transform: `translateY(${overlayY}px)`,
          zIndex: 50,
        }}
      >
        <div
          style={{
            background: "rgba(19,19,20,0.75)",
            backdropFilter: "blur(12px)",
            borderRadius: 12,
            padding: "16px 36px",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: fontWeight.semibold,
              color: "#faf9f0",
              fontFamily: font.display,
              letterSpacing: "0.02em",
            }}
          >
            它能帮你释放几十 GB 空间，省下
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: fontWeight.heavy,
              color: color.gold,
              fontFamily: font.display,
            }}
          >
            真金白银
          </span>
        </div>
      </div>

      {/* ── Fade to black ── */}
      <AbsoluteFill
        style={{
          backgroundColor: "#131314",
          opacity: fadeOut,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};

const MoleIcon: React.FC = () => (
  <svg width="56" height="56" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="moleBodyGrad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#8a7f74" />
        <stop offset="100%" stopColor="#5c534a" />
      </radialGradient>
      <filter id="moleShadow">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#131314" floodOpacity="0.15" />
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#moleBodyGrad)" filter="url(#moleShadow)" />
    <circle cx="35" cy="40" r="8" fill="white" />
    <circle cx="65" cy="40" r="8" fill="white" />
    <circle cx="35" cy="40" r="4" fill="#3a3530" />
    <circle cx="65" cy="40" r="4" fill="#3a3530" />
    <ellipse cx="50" cy="60" rx="15" ry="10" fill="#e8a87c" />
    <circle cx="50" cy="58" r="5" fill="#3a3530" />
    <path
      d="M 35 70 Q 50 85 65 70"
      stroke="#3a3530"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);
