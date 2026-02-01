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

// ── SkillValue：doc-mindmap 价值展示 ──
//
// 口播 07:46–08:34（~47s = 1420 帧 @30fps）
//
// Timeline:
//   0–90     背景淡入 + 三维度 Tab 胶囊淡入
//  90–220    「按客户」高亮 → 客户卡弹入
// 220–340    「按主题」高亮 → 主题卡网格
// 340–450    「按用途」高亮 → 用途大卡
// 450–650    摘要卡片 + 打字机效果
// 650–880    「个人知识库」大字 + 工具对比
// 880–1350   Before/After 左右分屏
// 1350–1420  doc-mindmap 金色徽章 + fade out

// ── Data ──

const dimensions = ["按客户", "按主题", "按用途"] as const;

const clientGroups = [
  { icon: "🐻‍❄️", title: "北极熊", count: 2, accent: color.blue },
  { icon: "🚀", title: "银河汽车", count: 1, accent: color.purple },
  { icon: "🐉", title: "东方神兽", count: 1, accent: color.gold },
  { icon: "📁", title: "通用方案", count: 23, accent: color.warmGray },
];

const clientExpandFiles = ["北极熊DMS三年优化运维方案.pptx", "北极熊售后数字化平台规划.pptx"];

const themeGroups = [
  { icon: "🤖", title: "AI与智能化", count: 6, accent: color.purple },
  { icon: "📊", title: "数据与数字化", count: 7, accent: color.blue },
  { icon: "📢", title: "营销策略", count: 5, accent: color.orange },
  { icon: "🏢", title: "企业介绍", count: 3, accent: color.gold },
  { icon: "🚗", title: "汽车行业", count: 3, accent: color.red },
  { icon: "📋", title: "项目管理", count: 2, accent: color.green },
  { icon: "🔧", title: "运营与团队", count: 2, accent: color.warmGray },
];

const usageGroups = [
  { icon: "📚", title: "培训材料", count: 4, accent: color.green },
  { icon: "📣", title: "市场营销", count: 4, accent: color.orange },
  { icon: "📎", title: "内部参考", count: 19, accent: color.blue },
];

const summaryFile = "彩虹独角兽六大工程化能力体系.pptx";
const summaryText =
  "以「稳基础→理流程→真数据→生智能」为路径，构建六大核心工程化能力闭环...";

const beforeFiles = [
  "ct2ifrqzccgh1zk (1).pptx",
  "AI (1).pptx",
  "mck_restructured_v1.pptx",
  "DMS.pptx",
  "tmpbusc_qc9.pptx",
  "1、招标答疑文件-DPAD.pptx",
];

const afterFiles = [
  "彩虹独角兽六大工程化能力体系.pptx",
  "AI驱动产品管理实战指南.pptx",
  "C端触点整合用户数据管理策略.pptx",
  "北极熊DMS三年优化运维方案.pptx",
  "tmpbusc_qc9幻灯片展示.pptx",
  "闪电3000特别版车型提升方案.pptx",
];

