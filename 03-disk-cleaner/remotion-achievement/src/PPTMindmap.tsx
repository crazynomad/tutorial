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
  shadow,
  noiseOverlay,
  s,
} from "./lib/theme";

// ── PPT 文档分类思维导图动画（双侧水平布局）──
// 中心节点居中，左侧 3 个分支 + 右侧 4 个分支
// 用贝塞尔曲线连接，节点为圆角卡片
//
// Timeline (600 frames @ 30fps = 20s):
//   0–20    背景渐入
//  20–50    中心节点弹入
//  50–80    标题淡入
//  80–340   7 个分支依次展开（每个约 35 帧间隔）
// 350–520   Hold，微浮动
// 530–560   底部文字淡入
// 560–600   淡出至黑

interface Branch {
  icon: string;
  label: string;
  files: string[];
  color: string;
  side: "left" | "right";
  yOffset: number; // vertical position relative to center
}

const branches: Branch[] = [
  // ── Left side (top to bottom) ──
  {
    icon: "🤖",
    label: "AI 与智能化",
    files: ["AI驱动产品管理实战指南", "彩虹独角兽智能化体系方案"],
    color: color.purple,
    side: "left",
    yOffset: -200,
  },
  {
    icon: "📊",
    label: "数据与数字化",
    files: ["北极熊BI三年规划", "C端数字化能力规划"],
    color: color.blue,
    side: "left",
    yOffset: 0,
  },
  {
    icon: "📢",
    label: "营销策略",
    files: ["飞天8号专区营销方案", "金丝雀品牌危机监测"],
    color: color.orange,
    side: "left",
    yOffset: 200,
  },
  // ── Right side (top to bottom) ──
  {
    icon: "🏢",
    label: "企业能力展示",
    files: ["彩虹独角兽2025汽车AI能力"],
    color: color.green,
    side: "right",
    yOffset: -240,
  },
  {
    icon: "🚗",
    label: "汽车行业专项",
    files: ["四轮百科全链路数字化", "DMS运维优化"],
    color: color.red,
    side: "right",
    yOffset: -60,
  },
  {
    icon: "📋",
    label: "项目管理与敏捷",
    files: ["SAFe诊断指南", "LPM精益组合管理"],
    color: color.gold,
    side: "right",
    yOffset: 120,
  },
  {
    icon: "🔧",
    label: "运营与团队",
    files: ["KPI改进与团队配置"],
    color: color.blue,
    side: "right",
    yOffset: 270,
  },
];

const CENTER_X = 960;
const CENTER_Y = 470;
const ARM_LENGTH = s(310); // horizontal distance from center to branch
const NODE_W = s(200);
const NODE_H_BASE = s(68); // base height, grows with files count

