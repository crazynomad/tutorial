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
  radius,
  cardStyle,
  iconBadge,
  noiseOverlay,
  s,
} from "./lib/theme";
import { fadeIn, slideUp } from "./lib/animations";

// ── SkillDiskCleaner ─────────────────────────────────────
// Anthropic Editorial: disk-cleaner skill principle
//
// Timeline (600 frames @ 30fps = 20s):
//   Phase 1:   0– 40   Title
//   Phase 2:  40– 90   Problem (disk full)
//   Phase 3:  90–160   Install flow
//   Phase 4: 160–280   Scan categories (2x3 grid)
//   Phase 5: 280–370   Three cleanup tiers
//   Phase 6: 370–430   Safety / whitelist
//   Phase 7: 430–520   Result + progress bar
//   Phase 8: 520–600   Hold + fade to black

// ── Data ─────────────────────────────────────────────────

const scanCategories = [
  { icon: "🌐", name: "浏览器缓存", size: "2.4 GB", accent: color.blue },
  { icon: "📋", name: "系统日志", size: "1.8 GB", accent: color.orange },
  { icon: "📦", name: "应用缓存", size: "5.1 GB", accent: color.purple },
  { icon: "🔧", name: "包管理器", size: "3.7 GB", accent: color.green },
  { icon: "🗑️", name: "废纸篓", size: "8.2 GB", accent: color.red },
  { icon: "💾", name: "大文件", size: "84.8 GB", accent: color.terracotta },
];

const tiers = [
  {
    icon: "🌬️",
    name: "Air",
    desc: "只清日志和浏览器",
    label: "低风险",
    accent: color.green,
  },
  {
    icon: "⚡",
    name: "Pro",
    desc: "推荐，平衡安全与空间",
    label: "中风险",
    accent: color.blue,
  },
  {
    icon: "🚀",
    name: "Max",
    desc: "最大化释放空间",
    label: "较高风险",
    accent: color.orange,
  },
];

const presets = ["办公文档", "开发项目", "媒体文件"];

// ── Component ────────────────────────────────────────────

