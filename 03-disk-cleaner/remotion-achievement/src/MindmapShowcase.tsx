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

// ── Doc-Mindmap 效果展示：PPT 文档分类思维导图 ──
//
// 三维度卡片分组滚动动画，展示 doc-mindmap 技能的产出
//
// Timeline (600 frames @ 30fps = 20s):
//   0–20    背景淡入
//  20–50    总标题淡入
//  50–210   维度1: 按主题分类（7 张卡片）
// 210–340   维度2: 按用途分类（3 张卡片）
// 340–500   维度3: 按客户分类（4 张卡片）
// 500–540   底部统计文字
// 570–600   淡出到黑

// ── Data ──

const themeGroups = [
  { icon: "🤖", title: "AI 与智能化", count: 6, accent: color.purple },
  { icon: "📊", title: "数据与数字化", count: 7, accent: color.blue },
  { icon: "📢", title: "营销策略", count: 5, accent: color.orange },
  { icon: "🏢", title: "企业介绍", count: 3, accent: color.gold },
  { icon: "🚗", title: "汽车行业", count: 3, accent: color.red },
  { icon: "📋", title: "项目管理", count: 2, accent: color.green },
  { icon: "🔧", title: "运营与团队", count: 2, accent: color.warmGray },
];

const usageGroups = [
  { icon: "📚", title: "培训材料", count: 4, accent: color.green },
  { icon: "📎", title: "内部参考", count: 19, accent: color.blue },
  { icon: "📣", title: "市场营销", count: 4, accent: color.orange },
];

const clientGroups = [
  { icon: "🏭", title: "银河汽车", count: 2, accent: color.purple },
  { icon: "🚙", title: "北极熊汽车", count: 2, accent: color.blue },
  { icon: "🚘", title: "东方神兽", count: 1, accent: color.gold },
  { icon: "📁", title: "通用方案", count: 22, accent: color.warmGray },
];

// ── Helpers ──

const Card: React.FC<{
  icon: string;
  title: string;
  count: number;
  accent: string;
  scale: number;
  opacity: number;
  float: number;
  size?: "sm" | "lg";
}> = ({ icon, title, count, accent, scale, opacity, float, size = "sm" }) => {
  const w = size === "lg" ? s(280) : s(200);
  const h = size === "lg" ? s(180) : s(150);
  return (
    <div
      style={{
        opacity,
        transform: `scale(${Math.min(scale, 1.05)}) translateY(${float}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: s(8),
      }}
    >
      <div
        style={{
          ...cardStyle(accent),
          width: w,
          height: h,
          borderRadius: radius.xl,
          boxShadow: `0 16px 40px rgba(19,19,20,0.05), ${shadow.glow(accent, 0.08)}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: s(10),
          position: "relative",
        }}
      >
        <span style={{ fontSize: size === "lg" ? s(48) : s(40) }}>
          {icon}
        </span>
        <div
          style={{
            fontSize: size === "lg" ? s(24) : s(20),
            fontWeight: fontWeight.semibold,
            color: color.text,
            fontFamily: font.display,
          }}
        >
          {title}
        </div>
        {/* Count badge */}
        <div
          style={{
            position: "absolute",
            top: s(10),
            right: s(12),
            fontSize: s(14),
            fontWeight: fontWeight.bold,
            color: accent,
            fontFamily: font.mono,
            background: `${accent}12`,
            borderRadius: radius.full,
            padding: `${s(2)}px ${s(10)}px`,
          }}
        >
          {count}
        </div>
      </div>
    </div>
  );
};