// ── Helpers ──

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const DimCard: React.FC<{
  icon: string;
  title: string;
  count: number;
  accent: string;
  scale: number;
  opacity: number;
  float: number;
  size?: "sm" | "lg";
  highlight?: boolean;
  children?: React.ReactNode;
}> = ({
  icon,
  title,
  count,
  accent,
  scale,
  opacity,
  float,
  size = "sm",
  highlight = false,
  children,
}) => {
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
          boxShadow: highlight
            ? `0 16px 40px rgba(19,19,20,0.08), ${shadow.glow(accent, 0.2)}`
            : `0 16px 40px rgba(19,19,20,0.05), ${shadow.glow(accent, 0.08)}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: s(10),
          position: "relative",
          border: highlight
            ? `2px solid ${accent}`
            : `1px solid ${accent}18`,
        }}
      >
        <span style={{ fontSize: size === "lg" ? s(48) : s(40) }}>{icon}</span>
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
      {children}
    </div>
  );
};

export const SkillValue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase 1: Background + Tab capsules (0–90) ──
  const bgOpacity = interpolate(frame, [0, 25], [0, 1], clamp);

  const tabOpacity = (i: number) =>
    interpolate(frame, [30 + i * 15, 50 + i * 15], [0, 1], clamp);

  const tabY = (i: number) =>
    interpolate(frame, [30 + i * 15, 50 + i * 15], [12, 0], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });

  // Which tab is active?
  const activeTab =
    frame < 90 ? -1 : frame < 220 ? 0 : frame < 340 ? 1 : frame < 450 ? 2 : -1;

  // Tab bar visible during phases 1-4
  const tabBarOpacity = interpolate(frame, [0, 30, 440, 460], [0, 1, 1, 0], clamp);

  // ── Phase 2: Client cards (90–220) ──
  const clientOpacity = interpolate(
    frame,
    [90, 105, 210, 230],
    [0, 1, 1, 0],
    clamp,
  );

  const clientCardAnim = (i: number) => {
    const delay = 100 + i * 18;
    const sc = spring({
      frame: frame - delay,
      fps,
      config: { damping: 11, stiffness: 140, mass: 0.7 },
    });
    const op = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
    const fl =
      frame > delay + 50
        ? Math.sin((frame - delay) * 0.04 + i * 1.4) * 3
        : 0;
    return { scale: sc, opacity: op, float: fl };
  };

  // Expand files under 北极熊 card
  const expandOpacity = interpolate(frame, [155, 175], [0, 1], clamp);
  const expandY = interpolate(frame, [155, 175], [10, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 3: Theme cards (220–340) ──
  const themeOpacity = interpolate(
    frame,
    [220, 238, 330, 350],
    [0, 1, 1, 0],
    clamp,
  );

  const themeCardAnim = (i: number) => {
    const delay = 235 + i * 12;
    const sc = spring({
      frame: frame - delay,
      fps,
      config: { damping: 11, stiffness: 140, mass: 0.7 },
    });
    const op = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
    const fl =
      frame > delay + 40
        ? Math.sin((frame - delay) * 0.04 + i * 1.4) * 3
        : 0;
    return { scale: sc, opacity: op, float: fl };
  };

  // Highlight AI产品管理 and 数据治理
  const highlightPulse =
    frame >= 280 && frame <= 340
      ? 0.6 + 0.4 * Math.sin((frame - 280) * 0.15)
      : 0;

  // ── Phase 4: Usage cards (340–450) ──
  const usageOpacity = interpolate(
    frame,
    [340, 358, 440, 460],
    [0, 1, 1, 0],
    clamp,
  );

  const usageCardAnim = (i: number) => {
    const delay = 355 + i * 20;
    const sc = spring({
      frame: frame - delay,
      fps,
      config: { damping: 11, stiffness: 140, mass: 0.7 },
    });
    const op = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
    const fl =
      frame > delay + 50
        ? Math.sin((frame - delay) * 0.04 + i * 1.4) * 3
        : 0;
    return { scale: sc, opacity: op, float: fl };
  };

  // ── Phase 5: Summary card with typewriter (450–650) ──
  const summaryOpacity = interpolate(
    frame,
    [450, 475, 640, 660],
    [0, 1, 1, 0],
    clamp,
  );
  const summaryScale = spring({
    frame: frame - 460,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });

  const typewriterChars = Math.max(
    0,
    Math.floor((frame - 500) * 0.8),
  );
  const displayedSummary = summaryText.slice(
    0,
    Math.min(typewriterChars, summaryText.length),
  );
  const checkOpacity = interpolate(frame, [590, 610], [0, 1], clamp);

  // ── Phase 6: Personal knowledge base (650–880) ──
  const pkbOpacity = interpolate(
    frame,
    [650, 675, 870, 895],
    [0, 1, 1, 0],
    clamp,
  );
  const pkbTitleScale = spring({
    frame: frame - 660,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.9 },
  });
  const pkbCompareOpacity = interpolate(frame, [720, 750], [0, 1], clamp);
  const pkbCompareY = interpolate(frame, [720, 750], [20, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 7: Before/After split (880–1350) ──
  const baOpacity = interpolate(
    frame,
    [880, 910, 1340, 1365],
    [0, 1, 1, 0],
    clamp,
  );

  const baLabelOpacity = interpolate(frame, [895, 920], [0, 1], clamp);

  const beforeRowOpacity = (i: number) =>
    interpolate(frame, [920 + i * 25, 940 + i * 25], [0, 1], clamp);
  const beforeRowX = (i: number) =>
    interpolate(frame, [920 + i * 25, 940 + i * 25], [-30, 0], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });

  // Arrow
  const arrowOpacity = interpolate(frame, [1080, 1110], [0, 1], clamp);
  const arrowScale = spring({
    frame: frame - 1090,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  // After rows stagger
  const afterRowOpacity = (i: number) =>
    interpolate(frame, [1120 + i * 30, 1145 + i * 30], [0, 1], clamp);
  const afterRowX = (i: number) =>
    interpolate(frame, [1120 + i * 30, 1145 + i * 30], [30, 0], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });

  // ── Phase 8: Badge (1350–1420) ──
  const badgeOpacity = interpolate(
    frame,
    [1350, 1375, 1410, 1420],
    [0, 1, 1, 0],
    clamp,
  );
  const badgeScale = spring({
    frame: frame - 1355,
    fps,
    config: { damping: 10, stiffness: 90, mass: 1 },
  });
  const glowPulse =
    frame >= 1370
      ? 0.5 + 0.5 * Math.sin((frame - 1370) * 0.2)
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* ── Tab bar ── */}
        <div
          style={{
            position: "absolute",
            top: s(45),
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: s(16),
            opacity: tabBarOpacity,
          }}
        >
          {dimensions.map((dim, i) => {
            const isActive = activeTab === i;
            return (
              <div
                key={dim}
                style={{
                  opacity: tabOpacity(i),
                  transform: `translateY(${tabY(i)}px)`,
                  padding: `${s(8)}px ${s(28)}px`,
                  borderRadius: radius.full,
                  fontSize: s(20),
                  fontWeight: fontWeight.semibold,
                  fontFamily: font.display,
                  letterSpacing: "0.04em",
                  background: isActive ? color.terracotta : "transparent",
                  color: isActive ? color.textInverse : color.textSecondary,
                  border: isActive
                    ? `2px solid ${color.terracotta}`
                    : `1.5px solid ${color.border}`,
                  transition: "none",
                }}
              >
                {dim}
              </div>
            );
          })}
        </div>

        {/* ── Phase 2: Client cards ── */}
        <div
          style={{
            position: "absolute",
            top: s(120),
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: clientOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: s(28),
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            {clientGroups.map((g, i) => {
              const a = clientCardAnim(i);
              const isNorthPole = g.title === "北极熊";
              return (
                <DimCard
                  key={i}
                  {...g}
                  scale={a.scale}
                  opacity={a.opacity}
                  float={a.float}
                  size="lg"
                  highlight={isNorthPole && frame >= 150}
                >
                  {isNorthPole && (
                    <div
                      style={{
                        opacity: expandOpacity,
                        transform: `translateY(${expandY}px)`,
                        display: "flex",
                        flexDirection: "column",
                        gap: s(4),
                        marginTop: s(4),
                      }}
                    >
                      {clientExpandFiles.map((f, fi) => (
                        <div
                          key={fi}
                          style={{
                            fontSize: s(12),
                            color: color.textSecondary,
                            fontFamily: font.body,
                            background: color.bgCard,
                            borderRadius: radius.sm,
                            padding: `${s(3)}px ${s(10)}px`,
                            maxWidth: s(260),
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          📄 {f}
                        </div>
                      ))}
                    </div>
                  )}
                </DimCard>
              );
            })}
          </div>
        </div>

        {/* ── Phase 3: Theme cards ── */}
        <div
          style={{
            position: "absolute",
            top: s(120),
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: themeOpacity,
          }}
        >
          {/* Row 1: 4 cards */}
          <div
            style={{
              display: "flex",
              gap: s(22),
              justifyContent: "center",
              marginBottom: s(18),
            }}
          >
            {themeGroups.slice(0, 4).map((g, i) => {
              const a = themeCardAnim(i);
              const shouldHighlight =
                (g.title === "AI与智能化" || g.title === "数据与数字化") &&
                highlightPulse > 0;
              return (
                <DimCard
                  key={i}
                  {...g}
                  scale={a.scale}
                  opacity={a.opacity * (shouldHighlight ? 0.6 + highlightPulse * 0.4 : 1)}
                  float={a.float}
                  highlight={shouldHighlight}
                />
              );
            })}
          </div>
          {/* Row 2: 3 cards */}
          <div
            style={{
              display: "flex",
              gap: s(22),
              justifyContent: "center",
            }}
          >
            {themeGroups.slice(4).map((g, i) => {
              const a = themeCardAnim(i + 4);
              return (
                <DimCard
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

        {/* ── Phase 4: Usage cards ── */}
        <div
          style={{
            position: "absolute",
            top: s(120),
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: usageOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: s(36),
              justifyContent: "center",
            }}
          >
            {usageGroups.map((g, i) => {
              const a = usageCardAnim(i);
              return (
                <DimCard
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

        {/* ── Phase 5: Summary card with typewriter ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: summaryOpacity,
          }}
        >
          <div
            style={{
              ...cardStyle(),
              transform: `scale(${Math.min(summaryScale, 1.02)})`,
              width: s(680),
              padding: `${s(40)}px ${s(48)}px`,
              borderRadius: radius.xl,
              boxShadow: shadow.elevated,
              display: "flex",
              flexDirection: "column",
              gap: s(20),
              position: "relative",
            }}
          >
            {/* Color accent bar */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: s(20),
                bottom: s(20),
                width: s(5),
                borderRadius: radius.full,
                background: color.terracotta,
              }}
            />
            {/* File name */}
            <div
              style={{
                fontSize: s(22),
                fontWeight: fontWeight.semibold,
                color: color.text,
                fontFamily: font.display,
              }}
            >
              📄 {summaryFile}
            </div>
            {/* Typewriter summary */}
            <div
              style={{
                fontSize: s(18),
                fontWeight: fontWeight.regular,
                color: color.textSecondary,
                fontFamily: font.body,
                lineHeight: 1.7,
                minHeight: s(60),
              }}
            >
              {displayedSummary}
              {typewriterChars < summaryText.length && (
                <span
                  style={{
                    opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                    color: color.terracotta,
                  }}
                >
                  |
                </span>
              )}
            </div>
            {/* Check mark */}
            <div
              style={{
                opacity: checkOpacity,
                fontSize: s(18),
                color: color.green,
                fontFamily: font.display,
                fontWeight: fontWeight.semibold,
                display: "flex",
                alignItems: "center",
                gap: s(8),
              }}
            >
              <span style={{ fontSize: s(22) }}>✓</span> 秒懂
            </div>
          </div>
        </div>

        {/* ── Phase 6: Personal knowledge base ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: pkbOpacity,
            gap: s(40),
          }}
        >
          {/* Big title */}
          <div
            style={{
              fontSize: s(64),
              fontWeight: fontWeight.bold,
              color: color.text,
              fontFamily: font.display,
              letterSpacing: "-0.03em",
              transform: `scale(${Math.min(pkbTitleScale, 1.02)})`,
            }}
          >
            个人知识库
          </div>
          {/* Comparison row */}
          <div
            style={{
              opacity: pkbCompareOpacity,
              transform: `translateY(${pkbCompareY}px)`,
              display: "flex",
              alignItems: "center",
              gap: s(32),
              fontSize: s(26),
              fontFamily: font.display,
            }}
          >
            <span
              style={{
                color: color.textTertiary,
                textDecoration: "line-through",
                fontWeight: fontWeight.medium,
              }}
            >
              Notion
            </span>
            <span
              style={{
                color: color.textTertiary,
                textDecoration: "line-through",
                fontWeight: fontWeight.medium,
              }}
            >
              Obsidian
            </span>
            <span
              style={{
                color: color.textSecondary,
                fontSize: s(22),
                fontWeight: fontWeight.regular,
              }}
            >
              vs
            </span>
            <span
              style={{
                color: color.green,
                fontWeight: fontWeight.semibold,
              }}
            >
              ✓ 文件夹 + 纯文本
            </span>
          </div>
        </div>

        {/* ── Phase 7: Before/After split ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: baOpacity,
            gap: s(40),
          }}
        >
          {/* Before column */}
          <div
            style={{
              width: s(420),
              display: "flex",
              flexDirection: "column",
              gap: s(12),
            }}
          >
            <div
              style={{
                opacity: baLabelOpacity,
                fontSize: s(20),
                fontWeight: fontWeight.bold,
                color: color.textTertiary,
                fontFamily: font.mono,
                letterSpacing: "0.1em",
                marginBottom: s(12),
              }}
            >
              BEFORE · 死文件
            </div>
            {beforeFiles.map((f, i) => (
              <div
                key={i}
                style={{
                  opacity: beforeRowOpacity(i),
                  transform: `translateX(${beforeRowX(i)}px)`,
                  fontSize: s(15),
                  fontFamily: font.mono,
                  color: color.textTertiary,
                  background: "rgba(19,19,20,0.04)",
                  padding: `${s(10)}px ${s(16)}px`,
                  borderRadius: radius.md,
                  textDecoration: "line-through",
                  textDecorationColor: color.red,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {f}
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div
            style={{
              opacity: arrowOpacity,
              transform: `scale(${Math.min(arrowScale, 1.1)})`,
              fontSize: s(48),
              color: color.terracotta,
              display: "flex",
              alignItems: "center",
            }}
          >
            →
          </div>

          {/* After column */}
          <div
            style={{
              width: s(420),
              display: "flex",
              flexDirection: "column",
              gap: s(12),
            }}
          >
            <div
              style={{
                opacity: baLabelOpacity,
                fontSize: s(20),
                fontWeight: fontWeight.bold,
                color: color.green,
                fontFamily: font.mono,
                letterSpacing: "0.1em",
                marginBottom: s(12),
              }}
            >
              AFTER · 活知识库
            </div>
            {afterFiles.map((f, i) => (
              <div
                key={i}
                style={{
                  opacity: afterRowOpacity(i),
                  transform: `translateX(${afterRowX(i)}px)`,
                  fontSize: s(15),
                  fontFamily: font.display,
                  color: color.text,
                  fontWeight: fontWeight.medium,
                  background: `${color.green}08`,
                  border: `1px solid ${color.green}20`,
                  padding: `${s(10)}px ${s(16)}px`,
                  borderRadius: radius.md,
                  display: "flex",
                  alignItems: "center",
                  gap: s(8),
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ color: color.green, flexShrink: 0 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase 8: doc-mindmap badge ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: badgeOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${Math.min(badgeScale, 1.05)})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: s(20),
            }}
          >
            {/* Glow ring */}
            <div
              style={{
                width: s(140),
                height: s(140),
                borderRadius: radius.full,
                background: `radial-gradient(circle, ${color.gold}30 0%, transparent 70%)`,
                boxShadow: shadow.glow(color.gold, 0.15 + glowPulse * 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: s(100),
                  height: s(100),
                  borderRadius: radius.full,
                  background: `linear-gradient(145deg, ${color.gold}, #e6bc5a)`,
                  border: `3px solid ${color.gold}`,
                  boxShadow: `inset 0 2px 8px rgba(255,255,255,0.3), ${shadow.glow(color.gold, 0.25)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: s(48),
                }}
              >
                🗂️
              </div>
            </div>
            {/* Label */}
            <div
              style={{
                fontSize: s(32),
                fontWeight: fontWeight.bold,
                color: color.gold,
                fontFamily: font.display,
                letterSpacing: "0.02em",
                textShadow: shadow.textGlow(color.gold, 0.15),
              }}
            >
              doc-mindmap
            </div>
            <div
              style={{
                fontSize: s(18),
                color: color.textSecondary,
                fontFamily: font.body,
                fontWeight: fontWeight.regular,
              }}
            >
              这才是 skill 最厉害的地方
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
