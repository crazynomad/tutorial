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

// ── 三阶段流水线: 瘦身→收纳→提炼 ──
// 三个阶段卡片水平排列 + SVG 连线箭头
//
// Timeline (450 frames @ 30fps = 15s):
//   0–20    背景渐入
//  20–50    顶部横幅弹入
//  50–90    Phase 1 卡片弹入
//  90–120   连线 1 绘制
// 120–160   Phase 2 卡片弹入
// 160–190   连线 2 绘制
// 190–230   Phase 3 卡片弹入
// 240–380   Hold，微浮动 + 流动粒子
// 390–420   底部文字淡入
// 420–450   淡出至黑

const phases = [
  {
    icon: "🧹",
    label: "瘦身",
    title: "disk-cleaner",
    desc: "Phase 1",
    color: color.orange,
  },
  {
    icon: "📂",
    label: "收纳",
    title: "file-organizer",
    desc: "Phase 2",
    color: color.blue,
  },
  {
    icon: "🧠",
    label: "提炼",
    title: "doc-mindmap",
    desc: "Phase 3",
    color: color.purple,
  },
];

const CARD_W = s(320);
const CARD_H = s(260);
const GAP = s(120);
const Y_CENTER = 440;

export const FileMasterPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Banner ──
  const bannerScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });
  const bannerOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottom text ──
  const bottomOpacity = interpolate(frame, [390, 415], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [390, 415], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [420, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Card positions (centered)
  const totalW = CARD_W * 3 + GAP * 2;
  const startX = (1920 - totalW) / 2;

  // Card delays
  const cardDelays = [50, 120, 190];
  // Line delays (between cards)
  const lineDelays = [90, 160];

  // Flow particles phase
  const beamPhase = frame * 0.06;
  const beamOpacity = interpolate(frame, [240, 260], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* Top banner */}
        <div
          style={{
            position: "absolute",
            top: s(100),
            width: "100%",
            textAlign: "center",
            opacity: bannerOpacity,
            transform: `scale(${Math.min(bannerScale, 1.05)})`,
          }}
        >
          <span
            style={{
              fontFamily: font.display,
              fontSize: s(40),
              fontWeight: fontWeight.bold,
              color: color.text,
              letterSpacing: "-0.02em",
            }}
          >
            瘦身 → 收纳 → 提炼
          </span>
          <span
            style={{
              fontFamily: font.display,
              fontSize: s(28),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              marginLeft: s(16),
            }}
          >
            一键串联三阶段
          </span>
        </div>

        {/* SVG connection lines + flow particles */}
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
          <defs>
            <marker
              id="arrowHead"
              markerWidth="12"
              markerHeight="8"
              refX="10"
              refY="4"
              orient="auto"
            >
              <polygon
                points="0,0 12,4 0,8"
                fill={color.textSecondary}
                fillOpacity={0.7}
              />
            </marker>
          </defs>

          {lineDelays.map((delay, i) => {
            const lineProgress = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const x1 = startX + CARD_W * (i + 1) + GAP * i;
            const x2 = startX + CARD_W * (i + 1) + GAP * (i + 1);
            const lineY = Y_CENTER;
            const currentX2 = x1 + (x2 - x1) * lineProgress;

            return (
              <React.Fragment key={`line-${i}`}>
                {/* Main line */}
                <line
                  x1={x1 + 8}
                  y1={lineY}
                  x2={currentX2 - 8}
                  y2={lineY}
                  stroke={phases[i + 1].color}
                  strokeWidth={2}
                  strokeOpacity={lineProgress * 0.6}
                  markerEnd={lineProgress > 0.9 ? "url(#arrowHead)" : undefined}
                />
                {/* Glow line */}
                <line
                  x1={x1 + 8}
                  y1={lineY}
                  x2={currentX2 - 8}
                  y2={lineY}
                  stroke={phases[i + 1].color}
                  strokeWidth={6}
                  strokeOpacity={lineProgress * 0.1}
                  filter="url(#lineGlow)"
                />

                {/* Flow particles */}
                {beamOpacity > 0 &&
                  [0, 1, 2].map((p) => {
                    const t = (beamPhase + p * 0.33) % 1;
                    const px = x1 + 8 + (x2 - x1 - 16) * t;
                    return (
                      <circle
                        key={`fp-${i}-${p}`}
                        cx={px}
                        cy={lineY}
                        r={4}
                        fill={phases[i + 1].color}
                        opacity={
                          beamOpacity *
                          (0.4 + 0.6 * Math.sin(t * Math.PI))
                        }
                      />
                    );
                  })}
              </React.Fragment>
            );
          })}

          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </svg>

        {/* Phase cards */}
        {phases.map((phase, i) => {
          const delay = cardDelays[i];
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
            frame > delay + 50
              ? Math.sin((frame - delay) * 0.04 + i * 1.5) * 4
              : 0;

          const cardX = startX + i * (CARD_W + GAP);

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cardX,
                top: Y_CENTER - CARD_H / 2 + float,
                width: CARD_W,
                height: CARD_H,
                ...cardStyle(phase.color),
                borderRadius: radius.xl,
                boxShadow: `0 16px 40px rgba(19,19,20,0.06), ${shadow.glow(phase.color, 0.1)}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: s(14),
                opacity: cardOpacity,
                transform: `scale(${Math.min(cardScale, 1.05)})`,
              }}
            >
              <span style={{ fontSize: s(56) }}>{phase.icon}</span>
              <div
                style={{
                  fontSize: s(36),
                  fontWeight: fontWeight.bold,
                  color: color.text,
                  fontFamily: font.display,
                }}
              >
                {phase.desc}「{phase.label}」
              </div>
              <div
                style={{
                  fontSize: s(16),
                  fontWeight: fontWeight.medium,
                  color: phase.color,
                  fontFamily: font.mono,
                  letterSpacing: "0.04em",
                }}
              >
                {phase.title}
              </div>
            </div>
          );
        })}

        {/* Bottom text */}
        <div
          style={{
            position: "absolute",
            bottom: s(80),
            width: "100%",
            textAlign: "center",
            fontFamily: font.display,
            fontSize: s(24),
            color: color.textTertiary,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
          }}
        >
          一句话启动，三步自动完成
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
