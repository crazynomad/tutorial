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
  iconBadge,
  noiseOverlay,
  s,
  fontSize,
} from "./lib/theme";

// ── Scene: 收纳 · macOS 智能文件夹 ──
//
// Anthropic Editorial 风格
// 核心叙事：macOS 没人会用的宝藏功能「智能文件夹」
// 书架 vs 书单类比 → 痛点 → 智能文件夹演示 → 核心差异 → file-organizer 收尾
//
// Timeline (600 frames @ 30fps = 20s):
//   Phase 1: Title + 宝藏功能 (0–50)
//   Phase 2: 书架 vs 书单 类比 (50–160)
//   Phase 3: 传统文件夹痛点 (160–250)
//   Phase 4: 智能文件夹展示 (250–370)
//   Phase 5: 核心差异三行对比 (385–480)
//   Phase 6: file-organizer 一键创建 (480–555)
//   Phase 7: Fade out (555–600)

// ── Data ──

const smartFolders = [
  { emoji: "📊", name: "演示文稿", accent: color.orange },
  { emoji: "📝", name: "文档", accent: color.blue },
  { emoji: "📈", name: "表格", accent: color.green },
  { emoji: "📄", name: "PDF", accent: color.red },
  { emoji: "🖼️", name: "图片", accent: color.purple },
  { emoji: "🎬", name: "视频", accent: color.blue },
  { emoji: "🎵", name: "音频", accent: color.gold },
  { emoji: "📦", name: "压缩包", accent: color.orange },
  { emoji: "💾", name: "大文件 (>100MB)", accent: color.red },
];

const diffs = [
  {
    dim: "文件位置",
    old: "搬进文件夹",
    neu: "原地不动",
    icon: "📍",
  },
  {
    dim: "删除行为",
    old: "文件一起删",
    neu: "只删搜索条件",
    icon: "🗑️",
  },
  {
    dim: "多处出现",
    old: "只能存一处",
    neu: "同时出现在多个书单",
    icon: "📎",
  },
];

const messyFiles = [
  { name: "报告.pdf", emoji: "📄" },
  { name: "方案.pptx", emoji: "📊" },
  { name: "截图 2024-01-15.png", emoji: "🖼️" },
  { name: "会议录音.mp3", emoji: "🎵" },
  { name: "数据.xlsx", emoji: "📈" },
  { name: "视频素材.mp4", emoji: "🎬" },
];