export const SkillDiskCleaner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase visibility helpers ──
  const showPhase = (start: number) => frame >= start;

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phase 1: Title (0-40) ──
  const titleOpacity = fadeIn(frame, 0, 20);
  const titleSlide = slideUp(frame, 0, 20);
  const subtitleOpacity = fadeIn(frame, 10, 20);
  const subtitleSlide = slideUp(frame, 10, 20);

  // ── Phase 2: Problem (40-90) ──
  const problemOpacity = fadeIn(frame, 40, 15);
  const problemSlide = slideUp(frame, 40, 15);
  const storagePercent = interpolate(frame, [50, 75], [0, 95.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Phase 3: Install (90-160) ──
  const installBadgeScale = spring({
    frame: frame - 90,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const installOpacity = fadeIn(frame, 95, 15);
  const installSlide = slideUp(frame, 95, 15);
  const moleOpacity = fadeIn(frame, 120, 15);
  const moleSlide = slideUp(frame, 120, 15);

  // ── Phase 4: Scan Categories (160-280) ──
  const scanBadgeScale = spring({
    frame: frame - 160,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // ── Phase 5: Three Tiers (280-370) ──
  const tierBadgeScale = spring({
    frame: frame - 280,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  // ── Phase 6: Safety (370-430) ──
  const safetyBadgeScale = spring({
    frame: frame - 370,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  const shieldOpacity = fadeIn(frame, 375, 15);
  const shieldSlide = slideUp(frame, 375, 15);

  // ── Phase 7: Result (430-520) ──
  const resultOpacity = fadeIn(frame, 430, 15);
  const resultSlide = slideUp(frame, 430, 15);
  const progressFill = interpolate(frame, [440, 490], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gbCount = interpolate(frame, [445, 500], [0, 106], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const moneyCount = interpolate(frame, [460, 510], [0, 310], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const celebrationOpacity = fadeIn(frame, 500, 15);

  // ── Phase 8: Fade out (560-600) ──
  const fadeOutOpacity = interpolate(frame, [560, 600], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Step badge helper
  const stepBadge = (num: number, accent: string, scale: number) => (
    <div
      style={{
        ...iconBadge(accent, s(32)),
        transform: `scale(${Math.min(scale, 1)})`,
        fontSize: s(15),
        fontFamily: font.display,
        fontWeight: fontWeight.bold,
        color: accent,
      }}
    >
      {num}
    </div>
  );

  // Step label pill helper
  const stepLabel = (text: string, accent: string) => (
    <span
      style={{
        display: "inline-block",
        padding: `${s(3)}px ${s(12)}px`,
        borderRadius: radius.full,
        background: `${accent}15`,
        border: `1.5px solid ${accent}30`,
        fontFamily: font.display,
        fontSize: s(14),
        fontWeight: fontWeight.semibold,
        color: accent,
      }}
    >
      {text}
    </span>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <AbsoluteFill
        style={{
          background: gradient.sceneBg,
          opacity: bgOpacity,
        }}
      >
        <div style={noiseOverlay} />

        {/* ── Phase 1: Title ── */}
        <div
          style={{
            position: "absolute",
            top: s(48),
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleSlide}px)`,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(40),
              fontWeight: fontWeight.bold,
              color: color.text,
              letterSpacing: "-0.02em",
            }}
          >
            瘦身 · Disk Cleaner
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(18),
              color: color.textSecondary,
              marginTop: s(8),
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleSlide}px)`,
            }}
          >
            基于 Mole 的智能磁盘清理
          </div>
        </div>

        {/* ── Phase 2: Problem — disk full ── */}
        {showPhase(40) && (
          <div
            style={{
              position: "absolute",
              top: s(150),
              left: s(80),
              right: s(80),
              opacity: problemOpacity,
              transform: `translateY(${problemSlide}px)`,
              display: "flex",
              alignItems: "center",
              gap: s(24),
            }}
          >
            {/* Mac disk icon */}
            <div style={iconBadge(color.red, s(72))}>
              <span style={{ fontSize: s(36) }}>💻</span>
            </div>

            {/* Storage info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(22),
                  fontWeight: fontWeight.bold,
                  color: color.red,
                  marginBottom: s(6),
                }}
              >
                磁盘快满了！
              </div>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(15),
                  color: color.textSecondary,
                  marginBottom: s(8),
                }}
              >
                238 / 250 GB
              </div>
              {/* Storage bar */}
              <div
                style={{
                  width: "100%",
                  height: s(10),
                  borderRadius: radius.full,
                  background: `${color.text}08`,
                  border: `1px solid ${color.border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${storagePercent}%`,
                    height: "100%",
                    borderRadius: radius.full,
                    background:
                      storagePercent > 90
                        ? color.red
                        : storagePercent > 70
                          ? color.orange
                          : color.green,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Phase 3: Install Flow ── */}
        {showPhase(90) && (
          <div
            style={{
              position: "absolute",
              top: s(270),
              left: s(80),
              right: s(80),
            }}
          >
            {/* Step header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(10),
                marginBottom: s(14),
                opacity: fadeIn(frame, 90, 10),
              }}
            >
              {stepBadge(1, color.blue, installBadgeScale)}
              {stepLabel("安装", color.blue)}
            </div>

            {/* Code block + Mole card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(20),
                opacity: installOpacity,
                transform: `translateY(${installSlide}px)`,
              }}
            >
              <div
                style={{
                  background: color.bgElevated,
                  border: `1px solid ${color.border}`,
                  borderRadius: radius.lg,
                  fontFamily: font.mono,
                  fontSize: s(16),
                  color: color.text,
                  padding: `${s(14)}px ${s(20)}px`,
                  flex: 1,
                }}
              >
                <span style={{ color: color.textTertiary }}>$</span>{" "}
                brew install tw93/tap/mole
              </div>

              {/* Arrow */}
              <div
                style={{
                  fontSize: s(20),
                  color: color.textTertiary,
                  flexShrink: 0,
                }}
              >
                →
              </div>

              {/* Mole card */}
              <div
                style={{
                  ...cardStyle(color.green),
                  borderRadius: radius.xl,
                  padding: `${s(12)}px ${s(20)}px`,
                  display: "flex",
                  alignItems: "center",
                  gap: s(10),
                  opacity: moleOpacity,
                  transform: `translateY(${moleSlide}px)`,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: s(28) }}>🐹</span>
                <div>
                  <div
                    style={{
                      fontFamily: font.mono,
                      fontSize: s(16),
                      fontWeight: fontWeight.bold,
                      color: color.text,
                    }}
                  >
                    Mole
                  </div>
                  {stepLabel("开源免费", color.green)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Phase 4: Scan Categories (2x3 grid) ── */}
        {showPhase(160) && (
          <div
            style={{
              position: "absolute",
              top: s(400),
              left: s(80),
              right: s(80),
            }}
          >
            {/* Step header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(10),
                marginBottom: s(14),
                opacity: fadeIn(frame, 160, 10),
              }}
            >
              {stepBadge(2, color.purple, scanBadgeScale)}
              {stepLabel("扫描", color.purple)}
            </div>

            {/* 2x3 grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: s(12),
              }}
            >
              {scanCategories.map((cat, i) => {
                const delay = 175 + i * 12;
                const cardScale = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 14, stiffness: 180 },
                });
                const cardOpacity = fadeIn(frame, delay, 12);

                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle(cat.accent),
                      borderRadius: radius.xl,
                      padding: `${s(12)}px ${s(14)}px`,
                      display: "flex",
                      alignItems: "center",
                      gap: s(10),
                      opacity: cardOpacity,
                      transform: `scale(${Math.min(cardScale, 1)})`,
                    }}
                  >
                    <div style={iconBadge(cat.accent, s(40))}>
                      <span style={{ fontSize: s(20) }}>{cat.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: font.display,
                          fontSize: s(14),
                          fontWeight: fontWeight.semibold,
                          color: color.text,
                        }}
                      >
                        {cat.name}
                      </div>
                      <div
                        style={{
                          fontFamily: font.mono,
                          fontSize: s(12),
                          color: cat.accent,
                          fontWeight: fontWeight.medium,
                        }}
                      >
                        {cat.size}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Phase 5: Three Tiers ── */}
        {showPhase(280) && (
          <div
            style={{
              position: "absolute",
              top: s(610),
              left: s(80),
              right: s(80),
            }}
          >
            {/* Step header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(10),
                marginBottom: s(14),
                opacity: fadeIn(frame, 280, 10),
              }}
            >
              {stepBadge(3, color.orange, tierBadgeScale)}
              {stepLabel("选档", color.orange)}
            </div>

            {/* Three tier cards */}
            <div
              style={{
                display: "flex",
                gap: s(14),
              }}
            >
              {tiers.map((tier, i) => {
                const delay = 295 + i * 18;
                const cardScale = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 14, stiffness: 180 },
                });
                const cardOpacity = fadeIn(frame, delay, 15);

                return (
                  <div
                    key={i}
                    style={{
                      ...cardStyle(tier.accent),
                      borderRadius: radius.xl,
                      flex: 1,
                      padding: `${s(16)}px`,
                      display: "flex",
                      flexDirection: "column",
                      gap: s(8),
                      opacity: cardOpacity,
                      transform: `scale(${Math.min(cardScale, 1)})`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: s(8),
                      }}
                    >
                      <span style={{ fontSize: s(22) }}>{tier.icon}</span>
                      <div
                        style={{
                          fontFamily: font.display,
                          fontSize: s(18),
                          fontWeight: fontWeight.bold,
                          color: color.text,
                        }}
                      >
                        {tier.name}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: font.display,
                        fontSize: s(13),
                        color: color.textSecondary,
                        lineHeight: 1.4,
                      }}
                    >
                      {tier.desc}
                    </div>
                    {stepLabel(tier.label, tier.accent)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Phase 6: Safety / Whitelist ── */}
        {showPhase(370) && (
          <div
            style={{
              position: "absolute",
              top: s(150),
              right: s(80),
              width: s(400),
            }}
          >
            {/* Step header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(10),
                marginBottom: s(14),
                opacity: fadeIn(frame, 370, 10),
              }}
            >
              {stepBadge(4, color.green, safetyBadgeScale)}
              {stepLabel("保护", color.green)}
            </div>

            {/* Shield card */}
            <div
              style={{
                ...cardStyle(color.green),
                borderRadius: radius.xl,
                boxShadow: shadow.elevated,
                padding: s(20),
                opacity: shieldOpacity,
                transform: `translateY(${shieldSlide}px)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: s(10),
                  marginBottom: s(12),
                }}
              >
                <div style={iconBadge(color.green, s(44))}>
                  <span style={{ fontSize: s(24) }}>🛡️</span>
                </div>
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: s(18),
                    fontWeight: fontWeight.bold,
                    color: color.text,
                  }}
                >
                  白名单机制
                </div>
              </div>

              {/* Preset pills */}
              <div
                style={{
                  display: "flex",
                  gap: s(8),
                  flexWrap: "wrap",
                  marginBottom: s(10),
                }}
              >
                {presets.map((preset, pi) => {
                  const pillOpacity = fadeIn(frame, 385 + pi * 10, 12);
                  return (
                    <span
                      key={pi}
                      style={{
                        display: "inline-block",
                        padding: `${s(4)}px ${s(12)}px`,
                        borderRadius: radius.full,
                        background: `${color.text}06`,
                        border: `1px solid ${color.border}`,
                        fontFamily: font.display,
                        fontSize: s(13),
                        fontWeight: fontWeight.medium,
                        color: color.text,
                        opacity: pillOpacity,
                      }}
                    >
                      {preset}
                    </span>
                  );
                })}
              </div>

              <div
                style={{
                  fontFamily: font.display,
                  fontSize: s(12),
                  color: color.textTertiary,
                }}
              >
                重要文件自动跳过
              </div>
            </div>
          </div>
        )}

        {/* ── Phase 7: Result ── */}
        {showPhase(430) && (
          <div
            style={{
              position: "absolute",
              bottom: s(50),
              left: s(80),
              right: s(80),
              opacity: resultOpacity,
              transform: `translateY(${resultSlide}px)`,
            }}
          >
            <div
              style={{
                ...cardStyle(color.green),
                borderRadius: radius.xl,
                boxShadow: shadow.elevated,
                padding: `${s(20)}px ${s(30)}px`,
                display: "flex",
                alignItems: "center",
                gap: s(30),
              }}
            >
              {/* Progress bar section */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: s(13),
                    color: color.textSecondary,
                    marginBottom: s(8),
                  }}
                >
                  清理进度
                </div>
                <div
                  style={{
                    width: "100%",
                    height: s(8),
                    borderRadius: radius.full,
                    background: `${color.text}08`,
                    border: `1px solid ${color.border}`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressFill}%`,
                      height: "100%",
                      borderRadius: radius.full,
                      background: color.green,
                    }}
                  />
                </div>
              </div>

              {/* GB counter */}
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div
                  style={{
                    fontFamily: font.display,
                    fontSize: s(30),
                    fontWeight: fontWeight.bold,
                    color: color.green,
                    lineHeight: 1,
                  }}
                >
                  释放 {Math.round(gbCount)} GB
                </div>
              </div>

              {/* Money badge */}
              {stepLabel(`≈ 省了 ¥${Math.round(moneyCount)}`, color.green)}

              {/* Celebration */}
              <div
                style={{
                  fontSize: s(22),
                  opacity: celebrationOpacity,
                  flexShrink: 0,
                }}
              >
                🎉 清理完成
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* ── Phase 8: Fade to black ── */}
      <AbsoluteFill
        style={{
          backgroundColor: color.black,
          opacity: fadeOutOpacity,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
