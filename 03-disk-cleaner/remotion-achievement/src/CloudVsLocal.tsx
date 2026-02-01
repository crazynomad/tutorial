import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
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
  noiseOverlay,
  s,
} from "./lib/theme";

// ── Scene 06: Claude.ai vs Claude Code (11:32–12:34) ──
// 三组左右分屏对比 + 金句落版
// 2700 frames @ 30fps = 90s
//
// Timeline:
//   Section 1: 失忆症对比 (0–750, 0:00–0:25)
//     0–30     背景 + 标题 "失忆症" 渐入
//    30–60     分屏线 + 标签
//    60–180    左侧: 多个断裂对话气泡 (每次新对话都忘了你是谁)
//   180–300    右侧: 文件树 + AI 直接读取，无需上传复制粘贴
//   250–350    ❌ / ✅ 标记弹入
//   350–500    左: "每次新对话，从头来过" / 右: "文件就是你的上下文"
//   500–700    Hold
//   700–750    淡出
//
//   Section 2: 动嘴 vs 动手 (750–1500, 0:25–0:50)
//   (unchanged)
//
//   Section 3: AI 操作系统 + Skill 升级补丁 (1500–2100, 0:50–1:10)
//  1500–1530   标题 "可进化的 AI 系统" 渐入
//  1530–1560   分屏复位
//  1560–1700   左侧: 基础 Claude Code = OS 层
//  1700–1900   右侧: Skill 补丁逐个叠加，能力递增
//  1800–1900   ❌ / ✅ + "装的越多，系统越强"
//  1900–2050   Hold
//  2050–2100   淡出
//
//   Section 4: 金句落版 (2100–2700, 1:10–1:30)
//  (unchanged)