// ── Helpers ──

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SkillFileOrganizer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], clamp);

  // ── Phase 1: Title (0–50) ──
  const titleOpacity = interpolate(frame, [5, 28], [0, 1], clamp);
  const titleY = interpolate(frame, [5, 28], [20, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const badgeOpacity = interpolate(frame, [20, 40], [0, 1], clamp);
  const badgeScale = spring({
    frame: frame - 22,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  // ── Phase 2: 书架 vs 书单 (50–160) ──
  const analogyOpacity = interpolate(
    frame,
    [50, 70, 148, 168],
    [0, 1, 1, 0],
    clamp,
  );
  const shelfScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.8 },
  });
  const listScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.8 },
  });
  const vsOpacity = interpolate(frame, [72, 88], [0, 1], clamp);

  // ── Phase 3: 痛点 (160–250) ──
  const painOpacity = interpolate(
    frame,
    [160, 180, 240, 258],
    [0, 1, 1, 0],
    clamp,
  );
  const painScale = spring({
    frame: frame - 165,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  // ── Phase 4: 智能文件夹 (250–370) ──
  const smartOpacity = interpolate(
    frame,
    [250, 268, 360, 385],
    [0, 1, 1, 0],
    clamp,
  );
  const insightOpacity = interpolate(frame, [310, 335], [0, 1], clamp);
  const insightY = interpolate(frame, [310, 335], [18, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 5: 核心差异 (385–480) ──
  const diffOpacity = interpolate(
    frame,
    [385, 405, 470, 490],
    [0, 1, 1, 0],
    clamp,
  );

  // ── Phase 6: CTA (480–555) ──
  const ctaOpacity = interpolate(
    frame,
    [480, 505, 548, 565],
    [0, 1, 1, 0],
    clamp,
  );
  const ctaScale = spring({
    frame: frame - 488,
    fps,
    config: { damping: 10, stiffness: 90, mass: 0.9 },
  });

  // ── Phase 7: Fade out ──
  const fadeOut = interpolate(frame, [565, 600], [0, 1], clamp);

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
            right: 0,
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              fontSize: fontSize.display,
              fontWeight: fontWeight.bold,
              color: color.text,
              fontFamily: font.display,
              letterSpacing: "-0.03em",
            }}
          >
            收纳 · 智能文件夹
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: s(148),
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: badgeOpacity,
            transform: `scale(${Math.min(badgeScale, 1.02)})`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: `${s(6)}px ${s(24)}px`,
              borderRadius: radius.full,
              background: `${color.terracotta}15`,
              border: `1.5px solid ${color.terracotta}30`,
              fontSize: fontSize.caption,
              fontWeight: fontWeight.semibold,
              color: color.terracotta,
              fontFamily: font.display,
              letterSpacing: "0.06em",
            }}
          >
            macOS 没人会用的宝藏功能
          </span>
        </div>

        {/* ── Phase 2: 书架 vs 书单 ── */}
        <div
          style={{
            position: "absolute",
            top: s(60),
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: s(80),
            opacity: analogyOpacity,
          }}
        >
          {/* 书架 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: s(16),
              transform: `scale(${Math.min(shelfScale, 1.02)})`,
            }}
          >
            <div
              style={{
                ...iconBadge(color.warmGray, s(100)),
                fontSize: s(52),
              }}
            >
              📚
            </div>
            <div
              style={{
                fontSize: fontSize.title,
                fontWeight: fontWeight.semibold,
                color: color.textSecondary,
                fontFamily: font.display,
              }}
            >
              传统文件夹
            </div>
            <div
              style={{
                fontSize: fontSize.body,
                color: color.textSecondary,
                fontFamily: font.body,
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              像<span style={{ color: color.text, fontWeight: fontWeight.semibold }}>书架</span>
              <br />
              把书搬进去
            </div>
          </div>

          {/* vs */}
          <div
            style={{
              fontSize: s(28),
              fontFamily: font.display,
              fontWeight: fontWeight.medium,
              color: color.textTertiary,
              opacity: vsOpacity,
              letterSpacing: "0.08em",
            }}
          >
            vs
          </div>

          {/* 书单 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: s(16),
              transform: `scale(${Math.min(listScale, 1.02)})`,
            }}
          >
            <div
              style={{
                ...iconBadge(color.terracotta, s(100)),
                fontSize: s(52),
              }}
            >
              🔍
            </div>
            <div
              style={{
                fontSize: fontSize.title,
                fontWeight: fontWeight.bold,
                color: color.terracotta,
                fontFamily: font.display,
              }}
            >
              智能文件夹
            </div>
            <div
              style={{
                fontSize: fontSize.body,
                color: color.textSecondary,
                fontFamily: font.body,
                textAlign: "center",
                lineHeight: 1.7,
              }}
            >
              像<span style={{ color: color.terracotta, fontWeight: fontWeight.semibold }}>书单</span>
              <br />
              记住搜索条件，自动列出
            </div>
          </div>
        </div>

        {/* ── Phase 3: 痛点 ── */}
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
            opacity: painOpacity,
          }}
        >
          <div
            style={{
              ...cardStyle(),
              transform: `scale(${Math.min(painScale, 1.02)})`,
              padding: `${s(36)}px ${s(44)}px`,
              maxWidth: s(560),
              boxShadow: shadow.elevated,
              borderRadius: radius.xl,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(12),
                marginBottom: s(20),
              }}
            >
              <span style={{ fontSize: s(28) }}>😫</span>
              <span
                style={{
                  fontSize: fontSize.subtitle,
                  fontWeight: fontWeight.bold,
                  color: color.text,
                  fontFamily: font.display,
                }}
              >
                传统整理的痛
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: s(8),
                marginBottom: s(20),
              }}
            >
              {messyFiles.map((f, i) => {
                const fOp = interpolate(
                  frame,
                  [170 + i * 7, 182 + i * 7],
                  [0, 1],
                  clamp,
                );
                const fX = interpolate(
                  frame,
                  [170 + i * 7, 182 + i * 7],
                  [-15, 0],
                  { ...clamp, easing: Easing.out(Easing.cubic) },
                );
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: s(10),
                      opacity: fOp,
                      transform: `translateX(${fX}px)`,
                      fontSize: fontSize.body,
                      color: color.textSecondary,
                      fontFamily: font.body,
                    }}
                  >
                    <span style={{ fontSize: s(20) }}>{f.emoji}</span>
                    <span>{f.name}</span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                fontSize: fontSize.caption,
                color: color.red,
                fontFamily: font.body,
                fontWeight: fontWeight.medium,
                opacity: interpolate(frame, [220, 235], [0, 1], clamp),
                borderTop: `1px solid ${color.border}`,
                paddingTop: s(14),
              }}
            >
              手动分类？一个个拖？文件搬走找不到了？
            </div>
          </div>
        </div>

        {/* ── Phase 4: 智能文件夹展示 ── */}
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
            gap: s(50),
            opacity: smartOpacity,
          }}
        >
          {/* 文件夹树 */}
          <div
            style={{
              ...cardStyle(),
              padding: `${s(24)}px ${s(30)}px`,
              boxShadow: shadow.elevated,
              borderRadius: radius.xl,
              minWidth: s(340),
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(10),
                marginBottom: s(16),
                paddingBottom: s(12),
                borderBottom: `1px solid ${color.border}`,
              }}
            >
              <span style={{ fontSize: s(20) }}>📁</span>
              <span
                style={{
                  fontSize: fontSize.body,
                  fontWeight: fontWeight.semibold,
                  color: color.text,
                  fontFamily: font.mono,
                }}
              >
                ~/Desktop/待整理/
              </span>
            </div>

            {smartFolders.map((sf, i) => {
              const sfDelay = 268 + i * 10;
              const sfScale = spring({
                frame: frame - sfDelay,
                fps,
                config: { damping: 12, stiffness: 140, mass: 0.7 },
              });
              const sfOp = interpolate(
                frame,
                [sfDelay, sfDelay + 12],
                [0, 1],
                clamp,
              );

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: s(10),
                    padding: `${s(5)}px ${s(8)}px`,
                    opacity: sfOp,
                    transform: `scale(${Math.min(sfScale, 1)})`,
                    transformOrigin: "left center",
                  }}
                >
                  <span style={{ fontSize: s(18) }}>{sf.emoji}</span>
                  <span
                    style={{
                      fontSize: s(16),
                      fontWeight: fontWeight.medium,
                      color: color.text,
                      fontFamily: font.display,
                    }}
                  >
                    {sf.name}
                  </span>
                  <span
                    style={{
                      fontSize: s(12),
                      color: color.textTertiary,
                      fontFamily: font.mono,
                    }}
                  >
                    .savedSearch
                  </span>
                </div>
              );
            })}
          </div>

          {/* 关键特性 */}
          <div
            style={{
              maxWidth: s(320),
              opacity: insightOpacity,
              transform: `translateY(${insightY}px)`,
            }}
          >
            <div
              style={{
                ...cardStyle(color.terracotta),
                padding: `${s(24)}px ${s(28)}px`,
                boxShadow: `${shadow.card}, ${shadow.glow(color.terracotta, 0.06)}`,
                borderRadius: radius.xl,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: s(10),
                  marginBottom: s(16),
                }}
              >
                <span style={{ fontSize: s(22) }}>💡</span>
                <span
                  style={{
                    fontSize: fontSize.body,
                    fontWeight: fontWeight.bold,
                    color: color.terracotta,
                    fontFamily: font.display,
                  }}
                >
                  关键特性
                </span>
              </div>
              <div
                style={{
                  fontSize: s(16),
                  color: color.text,
                  fontFamily: font.body,
                  lineHeight: 1.8,
                }}
              >
                <div style={{ marginBottom: s(8) }}>
                  <span style={{ color: color.green }}>✓</span> 文件
                  <span style={{ fontWeight: fontWeight.semibold }}>不会被移动</span>
                  ，原地不动
                </div>
                <div style={{ marginBottom: s(8) }}>
                  <span style={{ color: color.green }}>✓</span> 一份 PPT 可同时出现在
                  <br />
                  　「演示文稿」和「大文件」
                </div>
                <div>
                  <span style={{ color: color.green }}>✓</span> 删掉智能文件夹，原文件不受影响
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Phase 5: 核心差异 ── */}
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
            gap: s(18),
            opacity: diffOpacity,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              gap: s(16),
              alignItems: "center",
              marginBottom: s(10),
              opacity: interpolate(frame, [390, 405], [0, 1], clamp),
            }}
          >
            <div style={{ width: s(50) }} />
            <div
              style={{
                width: s(280),
                fontSize: fontSize.caption,
                fontWeight: fontWeight.bold,
                color: color.textSecondary,
                fontFamily: font.display,
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              📚 传统文件夹
            </div>
            <div style={{ width: s(36) }} />
            <div
              style={{
                width: s(300),
                fontSize: fontSize.caption,
                fontWeight: fontWeight.bold,
                color: color.terracotta,
                fontFamily: font.display,
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              🔍 智能文件夹
            </div>
          </div>

          {diffs.map((d, i) => {
            const rowDelay = 400 + i * 22;
            const rowOp = interpolate(
              frame,
              [rowDelay, rowDelay + 18],
              [0, 1],
              clamp,
            );
            const rowY = interpolate(
              frame,
              [rowDelay, rowDelay + 18],
              [15, 0],
              { ...clamp, easing: Easing.out(Easing.cubic) },
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: s(16),
                  alignItems: "center",
                  opacity: rowOp,
                  transform: `translateY(${rowY}px)`,
                }}
              >
                <div style={{ width: s(50), textAlign: "center", fontSize: s(24) }}>
                  {d.icon}
                </div>
                {/* Old */}
                <div
                  style={{
                    ...cardStyle(),
                    width: s(280),
                    padding: `${s(14)}px ${s(18)}px`,
                    textAlign: "center",
                    borderRadius: radius.lg,
                  }}
                >
                  <div
                    style={{
                      fontSize: s(12),
                      color: color.textTertiary,
                      fontFamily: font.display,
                      fontWeight: fontWeight.medium,
                      marginBottom: s(4),
                    }}
                  >
                    {d.dim}
                  </div>
                  <div
                    style={{
                      fontSize: fontSize.caption,
                      color: color.textSecondary,
                      fontFamily: font.body,
                      fontWeight: fontWeight.medium,
                    }}
                  >
                    {d.old}
                  </div>
                </div>
                {/* Arrow */}
                <div
                  style={{
                    width: s(36),
                    textAlign: "center",
                    fontSize: s(20),
                    color: color.terracotta,
                    fontFamily: font.display,
                  }}
                >
                  →
                </div>
                {/* New */}
                <div
                  style={{
                    ...cardStyle(color.terracotta),
                    width: s(300),
                    padding: `${s(14)}px ${s(18)}px`,
                    textAlign: "center",
                    borderRadius: radius.lg,
                  }}
                >
                  <div
                    style={{
                      fontSize: s(12),
                      color: color.textTertiary,
                      fontFamily: font.display,
                      fontWeight: fontWeight.medium,
                      marginBottom: s(4),
                    }}
                  >
                    {d.dim}
                  </div>
                  <div
                    style={{
                      fontSize: fontSize.caption,
                      color: color.terracotta,
                      fontFamily: font.body,
                      fontWeight: fontWeight.semibold,
                    }}
                  >
                    {d.neu}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Phase 6: CTA ── */}
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
            gap: s(24),
            opacity: ctaOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${Math.min(ctaScale, 1.03)})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: s(22),
            }}
          >
            <div
              style={{
                ...iconBadge(color.terracotta, s(90)),
                fontSize: s(48),
                boxShadow: shadow.glow(color.terracotta, 0.1),
              }}
            >
              📂
            </div>
            <div
              style={{
                fontSize: fontSize.title,
                fontWeight: fontWeight.bold,
                color: color.text,
                fontFamily: font.display,
                letterSpacing: "-0.02em",
              }}
            >
              file-organizer 一键创建
            </div>
            <div
              style={{
                fontSize: fontSize.body,
                color: color.textSecondary,
                fontFamily: font.body,
                textAlign: "center",
                maxWidth: s(480),
                lineHeight: 1.7,
              }}
            >
              自动在桌面生成 9 个智能文件夹
              <br />
              代码目录自动跳过，与 disk-cleaner 白名单联动
            </div>
            {/* Command */}
            <div
              style={{
                background: color.bgElevated,
                border: `1px solid ${color.border}`,
                borderRadius: radius.md,
                padding: `${s(10)}px ${s(28)}px`,
                fontFamily: font.mono,
                fontSize: s(16),
                color: color.green,
                fontWeight: fontWeight.medium,
                opacity: interpolate(frame, [515, 535], [0, 1], clamp),
              }}
            >
              file-organizer --manual
            </div>
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