export const PPTMindmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Center node ──
  const centerScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.8 },
  });
  const centerOpacity = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Title ──
  const titleOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [50, 70], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Center glow pulse
  const glowPulse =
    frame > 60 ? 0.25 + Math.sin(frame * 0.05) * 0.12 : 0;

  // ── Bottom text ──
  const bottomOpacity = interpolate(frame, [530, 555], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomY = interpolate(frame, [530, 555], [15, 0], {
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
        }}
      >
        <div style={noiseOverlay} />

        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: s(38),
            width: "100%",
            textAlign: "center",
            fontFamily: font.display,
            fontSize: s(32),
            fontWeight: fontWeight.semibold,
            color: color.text,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: "0.03em",
          }}
        >
          28 份 PPT → AI 自动生成知识图谱
        </div>

        {/* SVG bezier connections */}
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
            <filter id="mmGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {branches.map((branch, i) => {
            const delay = 80 + i * 35;
            const lineProgress = interpolate(
              frame,
              [delay, delay + 25],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (lineProgress <= 0) return null;

            const isLeft = branch.side === "left";
            const nodeX = isLeft
              ? CENTER_X - ARM_LENGTH
              : CENTER_X + ARM_LENGTH;
            const nodeY = CENTER_Y + branch.yOffset;

            // Bezier control points: horizontal S-curve
            const cpOffset = ARM_LENGTH * 0.55;
            const cx1 = isLeft ? CENTER_X - cpOffset : CENTER_X + cpOffset;
            const cy1 = CENTER_Y;
            const cx2 = isLeft ? nodeX + cpOffset : nodeX - cpOffset;
            const cy2 = nodeY;

            const pathD = `M ${CENTER_X} ${CENTER_Y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${nodeX} ${nodeY}`;

            // Animate by drawing partial path
            const totalLen = 600; // approx path length
            const dashLen = totalLen * lineProgress;

            return (
              <React.Fragment key={`line-${i}`}>
                {/* Glow line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={branch.color}
                  strokeWidth={5}
                  strokeOpacity={lineProgress * 0.1}
                  strokeDasharray={`${dashLen} ${totalLen}`}
                  filter="url(#mmGlow)"
                />
                {/* Main line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={branch.color}
                  strokeWidth={2}
                  strokeOpacity={lineProgress * 0.5}
                  strokeDasharray={`${dashLen} ${totalLen}`}
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Branch nodes */}
        {branches.map((branch, i) => {
          const delay = 80 + i * 35;
          const isLeft = branch.side === "left";
          const nodeX = isLeft
            ? CENTER_X - ARM_LENGTH
            : CENTER_X + ARM_LENGTH;
          const nodeY = CENTER_Y + branch.yOffset;

          const nodeScale = spring({
            frame: frame - (delay + 12),
            fps,
            config: { damping: 12, stiffness: 160, mass: 0.6 },
          });
          const nodeOpacity = interpolate(
            frame,
            [delay + 12, delay + 22],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // File labels fade in after node
          const filesOpacity = interpolate(
            frame,
            [delay + 28, delay + 42],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const filesSlide = interpolate(
            frame,
            [delay + 28, delay + 42],
            [6, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          // Float animation during hold phase
          const float =
            frame > delay + 60
              ? Math.sin((frame - delay) * 0.03 + i * 1.5) * 3
              : 0;

          const nodeH = NODE_H_BASE + branch.files.length * s(18);

          return (
            <div
              key={`node-${i}`}
              style={{
                position: "absolute",
                left: nodeX - NODE_W / 2,
                top: nodeY - nodeH / 2 + float,
                width: NODE_W,
                opacity: nodeOpacity,
                transform: `scale(${Math.min(nodeScale, 1.04)})`,
                transformOrigin: isLeft ? "right center" : "left center",
              }}
            >
              {/* Card */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${branch.color}0a, ${branch.color}04)`,
                  border: `1.5px solid ${branch.color}40`,
                  borderRadius: s(14),
                  padding: `${s(10)}px ${s(14)}px`,
                  boxShadow: `0 2px 12px ${branch.color}10`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isLeft ? "flex-end" : "flex-start",
                  gap: s(4),
                }}
              >
                {/* Header: icon + label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: s(7),
                    flexDirection: isLeft ? "row-reverse" : "row",
                  }}
                >
                  <span style={{ fontSize: s(22) }}>{branch.icon}</span>
                  <span
                    style={{
                      fontFamily: font.display,
                      fontSize: s(16),
                      fontWeight: fontWeight.bold,
                      color: branch.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {branch.label}
                  </span>
                </div>

                {/* File pills */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: s(3),
                    opacity: filesOpacity,
                    transform: `translateY(${filesSlide}px)`,
                    alignItems: isLeft ? "flex-end" : "flex-start",
                  }}
                >
                  {branch.files.map((f, j) => (
                    <div
                      key={j}
                      style={{
                        fontFamily: font.display,
                        fontSize: s(10),
                        color: color.textSecondary,
                        background: `${branch.color}0c`,
                        padding: `${s(2)}px ${s(8)}px`,
                        borderRadius: s(6),
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: NODE_W - s(20),
                      }}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Center node */}
        <div
          style={{
            position: "absolute",
            left: CENTER_X - s(72),
            top: CENTER_Y - s(72),
            width: s(144),
            height: s(144),
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #f3f0e8 0%, #efe9dc 100%)",
            border: `2px solid ${color.borderAccent}`,
            boxShadow: `0 0 30px rgba(217,119,87,${glowPulse}), 0 4px 16px rgba(19,19,20,0.06)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: s(5),
            opacity: centerOpacity,
            transform: `scale(${Math.min(centerScale, 1.05)})`,
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: s(36) }}>📑</span>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(14),
              fontWeight: fontWeight.bold,
              color: color.text,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            28 份 PPT
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(11),
              color: color.textSecondary,
            }}
          >
            7 大主题
          </div>
        </div>

        {/* Bottom stats */}
        <div
          style={{
            position: "absolute",
            bottom: s(50),
            width: "100%",
            textAlign: "center",
            fontFamily: font.display,
            fontSize: s(22),
            color: color.textTertiary,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
          }}
        >
          <span style={{ color: color.purple, fontWeight: fontWeight.semibold }}>
            7 大主题
          </span>
          {" · "}
          <span style={{ color: color.blue, fontWeight: fontWeight.semibold }}>
            3 种用途
          </span>
          {" · "}
          <span style={{ color: color.gold, fontWeight: fontWeight.semibold }}>
            4 个客户
          </span>
          {" — AI 一键生成"}
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