// ── Helper: Section fade ──
function sectionOpacity(frame: number, start: number, end: number) {
  const fadeIn = interpolate(frame, [start, start + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - 50, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
}

// ══════════════════════════════════════════
// Split-screen comparison layout
// ══════════════════════════════════════════

const SplitScreen: React.FC<{
  frame: number;
  sectionStart: number;
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftCaption: string;
  rightCaption: string;
  leftBad?: boolean;
}> = ({
  frame,
  sectionStart,
  title,
  leftLabel,
  rightLabel,
  leftContent,
  rightContent,
  leftCaption,
  rightCaption,
  leftBad = true,
}) => {
  const f = frame - sectionStart;

  const titleOpacity = interpolate(f, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(f, [0, 25], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Split line
  const lineHeight = interpolate(f, [25, 55], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Labels
  const labelOpacity = interpolate(f, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Captions
  const captionOpacity = interpolate(f, [280, 310], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionY = interpolate(f, [280, 310], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Verdict marks
  const markOpacity = interpolate(f, [250, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Section title */}
      <div
        style={{
          marginTop: s(50),
          fontSize: s(28),
          fontWeight: fontWeight.semibold,
          color: color.textSecondary,
          fontFamily: font.display,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </div>

      {/* Split area */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          position: "relative",
          marginTop: s(20),
        }}
      >
        {/* Left half */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${s(60)}px`,
            position: "relative",
          }}
        >
          {/* Label */}
          <div
            style={{
              position: "absolute",
              top: s(20),
              fontSize: s(22),
              fontWeight: fontWeight.semibold,
              color: color.red,
              fontFamily: font.display,
              opacity: labelOpacity,
            }}
          >
            {leftLabel}
          </div>
          {/* Content */}
          {leftContent}
          {/* Verdict */}
          <div
            style={{
              position: "absolute",
              bottom: s(100),
              fontSize: s(48),
              opacity: markOpacity,
            }}
          >
            {leftBad ? "❌" : "✅"}
          </div>
          {/* Caption */}
          <div
            style={{
              position: "absolute",
              bottom: s(50),
              fontSize: s(20),
              color: leftBad ? color.red : color.green,
              fontFamily: font.display,
              fontWeight: fontWeight.medium,
              opacity: captionOpacity,
              transform: `translateY(${captionY}px)`,
            }}
          >
            {leftCaption}
          </div>
        </div>

        {/* Center divider */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "5%",
            width: s(2),
            height: `${lineHeight}%`,
            background: gradient.vertDivider,
            transform: "translateX(-50%)",
          }}
        />

        {/* Right half */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${s(60)}px`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: s(20),
              fontSize: s(22),
              fontWeight: fontWeight.semibold,
              color: color.green,
              fontFamily: font.display,
              opacity: labelOpacity,
            }}
          >
            {rightLabel}
          </div>
          {rightContent}
          <div
            style={{
              position: "absolute",
              bottom: s(100),
              fontSize: s(48),
              opacity: markOpacity,
            }}
          >
            ✅
          </div>
          <div
            style={{
              position: "absolute",
              bottom: s(50),
              fontSize: s(20),
              color: color.green,
              fontFamily: font.display,
              fontWeight: fontWeight.medium,
              opacity: captionOpacity,
              transform: `translateY(${captionY}px)`,
            }}
          >
            {rightCaption}
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════
// Section content components
// ══════════════════════════════════════════

// ── Section 1: 失忆症 (Amnesia) ──
const AmnesiaLeft: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // Multiple disconnected chat bubbles — each new conversation forgets everything
  const chats = [
    { msg: "帮我清理一下磁盘", reply: "好的，请告诉我你的系统信息..." },
    { msg: "我上次不是说过了吗？", reply: "抱歉，我没有之前的对话记录" },
    { msg: "我的文件在 ~/Documents", reply: "我无法访问你的文件系统" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: s(12),
      }}
    >
      {/* Brain with question mark */}
      <div
        style={{
          fontSize: s(44),
          marginBottom: s(4),
          opacity: interpolate(f, [30, 50], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        🧠❓
      </div>

      {/* Chat bubbles */}
      {chats.map((chat, i) => {
        const delay = 60 + i * 40;
        const chatOpacity = interpolate(f, [delay, delay + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const chatY = interpolate(f, [delay, delay + 20], [15, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        // Previous chats fade/gray out
        const staleness = i < chats.length - 1
          ? interpolate(f, [delay + 40, delay + 60], [1, 0.35], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;

        return (
          <div
            key={i}
            style={{
              width: s(310),
              opacity: chatOpacity * staleness,
              transform: `translateY(${chatY}px)`,
              display: "flex",
              flexDirection: "column",
              gap: s(4),
            }}
          >
            {/* User message */}
            <div
              style={{
                alignSelf: "flex-end",
                padding: `${s(6)}px ${s(12)}px`,
                borderRadius: `${s(10)}px ${s(10)}px ${s(3)}px ${s(10)}px`,
                background: `${color.blue}15`,
                border: `1px solid ${color.blue}25`,
                fontSize: s(12),
                color: color.text,
                fontFamily: font.display,
              }}
            >
              {chat.msg}
            </div>
            {/* AI reply */}
            <div
              style={{
                alignSelf: "flex-start",
                padding: `${s(6)}px ${s(12)}px`,
                borderRadius: `${s(10)}px ${s(10)}px ${s(10)}px ${s(3)}px`,
                background: `${color.red}10`,
                border: `1px solid ${color.red}20`,
                fontSize: s(12),
                color: color.red,
                fontFamily: font.display,
              }}
            >
              {chat.reply}
            </div>
          </div>
        );
      })}

      {/* "Amnesia" label */}
      <div
        style={{
          marginTop: s(6),
          fontSize: s(14),
          color: color.red,
          fontFamily: font.display,
          fontWeight: fontWeight.semibold,
          opacity: interpolate(f, [200, 220], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        致命问题：失忆症 🤦
      </div>
    </div>
  );
};

const AmnesiaRight: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const enterScale = spring({
    frame: f - 150,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });
  const enterOpacity = interpolate(f, [148, 168], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // File tree items
  const files = [
    { icon: "📁", name: "~/Documents/", accent: color.green },
    { icon: "📄", name: "report.pptx", accent: color.blue },
    { icon: "📊", name: "data.xlsx", accent: color.purple },
    { icon: "📝", name: "notes.md", accent: color.orange },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: s(16),
        opacity: enterOpacity,
        transform: `scale(${Math.min(enterScale, 1.05)})`,
      }}
    >
      {/* AI + local files visual */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: s(16),
          marginBottom: s(8),
        }}
      >
        <div
          style={{
            width: s(60),
            height: s(60),
            borderRadius: s(16),
            background: `linear-gradient(135deg, ${color.green}20, ${color.green}08)`,
            border: `2px solid ${color.green}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: s(28),
            boxShadow: shadow.glow(color.green, 0.1),
          }}
        >
          🤖
        </div>
        <span
          style={{
            fontSize: s(22),
            color: color.green,
            fontFamily: font.display,
            fontWeight: fontWeight.semibold,
          }}
        >
          =
        </span>
        <div
          style={{
            width: s(60),
            height: s(60),
            borderRadius: s(16),
            background: `linear-gradient(135deg, ${color.blue}20, ${color.blue}08)`,
            border: `2px solid ${color.blue}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: s(28),
          }}
        >
          💻
        </div>
      </div>

      {/* File tree */}
      <div
        style={{
          width: s(260),
          background: color.bgCard,
          borderRadius: s(12),
          border: `1px solid ${color.border}`,
          padding: `${s(12)}px ${s(16)}px`,
          display: "flex",
          flexDirection: "column",
          gap: s(6),
        }}
      >
        {files.map((file, i) => {
          const fileDelay = 170 + i * 15;
          const fileOpacity = interpolate(f, [fileDelay, fileDelay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(8),
                opacity: fileOpacity,
                paddingLeft: i > 0 ? s(16) : 0,
              }}
            >
              <span style={{ fontSize: s(14) }}>{file.icon}</span>
              <span
                style={{
                  fontSize: s(13),
                  color: file.accent,
                  fontFamily: font.mono,
                }}
              >
                {file.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Benefit labels */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: s(4),
          opacity: interpolate(f, [220, 240], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: s(14),
            color: color.green,
            fontFamily: font.display,
            fontWeight: fontWeight.medium,
          }}
        >
          不需要上传 · 不需要复制粘贴
        </span>
        <span
          style={{
            fontSize: s(13),
            color: color.textSecondary,
            fontFamily: font.display,
          }}
        >
          你的文件就是它的上下文
        </span>
      </div>
    </div>
  );
};

// ── Section 2: Execution ──
const ExecutionLeft: React.FC<{ f: number }> = ({ f }) => {
  const bubbleOpacity = interpolate(f, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bubbleScale = interpolate(f, [60, 85], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Typewriter for suggestion text
  const text = "建议你执行以下步骤来清理磁盘：\n1. 打开 Finder → 前往 → 资源库\n2. 找到 Caches 文件夹\n3. 手动删除不需要的缓存\n4. 清空废纸篓\n...";
  const visibleChars = Math.floor(
    interpolate(f, [95, 220], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        opacity: bubbleOpacity,
        transform: `scale(${bubbleScale})`,
      }}
    >
      <div
        style={{
          width: s(340),
          background: color.bgElevated,
          borderRadius: s(16),
          padding: `${s(20)}px ${s(24)}px`,
          border: `1px solid ${color.divider}`,
        }}
      >
        <div
          style={{
            fontSize: s(14),
            color: color.textSecondary,
            fontFamily: font.display,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            minHeight: s(140),
          }}
        >
          {text.slice(0, visibleChars)}
          {visibleChars < text.length && (
            <span style={{ opacity: 0.5 }}>▌</span>
          )}
        </div>
      </div>
      <div
        style={{
          marginTop: s(12),
          fontSize: s(14),
          color: color.textTertiary,
          fontFamily: font.display,
          textAlign: "center",
        }}
      >
        💬 只能给你一堆文字建议
      </div>
    </div>
  );
};

const ExecutionRight: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // Terminal execution animation
  const termOpacity = interpolate(f, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Progress bar
  const progress = interpolate(f, [180, 240], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // GB counter
  const gbCount = interpolate(f, [180, 240], [0, 106], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "Done" badge
  const doneScale = spring({
    frame: f - 245,
    fps,
    config: { damping: 10 },
  });
  const doneOpacity = interpolate(f, [243, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: s(20),
        opacity: termOpacity,
      }}
    >
      {/* Terminal window */}
      <div
        style={{
          width: s(340),
          background: "rgba(19,19,20,0.04)",
          borderRadius: s(12),
          overflow: "hidden",
          border: `1px solid rgba(107,158,120,0.2)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: s(32),
            background: "rgba(19,19,20,0.06)",
            display: "flex",
            alignItems: "center",
            padding: `0 ${s(12)}px`,
            gap: s(6),
          }}
        >
          <div
            style={{
              width: s(10),
              height: s(10),
              borderRadius: s(5),
              background: "#ff5f56",
            }}
          />
          <div
            style={{
              width: s(10),
              height: s(10),
              borderRadius: s(5),
              background: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: s(10),
              height: s(10),
              borderRadius: s(5),
              background: "#27c93f",
            }}
          />
        </div>
        {/* Content */}
        <div style={{ padding: `${s(16)}px ${s(20)}px` }}>
          <div
            style={{
              fontSize: s(14),
              color: color.green,
              fontFamily: font.mono,
              marginBottom: s(12),
            }}
          >
            $ mo clean --execute
          </div>
          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: s(6),
              background: "rgba(19,19,20,0.08)",
              borderRadius: s(3),
              overflow: "hidden",
              marginBottom: s(8),
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${color.green}, #7db88a)`,
                borderRadius: s(3),
              }}
            />
          </div>
          <div
            style={{
              fontSize: s(13),
              color: color.textSecondary,
              fontFamily: font.mono,
            }}
          >
            已释放 {gbCount.toFixed(1)} GB
          </div>
        </div>
      </div>

      {/* Done badge */}
      <div
        style={{
          opacity: doneOpacity,
          transform: `scale(${doneScale})`,
          fontSize: s(18),
          fontWeight: fontWeight.semibold,
          color: color.green,
          fontFamily: font.display,
          display: "flex",
          alignItems: "center",
          gap: s(8),
        }}
      >
        <span style={{ fontSize: s(24) }}>⚡</span>
        直接执行，实打实释放空间
      </div>
    </div>
  );
};

// ── Section 3: AI 操作系统 + Skill 升级补丁 ──
const SkillOSLeft: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // Plain Claude Code = basic OS layer, limited
  const osOpacity = interpolate(f, [60, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const osScale = spring({
    frame: f - 60,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.7 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: s(16),
        opacity: osOpacity,
        transform: `scale(${Math.min(osScale, 1.05)})`,
      }}
    >
      {/* Base OS block */}
      <div
        style={{
          width: s(260),
          height: s(180),
          borderRadius: s(16),
          background: `${color.text}06`,
          border: `1.5px solid ${color.border}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: s(12),
        }}
      >
        <span style={{ fontSize: s(48) }}>💻</span>
        <div
          style={{
            fontFamily: font.display,
            fontSize: s(20),
            fontWeight: fontWeight.bold,
            color: color.textSecondary,
          }}
        >
          基础 Claude Code
        </div>
        <div
          style={{
            fontFamily: font.display,
            fontSize: s(13),
            color: color.textTertiary,
          }}
        >
          通用对话能力
        </div>
      </div>

      {/* Empty skill slots */}
      <div
        style={{
          display: "flex",
          gap: s(8),
          opacity: interpolate(f, [100, 120], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: s(70),
              height: s(36),
              borderRadius: s(8),
              border: `1.5px dashed ${color.textTertiary}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: s(11),
              color: color.textTertiary,
              fontFamily: font.display,
            }}
          >
            空
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: s(14),
          color: color.textTertiary,
          fontFamily: font.display,
          opacity: interpolate(f, [130, 150], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        没有 Skill = 没有专长
      </div>
    </div>
  );
};

const SkillOSRight: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  // Skills stacking up like upgrade patches
  const skills = [
    { icon: "🧹", name: "disk-cleaner", label: "磁盘清理", accent: color.orange },
    { icon: "📂", name: "file-organizer", label: "文件整理", accent: color.blue },
    { icon: "🧠", name: "doc-mindmap", label: "文档提炼", accent: color.purple },
    { icon: "🎙️", name: "podcast-dl", label: "播客下载", accent: color.green },
  ];

  const baseOpacity = interpolate(f, [150, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Level indicator
  const installedCount = skills.reduce((count, _, i) => {
    const skillDelay = 190 + i * 30;
    return f > skillDelay + 15 ? count + 1 : count;
  }, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: s(12),
        opacity: baseOpacity,
      }}
    >
      {/* OS + AI layer */}
      <div
        style={{
          width: s(280),
          padding: `${s(12)}px ${s(16)}px`,
          borderRadius: s(14),
          background: `linear-gradient(135deg, ${color.green}12, ${color.green}06)`,
          border: `1.5px solid ${color.green}30`,
          display: "flex",
          alignItems: "center",
          gap: s(10),
          boxShadow: shadow.glow(color.green, 0.06),
        }}
      >
        <span style={{ fontSize: s(24) }}>🤖</span>
        <div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(16),
              fontWeight: fontWeight.bold,
              color: color.text,
            }}
          >
            Claude Code + Skills
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(11),
              color: color.green,
            }}
          >
            操作系统 + 升级补丁
          </div>
        </div>
      </div>

      {/* Skill patches stacking */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: s(6),
          width: s(280),
        }}
      >
        {skills.map((skill, i) => {
          const skillDelay = 190 + i * 30;
          const skillScale = spring({
            frame: f - skillDelay,
            fps,
            config: { damping: 10, stiffness: 160, mass: 0.5 },
          });
          const skillOpacity = interpolate(f, [skillDelay, skillDelay + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: s(8),
                padding: `${s(6)}px ${s(10)}px`,
                borderRadius: s(8),
                background: `${skill.accent}10`,
                border: `1px solid ${skill.accent}25`,
                opacity: skillOpacity,
                transform: `scale(${Math.min(skillScale, 1.04)})`,
              }}
            >
              <span style={{ fontSize: s(16) }}>{skill.icon}</span>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: s(11),
                  color: skill.accent,
                  fontWeight: fontWeight.semibold,
                  flex: 1,
                }}
              >
                {skill.name}
              </span>
              <span
                style={{
                  fontFamily: font.display,
                  fontSize: s(11),
                  color: color.textSecondary,
                }}
              >
                {skill.label}
              </span>
              {skillOpacity > 0.8 && (
                <span style={{ fontSize: s(12) }}>✅</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Level indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: s(8),
          opacity: interpolate(f, [310, 330], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontFamily: font.display,
            fontSize: s(14),
            fontWeight: fontWeight.semibold,
            color: color.green,
          }}
        >
          装的越多，系统越强 ⚡
        </span>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════
// Main Composition
// ══════════════════════════════════════════

export const CloudVsLocal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section boundaries
  const S1_START = 0;
  const S1_END = 750;
  const S2_START = 750;
  const S2_END = 1500;
  const S3_START = 1500;
  const S3_END = 2100;
  const S4_START = 2100;
  const S4_END = 2700;

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Section 4: Taglines ──
  const tagline1Opacity = interpolate(frame, [S4_START + 50, S4_START + 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagline1Y = interpolate(frame, [S4_START + 50, S4_START + 100], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const tagline2Opacity = interpolate(frame, [S4_START + 180, S4_START + 230], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagline2Scale = spring({
    frame: frame - (S4_START + 180),
    fps,
    config: { damping: 10 },
  });
  const tagline3Opacity = interpolate(frame, [S4_START + 310, S4_START + 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagline3Y = interpolate(frame, [S4_START + 310, S4_START + 360], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Final fade
  const finalFade = interpolate(frame, [S4_END - 50, S4_END], [0, 1], {
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
        {/* Noise overlay */}
        <div style={noiseOverlay} />

        {/* ── Section 1: 失忆症 ── */}
        {frame < S1_END && (
          <AbsoluteFill style={{ opacity: sectionOpacity(frame, S1_START, S1_END) }}>
            <SplitScreen
              frame={frame}
              sectionStart={S1_START}
              title={"\u201C\u5931\u5FC6\u75C7\u201D"}
              leftLabel="Claude.ai (网页版)"
              rightLabel="Claude Code (本地)"
              leftContent={<AmnesiaLeft f={frame - S1_START} fps={fps} />}
              rightContent={<AmnesiaRight f={frame - S1_START} fps={fps} />}
              leftCaption="每次新对话，从头来过"
              rightCaption="文件就是你的上下文"
            />
          </AbsoluteFill>
        )}

        {/* ── Section 2: Execution ── */}
        {frame >= S2_START - 30 && frame < S2_END && (
          <AbsoluteFill style={{ opacity: sectionOpacity(frame, S2_START, S2_END) }}>
            <SplitScreen
              frame={frame}
              sectionStart={S2_START}
              title="对比二：动嘴 vs 动手"
              leftLabel="💬 Talking — Claude.ai"
              rightLabel="⚡ Doing — Claude Code"
              leftContent={<ExecutionLeft f={frame - S2_START} />}
              rightContent={<ExecutionRight f={frame - S2_START} fps={fps} />}
              leftCaption="只能给建议"
              rightCaption="能直接动手"
            />
          </AbsoluteFill>
        )}

        {/* ── Section 3: AI 操作系统 + Skill 升级 ── */}
        {frame >= S3_START - 30 && frame < S3_END && (
          <AbsoluteFill style={{ opacity: sectionOpacity(frame, S3_START, S3_END) }}>
            <SplitScreen
              frame={frame}
              sectionStart={S3_START}
              title={"\u5BF9\u6BD4\u4E09\uFF1A\u53EF\u8FDB\u5316\u7684 AI \u7CFB\u7EDF"}
              leftLabel={"\u201C\u88F8\u5954\u201D Claude Code"}
              rightLabel="Claude Code + Skills"
              leftContent={<SkillOSLeft f={frame - S3_START} fps={fps} />}
              rightContent={<SkillOSRight f={frame - S3_START} fps={fps} />}
              leftCaption={"没有 Skill = 没有专长"}
              rightCaption={"装的越多，系统越强"}
            />
          </AbsoluteFill>
        )}

        {/* ── Section 4: Taglines ── */}
        {frame >= S4_START && (
          <AbsoluteFill
            style={{
              opacity: sectionOpacity(frame, S4_START, S4_END + 50),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: s(32),
            }}
          >
            {/* AI-generated cinematic background */}
            <Img
              src={staticFile("bg-tagline-cloud-vs-local.png")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: interpolate(
                  frame,
                  [S4_START, S4_START + 60],
                  [0, 0.4],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                ),
              }}
            />
            <div
              style={{
                fontSize: s(44),
                fontWeight: fontWeight.medium,
                color: color.text,
                fontFamily: font.display,
                opacity: tagline1Opacity,
                transform: `translateY(${tagline1Y}px)`,
                letterSpacing: "0.02em",
              }}
            >
              Claude 是用来<span style={{ color: color.red }}>讨论</span>的，Claude Code 是用来<span style={{ color: color.green }}>行动</span>的
            </div>
            <div
              style={{
                fontSize: s(48),
                fontWeight: fontWeight.heavy,
                color: color.green,
                fontFamily: font.display,
                opacity: tagline2Opacity,
                transform: `scale(${Math.min(tagline2Scale, 1.05)})`,
                textShadow: shadow.textGlow(color.green, 0.3),
              }}
            >
              Claude Code is not just for coders
            </div>
            <div
              style={{
                fontSize: s(36),
                fontWeight: fontWeight.medium,
                color: color.textSecondary,
                fontFamily: font.display,
                opacity: tagline3Opacity,
                transform: `translateY(${tagline3Y}px)`,
                letterSpacing: "0.05em",
              }}
            >
              你说人话，它办实事
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* Final fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: color.black,
          opacity: finalFade,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
