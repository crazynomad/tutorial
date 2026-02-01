import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import {
  color,
  font,
  fontWeight,
  gradient,
  shadow,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 01: ROI 数据快闪 (0:35–0:42) ──
// 2-3 条数据快速闪入闪出，冲击力拉满
//
// Timeline (210 frames @ 30fps = 7s):
//   0–10     背景渐入
//  10–70     数据 1: "10,000+ 工单/月自动化" 闪入 → Hold → 闪出
//  70–130    数据 2: "6周恢复 $1.2M 销售管道" 闪入 → Hold → 闪出
// 130–190    数据 3: "而且他们都不是程序员" 闪入强调
// 190–210    淡出至黑

const flashData = [
  {
    number: "10,000+",
    unit: "工单/月",
    desc: "自动化处理，响应提速 65%",
    accent: color.blue,
  },
  {
    number: "$1.2M",
    unit: "销售管道",
    desc: "6 周内恢复，医疗健康平台",
    accent: color.green,
  },
];

const punchline = "而且他们都不是程序员";

export const ROIFlash: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [190, 210], [0, 1], {
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Flash data */}
        {flashData.map((item, i) => {
          const start = 10 + i * 60;
          const inOpacity = interpolate(
            frame,
            [start, start + 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const outOpacity = interpolate(
            frame,
            [start + 45, start + 55],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const opacity = Math.min(inOpacity, outOpacity);

          const scale = interpolate(
            frame,
            [start, start + 8],
            [1.1, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <AbsoluteFill
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: s(12),
                opacity,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: s(12),
                  transform: `scale(${scale})`,
                }}
              >
                <span
                  style={{
                    fontSize: s(96),
                    fontWeight: fontWeight.heavy,
                    color: item.accent,
                    fontFamily: font.display,
                    letterSpacing: "-0.02em",
                    textShadow: shadow.textGlow(item.accent, 0.4),
                  }}
                >
                  {item.number}
                </span>
                <span
                  style={{
                    fontSize: s(32),
                    fontWeight: fontWeight.semibold,
                    color: color.textSecondary,
                    fontFamily: font.display,
                  }}
                >
                  {item.unit}
                </span>
              </div>
              <div
                style={{
                  fontSize: s(22),
                  color: color.textTertiary,
                  fontFamily: font.display,
                }}
              >
                {item.desc}
              </div>
            </AbsoluteFill>
          );
        })}

        {/* Punchline */}
        {(() => {
          const pStart = 130;
          const pOpacity = interpolate(
            frame,
            [pStart, pStart + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const pScale = interpolate(
            frame,
            [pStart, pStart + 10],
            [1.08, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <AbsoluteFill
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: pOpacity,
              }}
            >
              <div
                style={{
                  fontSize: s(52),
                  fontWeight: fontWeight.heavy,
                  color: color.gold,
                  fontFamily: font.display,
                  transform: `scale(${pScale})`,
                  textShadow: shadow.textGlow(color.gold, 0.3),
                  letterSpacing: "0.03em",
                }}
              >
                {punchline}
              </div>
            </AbsoluteFill>
          );
        })()}

        {/* Noise overlay */}
        <div style={noiseOverlay} />
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
