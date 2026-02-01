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
  textStyle,
  s,
  fontSize,
} from "./lib/theme";

// ── SkillDocMindmap — Anthropic Editorial ──
//
// doc-mindmap 四步流水线：文档输入 → 批量转换 → 本地摘要 → 三维分类
//
// Timeline (720 frames @ 30fps = 24s):
//   Phase 1:   0–50    Title
//   Phase 2:  50–170   Step 1 — 文档输入
//   Phase 3: 170–300   Step 2 — 批量转换 (markitdown)
//   Phase 4: 300–440   Step 3 — 本地摘要 (Ollama)
//   Phase 5: 440–580   Step 4 — 三维分类
//   Phase 6: 580–670   Feature highlights
//   Phase 7: 670–720   Fade out

// ── Data ──

const formats = [
  { label: "PDF", accent: color.red },
  { label: "PPT", accent: color.orange },
  { label: "Word", accent: color.blue },
  { label: "Excel", accent: color.green },
];

const extraFormats = ["CSV", "HTML", "EPUB", "JSON"];

const conversionLines = [
  "report.pdf     → report.pdf.md",
  "slides.pptx    → slides.pptx.md",
  "data.xlsx      → data.xlsx.md",
];

const summaryFields = [
  { label: "标题", value: "AI驱动产品管理实战指南", icon: "📋" },
  { label: "主题", value: "AI与产品管理" },
  { label: "用途", value: "培训材料" },
  { label: "客户", value: "通用" },
];

const classColumns = [
  {
    title: "按主题",
    accent: color.purple,
    items: ["AI 与智能化", "数据与数字化", "营销策略"],
  },
  {
    title: "按用途",
    accent: color.blue,
    items: ["培训材料", "客户交付方案", "内部规划"],
  },
  {
    title: "按客户",
    accent: color.gold,
    items: ["北极熊", "银河汽车", "通用方案"],
  },
];

const features = [
  { icon: "🔗", title: "软链接零占用", desc: "symlink 不复制文件" },
  { icon: "📋", title: "CSV 索引", desc: "完整文档清单含 MD5" },
  { icon: "🔍", title: "重复检测", desc: "自动发现重复文件" },
];

