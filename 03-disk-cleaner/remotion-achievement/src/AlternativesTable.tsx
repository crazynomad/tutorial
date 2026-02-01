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
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 08: 免费替代方案 (13:00–14:00) ──
// 两款免费替代工具对比表格，行逐行滑入，当前行高亮
//
// Timeline (1800 frames @ 30fps = 60s):
//   0–30     背景 + 标题渐入
//  40–80     表头行淡入
//  90–280    Row 1: Open Code — 高亮进入 → 停留 → 消退
// 310–500    Row 2: Gemini CLI — 高亮进入 → 停留 → 消退
// 530–800    全表格同时展示，无高亮
// 800–1200   底部旁白文字淡入 + Hold
// 1200–1700  Hold
// 1700–1800  淡出至黑

const rows = [
  {
    icon: "🟢",
    name: "Open Code",
    feature: "开源免费，社区驱动",
    audience: "想省钱的用户",
    color: color.green,
  },
  {
    icon: "🔵",
    name: "Gemini CLI",
    feature: "Google 出品，免费额度",
    audience: "想尝鲜的用户",
    color: color.blue,
  },
];

const TABLE_W = s(900);
const COL_WIDTHS = [s(280), s(340), s(280)]; // name, feature, audience

export const AlternativesTable: React.FC = () => {
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

  // ── Header row ──
  const headerOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottom text ──
  const bottomOpacity = interpolate(frame, [800, 840], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [800, 840], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [1700, 1800], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headers = ["工具", "特点", "适合谁"];

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
          免费替代方案
        </div>

        {/* Table */}
        <div
          style={{
            marginTop: s(60),
            width: TABLE_W,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              opacity: headerOpacity,
              borderBottom: `1px solid ${color.divider}`,
              paddingBottom: s(16),
              marginBottom: s(8),
            }}
          >
            {headers.map((h, ci) => (
              <div
                key={ci}
                style={{
                  width: COL_WIDTHS[ci],
                  fontSize: s(18),
                  fontWeight: fontWeight.semibold,
                  color: color.textTertiary,
                  fontFamily: font.display,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, i) => {
            const delay = 90 + i * 190;

            // Row slide in
            const rowScale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 14, stiffness: 120, mass: 0.7 },
            });
            const rowOpacity = interpolate(
              frame,
              [delay, delay + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            const rowX = interpolate(
              frame,
              [delay, delay + 25],
              [-30, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              }
            );

            // Highlight: active during spotlight window
            const highlightStart = delay + 20;
            const highlightEnd = delay + 140;
            const isHighlighted =
              frame >= highlightStart && frame < highlightEnd;

            // After all rows shown (frame > 530), no highlight
            const allShown = frame >= 530;
            const highlight = isHighlighted && !allShown;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: `${s(18)}px 0`,
                  borderBottom: `1px solid ${color.borderSubtle}`,
                  opacity: rowOpacity,
                  transform: `translateX(${rowX}px) scale(${Math.min(rowScale, 1.02)})`,
                  background: highlight
                    ? `${row.color}08`
                    : "transparent",
                  borderLeft: highlight
                    ? `3px solid ${row.color}`
                    : "3px solid transparent",
                  paddingLeft: s(16),
                  borderRadius: s(4),
                  transition: "background 0.3s, border-left 0.3s",
                }}
              >
                {/* Name */}
                <div
                  style={{
                    width: COL_WIDTHS[0],
                    display: "flex",
                    alignItems: "center",
                    gap: s(12),
                  }}
                >
                  <span style={{ fontSize: s(24) }}>{row.icon}</span>
                  <span
                    style={{
                      fontSize: s(24),
                      fontWeight: fontWeight.bold,
                      color: highlight ? row.color : color.text,
                      fontFamily: font.display,
                      transition: "color 0.3s",
                    }}
                  >
                    {row.name}
                  </span>
                </div>

                {/* Feature */}
                <div
                  style={{
                    width: COL_WIDTHS[1],
                    fontSize: s(20),
                    color: color.textSecondary,
                    fontFamily: font.display,
                  }}
                >
                  {row.feature}
                </div>

                {/* Audience */}
                <div
                  style={{
                    width: COL_WIDTHS[2],
                    fontSize: s(18),
                    color: color.textSecondary,
                    fontFamily: font.display,
                    fontWeight: fontWeight.medium,
                  }}
                >
                  {row.audience}
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
            textAlign: "center",
          }}
        >
          如果你还在观望，可以先试试
          <span style={{ color: color.green, fontWeight: fontWeight.semibold }}>
            {" "}
            免费的替代方案
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