export const MindmapShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Main title ──
  const titleOpacity = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [20, 42], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Dimension visibility windows ──
  // Dim 1: 按主题 (50–210)
  const dim1Opacity = interpolate(frame, [50, 60, 200, 220], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Dim 2: 按用途 (210–340)
  const dim2Opacity = interpolate(frame, [210, 225, 330, 350], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Dim 3: 按客户 (340–500)
  const dim3Opacity = interpolate(frame, [340, 355, 490, 510], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottom stats ──
  const statsOpacity = interpolate(frame, [500, 525], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statsY = interpolate(frame, [500, 525], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [570, 600], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Card animation helper ──
  const cardAnim = (baseDelay: number, index: number, interval: number) => {
    const delay = baseDelay + index * interval;
    const sc = spring({
      frame: frame - delay,
      fps,
      config: { damping: 11, stiffness: 140, mass: 0.7 },
    });
    const op = interpolate(frame, [delay, delay + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fl =
      frame > delay + 50
        ? Math.sin((frame - delay) * 0.04 + index * 1.4) * 3
        : 0;
    return { scale: sc, opacity: op, float: fl };
  };

  // ── Section label style ──
  const sectionLabel = (text: string, opacity: number): React.ReactNode => (
    <div
      style={{
        fontSize: s(20),
        fontWeight: fontWeight.medium,
        color: color.orange,
        fontFamily: font.mono,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        opacity,
        marginBottom: s(24),
      }}
    >
      {text}
    </div>
  );

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
        <div style={noiseOverlay} />

        {/* Main title — always visible until fade out */}
        <div
          style={{
            position: "absolute",
            top: s(50),
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              fontSize: s(36),
              fontWeight: fontWeight.semibold,
              color: color.text,
              fontFamily: font.display,
              letterSpacing: "0.02em",
            }}
          >
            PPT 文档分类思维导图
          </div>
          <div
            style={{
              fontSize: s(18),
              fontWeight: fontWeight.regular,
              color: color.textSecondary,
              fontFamily: font.display,
              marginTop: s(8),
            }}
          >
            doc-mindmap 智能整理产出
          </div>
        </div>

        {/* ── Dimension 1: 按主题分类 ── */}
        <div
          style={{
            position: "absolute",
            top: s(130),
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: dim1Opacity,
          }}
        >
          {sectionLabel("按主题分类", 1)}
          {/* Row 1: 4 cards */}
          <div
            style={{
              display: "flex",
              gap: s(24),
              justifyContent: "center",
              marginBottom: s(20),
            }}
          >
            {themeGroups.slice(0, 4).map((g, i) => {
              const a = cardAnim(60, i, 15);
              return (
                <Card
                  key={i}
                  {...g}
                  scale={a.scale}
                  opacity={a.opacity}
                  float={a.float}
                />
              );
            })}
          </div>
          {/* Row 2: 3 cards */}
          <div
            style={{
              display: "flex",
              gap: s(24),
              justifyContent: "center",
            }}
          >
            {themeGroups.slice(4).map((g, i) => {
              const a = cardAnim(60, i + 4, 15);
              return (
                <Card
                  key={i + 4}
                  {...g}
                  scale={a.scale}
                  opacity={a.opacity}
                  float={a.float}
                />
              );
            })}
          </div>
        </div>

        {/* ── Dimension 2: 按用途分类 ── */}
        <div
          style={{
            position: "absolute",
            top: s(130),
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: dim2Opacity,
          }}
        >
          {sectionLabel("按用途分类", 1)}
          <div
            style={{
              display: "flex",
              gap: s(36),
              justifyContent: "center",
            }}
          >
            {usageGroups.map((g, i) => {
              const a = cardAnim(230, i, 20);
              return (
                <Card
                  key={i}
                  {...g}
                  scale={a.scale}
                  opacity={a.opacity}
                  float={a.float}
                  size="lg"
                />
              );
            })}
          </div>
        </div>

        {/* ── Dimension 3: 按客户分类 ── */}
        <div
          style={{
            position: "absolute",
            top: s(130),
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: dim3Opacity,
          }}
        >
          {sectionLabel("按客户分类", 1)}
          <div
            style={{
              display: "flex",
              gap: s(30),
              justifyContent: "center",
            }}
          >
            {clientGroups.map((g, i) => {
              const a = cardAnim(360, i, 18);
              return (
                <Card
                  key={i}
                  {...g}
                  scale={a.scale}
                  opacity={a.opacity}
                  float={a.float}
                  size="lg"
                />
              );
            })}
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <div
          style={{
            position: "absolute",
            bottom: s(60),
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: statsOpacity,
            transform: `translateY(${statsY}px)`,
          }}
        >
          <div
            style={{
              fontSize: s(22),
              color: color.textSecondary,
              fontFamily: font.display,
            }}
          >
            <span
              style={{
                color: color.text,
                fontWeight: fontWeight.semibold,
              }}
            >
              27
            </span>
            {" 份 PPT · "}
            <span
              style={{
                color: color.purple,
                fontWeight: fontWeight.semibold,
              }}
            >
              7
            </span>
            {" 个主题 · "}
            <span
              style={{
                color: color.blue,
                fontWeight: fontWeight.semibold,
              }}
            >
              3
            </span>
            {" 种用途 · "}
            <span
              style={{
                color: color.gold,
                fontWeight: fontWeight.semibold,
              }}
            >
              4
            </span>
            {" 类客户"}
          </div>
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