// ── Helpers ──

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SkillDocMindmap: React.FC = () => {
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
  const subtitleOpacity = interpolate(frame, [18, 38], [0, 1], clamp);

  // ── Phase 2: Step 1 — 文档输入 (50–170) ──
  const s1Opacity = interpolate(frame, [50, 70, 160, 180], [0, 1, 1, 0], clamp);
  const s1BadgeScale = spring({
    frame: frame - 52,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  // ── Phase 3: Step 2 — 批量转换 (170–300) ──
  const s2Opacity = interpolate(frame, [170, 190, 290, 310], [0, 1, 1, 0], clamp);
  const s2BadgeScale = spring({
    frame: frame - 172,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  // ── Phase 4: Step 3 — 本地摘要 (300–440) ──
  const s3Opacity = interpolate(frame, [300, 320, 430, 450], [0, 1, 1, 0], clamp);
  const s3BadgeScale = spring({
    frame: frame - 302,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  // ── Phase 5: Step 4 — 三维分类 (440–580) ──
  const s4Opacity = interpolate(frame, [440, 460, 570, 590], [0, 1, 1, 0], clamp);
  const s4BadgeScale = spring({
    frame: frame - 442,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  // ── Phase 6: Feature highlights (580–670) ──
  const featOpacity = interpolate(frame, [580, 600, 665, 685], [0, 1, 1, 0], clamp);

  // ── Phase 7: Fade out ──
  const fadeOut = interpolate(frame, [685, 720], [0, 1], clamp);

  // ── Step header helper ──
  const stepHeader = (
    num: string,
    accent: string,
    label: string,
    badgeScale: number,
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(14),
        marginBottom: s(20),
      }}
    >
      <div
        style={{
          ...iconBadge(accent, s(52)),
          transform: `scale(${Math.min(badgeScale, 1.05)})`,
          fontSize: s(22),
          fontWeight: fontWeight.bold,
          color: accent,
          fontFamily: font.mono,
        }}
      >
        {num}
      </div>
      <span
        style={{
          fontSize: fontSize.subtitle,
          fontWeight: fontWeight.bold,
          color: color.text,
          fontFamily: font.display,
        }}
      >
        {label}
      </span>
    </div>
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
            提炼 · Doc Mindmap
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: s(148),
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: subtitleOpacity,
          }}
        >
          <span
            style={{
              fontSize: fontSize.body,
              color: color.textSecondary,
              fontFamily: font.body,
            }}
          >
            文档智能整理助手 — 四步流水线
          </span>
        </div>

        {/* ── Phase 2: Step 1 — 文档输入 ── */}
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
            opacity: s1Opacity,
          }}
        >
          <div
            style={{
              ...cardStyle(),
              padding: `${s(36)}px ${s(44)}px`,
              boxShadow: shadow.elevated,
              borderRadius: radius.xl,
              maxWidth: s(560),
              width: "100%",
            }}
          >
            {stepHeader("1", color.purple, "文档输入", s1BadgeScale)}

            {/* Format pills */}
            <div
              style={{
                display: "flex",
                gap: s(12),
                flexWrap: "wrap",
                marginBottom: s(16),
              }}
            >
              {formats.map((f, i) => {
                const fOp = interpolate(frame, [62 + i * 10, 74 + i * 10], [0, 1], clamp);
                return (
                  <div
                    key={i}
                    style={{
                      opacity: fOp,
                      padding: `${s(6)}px ${s(18)}px`,
                      borderRadius: radius.full,
                      background: `${f.accent}15`,
                      border: `1.5px solid ${f.accent}30`,
                      fontSize: fontSize.caption,
                      fontWeight: fontWeight.semibold,
                      color: f.accent,
                      fontFamily: font.mono,
                    }}
                  >
                    {f.label}
                  </div>
                );
              })}
            </div>

            {/* Extra formats */}
            <div
              style={{
                display: "flex",
                gap: s(8),
                flexWrap: "wrap",
                marginBottom: s(20),
                opacity: interpolate(frame, [100, 115], [0, 1], clamp),
              }}
            >
              {extraFormats.map((f, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: s(13),
                    color: color.textTertiary,
                    fontFamily: font.mono,
                    padding: `${s(3)}px ${s(10)}px`,
                    background: color.bgCard,
                    borderRadius: radius.sm,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Folder summary */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(12),
                opacity: interpolate(frame, [115, 130], [0, 1], clamp),
                background: color.bgElevated,
                borderRadius: radius.md,
                padding: `${s(12)}px ${s(18)}px`,
              }}
            >
              <span style={{ fontSize: s(24) }}>📁</span>
              <div>
                <div
                  style={{
                    fontSize: fontSize.body,
                    fontWeight: fontWeight.semibold,
                    color: color.text,
                    fontFamily: font.display,
                  }}
                >
                  30 份文档
                </div>
                <div
                  style={{
                    fontSize: s(14),
                    color: color.textSecondary,
                    fontFamily: font.body,
                  }}
                >
                  PDF 12 / PPT 8 / Word 6 / Excel 4
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Phase 3: Step 2 — 批量转换 ── */}
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
            opacity: s2Opacity,
          }}
        >
          <div
            style={{
              ...cardStyle(),
              padding: `${s(36)}px ${s(44)}px`,
              boxShadow: shadow.elevated,
              borderRadius: radius.xl,
              maxWidth: s(580),
              width: "100%",
            }}
          >
            {stepHeader("2", color.blue, "批量转换", s2BadgeScale)}

            {/* Conversion flow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(14),
                marginBottom: s(20),
                opacity: interpolate(frame, [190, 208], [0, 1], clamp),
              }}
            >
              <span style={{ fontSize: s(28) }}>📄</span>
              <div
                style={{
                  width: s(40),
                  height: 2,
                  background: gradient.accentLine(color.blue),
                }}
              />
              <span
                style={{
                  padding: `${s(5)}px ${s(14)}px`,
                  borderRadius: radius.full,
                  background: `${color.blue}12`,
                  border: `1.5px solid ${color.blue}25`,
                  fontSize: s(14),
                  fontWeight: fontWeight.semibold,
                  color: color.blue,
                  fontFamily: font.mono,
                }}
              >
                markitdown
              </span>
              <span style={{ fontSize: s(20), color: color.terracotta }}>→</span>
              <span
                style={{
                  padding: `${s(5)}px ${s(14)}px`,
                  borderRadius: radius.full,
                  background: `${color.blue}12`,
                  border: `1.5px solid ${color.blue}25`,
                  fontSize: s(14),
                  fontWeight: fontWeight.bold,
                  color: color.blue,
                  fontFamily: font.mono,
                }}
              >
                .md
              </span>
            </div>

            {/* Code block */}
            <div
              style={{
                background: color.bgElevated,
                borderRadius: radius.md,
                border: `1px solid ${color.border}`,
                padding: `${s(14)}px ${s(20)}px`,
                fontFamily: font.mono,
                fontSize: s(14),
                color: color.textSecondary,
                lineHeight: 1.9,
                marginBottom: s(16),
              }}
            >
              {conversionLines.map((line, i) => {
                const lOp = interpolate(frame, [210 + i * 15, 225 + i * 15], [0, 1], clamp);
                return (
                  <div key={i} style={{ opacity: lOp }}>
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Microsoft badge */}
            <div style={{ opacity: interpolate(frame, [265, 280], [0, 1], clamp) }}>
              <span
                style={{
                  padding: `${s(5)}px ${s(16)}px`,
                  borderRadius: radius.full,
                  background: `${color.green}12`,
                  border: `1.5px solid ${color.green}25`,
                  fontSize: fontSize.caption,
                  fontWeight: fontWeight.semibold,
                  color: color.green,
                  fontFamily: font.display,
                }}
              >
                ✓ Microsoft 开源
              </span>
            </div>
          </div>
        </div>

        {/* ── Phase 4: Step 3 — 本地摘要 ── */}
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
            opacity: s3Opacity,
          }}
        >
          <div
            style={{
              ...cardStyle(),
              padding: `${s(36)}px ${s(44)}px`,
              boxShadow: shadow.elevated,
              borderRadius: radius.xl,
              maxWidth: s(580),
              width: "100%",
            }}
          >
            {stepHeader("3", color.gold, "本地摘要", s3BadgeScale)}

            {/* Ollama */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(10),
                marginBottom: s(16),
                opacity: interpolate(frame, [318, 335], [0, 1], clamp),
              }}
            >
              <span style={{ fontSize: s(28) }}>🦙</span>
              <span
                style={{
                  fontSize: fontSize.subtitle,
                  fontWeight: fontWeight.bold,
                  color: color.text,
                  fontFamily: font.display,
                }}
              >
                Ollama
              </span>
            </div>

            {/* Highlight pills */}
            <div
              style={{
                display: "flex",
                gap: s(10),
                marginBottom: s(20),
                opacity: interpolate(frame, [335, 352], [0, 1], clamp),
              }}
            >
              {[
                { label: "🔒 本地运行", accent: color.green },
                { label: "零 API 费用", accent: color.gold },
                { label: "数据不出机器", accent: color.purple },
              ].map((p, i) => (
                <span
                  key={i}
                  style={{
                    padding: `${s(5)}px ${s(14)}px`,
                    borderRadius: radius.full,
                    background: `${p.accent}12`,
                    border: `1.5px solid ${p.accent}25`,
                    fontSize: s(14),
                    fontWeight: fontWeight.semibold,
                    color: p.accent,
                    fontFamily: font.display,
                  }}
                >
                  {p.label}
                </span>
              ))}
            </div>

            {/* Summary card */}
            <div
              style={{
                background: color.bgElevated,
                borderRadius: radius.md,
                border: `1px solid ${color.border}`,
                padding: `${s(14)}px ${s(20)}px`,
                display: "flex",
                flexDirection: "column",
                gap: s(8),
                marginBottom: s(16),
              }}
            >
              {summaryFields.map((f, i) => {
                const fOp = interpolate(frame, [355 + i * 14, 370 + i * 14], [0, 1], clamp);
                return (
                  <div
                    key={i}
                    style={{
                      opacity: fOp,
                      fontSize: i === 0 ? fontSize.body : s(16),
                      fontWeight: i === 0 ? fontWeight.semibold : fontWeight.regular,
                      color: i === 0 ? color.text : color.textSecondary,
                      fontFamily: i === 0 ? font.display : font.body,
                    }}
                  >
                    {f.icon ? `${f.icon} ` : ""}{f.label}: {f.value}
                  </div>
                );
              })}
            </div>

            {/* Model pill */}
            <div style={{ opacity: interpolate(frame, [410, 425], [0, 1], clamp) }}>
              <span
                style={{
                  padding: `${s(4)}px ${s(14)}px`,
                  borderRadius: radius.full,
                  background: color.bgCard,
                  border: `1px solid ${color.border}`,
                  fontSize: s(13),
                  color: color.textTertiary,
                  fontFamily: font.mono,
                }}
              >
                model: qwen2.5:3b
              </span>
            </div>
          </div>
        </div>

        {/* ── Phase 5: Step 4 — 三维分类 ── */}
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
            opacity: s4Opacity,
          }}
        >
          <div
            style={{
              ...cardStyle(),
              padding: `${s(36)}px ${s(44)}px`,
              boxShadow: shadow.elevated,
              borderRadius: radius.xl,
              maxWidth: s(640),
              width: "100%",
            }}
          >
            {stepHeader("4", color.green, "三维分类", s4BadgeScale)}

            {/* Three columns */}
            <div
              style={{
                display: "flex",
                gap: s(20),
                marginBottom: s(20),
              }}
            >
              {classColumns.map((col, ci) => {
                const colOp = interpolate(
                  frame,
                  [462 + ci * 18, 480 + ci * 18],
                  [0, 1],
                  clamp,
                );
                const colY = interpolate(
                  frame,
                  [462 + ci * 18, 480 + ci * 18],
                  [15, 0],
                  { ...clamp, easing: Easing.out(Easing.cubic) },
                );
                return (
                  <div
                    key={ci}
                    style={{
                      flex: 1,
                      opacity: colOp,
                      transform: `translateY(${colY}px)`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: fontSize.caption,
                        fontWeight: fontWeight.bold,
                        color: col.accent,
                        fontFamily: font.display,
                        paddingBottom: s(6),
                        borderBottom: `2px solid ${col.accent}`,
                        marginBottom: s(10),
                        letterSpacing: "0.04em",
                      }}
                    >
                      {col.title}
                    </div>
                    {col.items.map((item, ii) => (
                      <div
                        key={ii}
                        style={{
                          fontSize: s(15),
                          color: color.text,
                          fontFamily: font.body,
                          padding: `${s(6)}px ${s(10)}px`,
                          background: color.bgCard,
                          borderRadius: radius.sm,
                          marginBottom: s(6),
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Symlink highlight */}
            <div
              style={{
                opacity: interpolate(frame, [530, 548], [0, 1], clamp),
                background: `${color.green}10`,
                border: `1px solid ${color.green}25`,
                borderRadius: radius.md,
                padding: `${s(10)}px ${s(18)}px`,
                fontSize: fontSize.caption,
                fontWeight: fontWeight.semibold,
                color: color.green,
                fontFamily: font.display,
                textAlign: "center",
              }}
            >
              🔗 软链接 — 三套分类同时存在，零额外磁盘占用
            </div>
          </div>
        </div>

        {/* ── Phase 6: Feature highlights ── */}
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
            gap: s(24),
            opacity: featOpacity,
          }}
        >
          {features.map((feat, i) => {
            const fDelay = 588 + i * 18;
            const fOp = interpolate(frame, [fDelay, fDelay + 18], [0, 1], clamp);
            const fY = interpolate(frame, [fDelay, fDelay + 18], [15, 0], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={i}
                style={{
                  ...cardStyle(),
                  padding: `${s(24)}px ${s(28)}px`,
                  borderRadius: radius.xl,
                  boxShadow: shadow.card,
                  width: s(240),
                  opacity: fOp,
                  transform: `translateY(${fY}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: s(12),
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: s(32) }}>{feat.icon}</span>
                <div
                  style={{
                    fontSize: fontSize.body,
                    fontWeight: fontWeight.semibold,
                    color: color.text,
                    fontFamily: font.display,
                  }}
                >
                  {feat.title}
                </div>
                <div
                  style={{
                    fontSize: fontSize.caption,
                    color: color.textSecondary,
                    fontFamily: font.body,
                  }}
                >
                  {feat.desc}
                </div>
              </div>
            );
          })}
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
