import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { font, color } from "./lib/theme";

// ── 省钱计算器：打字机收据风格 (210 frames @ 30fps = 7s) ──
//
// Timeline:
//   0–15     背景淡入，卡片 spring 弹入
//  15–50     第1行打字：Apple 1TB 升级    ¥3,000
//  55–100    第2行打字：每 GB 成本 …
// 105–145    第3行打字：释放 106 GB …
// 145–155    分隔线从左到右划出
// 155–180    结论行弹入 🍲 火锅钱到手！
// 180–195    Hold（金额微脉冲）
// 195–210    淡出

// ── Typing config ──

interface TypeLine {
  text: string;
  startFrame: number;
  endFrame: number;
}

const LINES: TypeLine[] = [
  { text: "Apple 1TB 升级    ¥3,000", startFrame: 15, endFrame: 50 },
  { text: "每 GB 成本        ¥3,000 ÷ 1,024 ≈ ¥3", startFrame: 55, endFrame: 100 },
  { text: "释放 106 GB       106 × ¥3 = ¥318", startFrame: 105, endFrame: 145 },
];

const RESULT_LINE = "🍲 一顿火锅钱到手！    +¥318";

/** Return how many characters to show for a given line at current frame */
function typedCount(frame: number, line: TypeLine): number {
  if (frame < line.startFrame) return 0;
  if (frame >= line.endFrame) return line.text.length;
  const progress = (frame - line.startFrame) / (line.endFrame - line.startFrame);
  return Math.floor(progress * line.text.length);
}

/** Blinking cursor — visible 500ms on / 500ms off at 30fps */
function cursorVisible(frame: number): boolean {
  return Math.floor(frame / 8) % 2 === 0;
}

export const ValueCalculator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background fade-in ──
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Card spring entrance ──
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 20,
  });
  const cardOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Divider line wipe (145–155) ──
  const dividerProgress = interpolate(frame, [145, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Result line spring bounce (155–180) ──
  const resultSpring = spring({
    frame: frame - 155,
    fps,
    config: { damping: 8, stiffness: 160 },
  });
  const resultOpacity = interpolate(frame, [155, 162], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Gold pulse (180–195) ──
  const goldPulse =
    frame >= 180 && frame <= 195
      ? 1 + 0.06 * Math.sin((frame - 180) * 0.4)
      : 1;

  // ── Wiggle for 得意 effect (160–175) ──
  const wiggle =
    frame >= 160 && frame <= 175
      ? Math.sin((frame - 160) * 1.2) * 2
      : 0;

  // ── Fade out (195–210) ──
  const fadeOut = interpolate(frame, [195, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Determine which line is actively typing (for cursor placement)
  const activeLineIndex = LINES.findIndex(
    (l) => frame >= l.startFrame && frame < l.endFrame,
  );
  // If between lines or after all lines, cursor stays on last completed line
  const cursorLineIndex =
    activeLineIndex >= 0
      ? activeLineIndex
      : frame >= LINES[LINES.length - 1].endFrame
        ? -1 // no cursor after typing done
        : LINES.findIndex((l) => frame < l.startFrame) - 1;

  const showCursor = cursorVisible(frame) && frame < 155;

  // ── Styles ──
  const monoStyle: React.CSSProperties = {
    fontFamily: font.mono,
    fontSize: 36,
    lineHeight: 1.8,
    whiteSpace: "pre",
    color: "#e8e4db",
    letterSpacing: "0.02em",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/* Background */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            background: "linear-gradient(145deg, #1e1e22 0%, #28282e 100%)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)",
            padding: "48px 64px",
            minWidth: 820,
            position: "relative",
          }}
        >
          {/* Typed lines */}
          {LINES.map((line, i) => {
            const count = typedCount(frame, line);
            if (count === 0 && frame < line.startFrame) return null;
            const displayed = line.text.slice(0, count);
            const cursor =
              showCursor && cursorLineIndex === i ? "▌" : "";

            return (
              <div key={i} style={monoStyle}>
                {displayed}
                <span style={{ color: "#d97757", opacity: cursor ? 1 : 0 }}>
                  {cursor || "▌"}
                </span>
              </div>
            );
          })}

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, #9c958b ${dividerProgress * 100}%, transparent ${dividerProgress * 100}%)`,
              margin: "8px 0",
              opacity: dividerProgress > 0 ? 1 : 0,
            }}
          />

          {/* Result line */}
          {frame >= 155 && (
            <div
              style={{
                ...monoStyle,
                fontSize: 42,
                fontWeight: 700,
                color: "#c9a84c",
                opacity: resultOpacity,
                transform: `scale(${resultSpring * goldPulse}) rotate(${wiggle}deg)`,
                transformOrigin: "center",
                textShadow: `0 0 24px rgba(201,168,76,0.4), 0 0 48px rgba(201,168,76,0.15)`,
                marginTop: 8,
              }}
            >
              {RESULT_LINE}
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Fade to black */}
      <AbsoluteFill
        style={{
          backgroundColor: "#131314",
          opacity: fadeOut,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
