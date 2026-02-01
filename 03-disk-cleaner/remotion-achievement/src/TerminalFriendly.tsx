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
  noiseOverlay,
  radius,
  s,
} from "./lib/theme";

// ── 终端不可怕 (13:50–13:58) ──
//
// 口播：
//   "可千万别对终端发怵"
//   "其实它就是一种更简单的和电脑对话的方式"
//   "你打字它执行，就这么简单"
//
// Timeline (240 frames @ 30fps = 8s):
//   0–15    背景渐入
//  15–55    "吓人"的终端图标 → 摇晃 → 变成笑脸
//  55–90    友好终端窗口弹入
//  90–150   打字动画: 用户输入 → AI 回复
// 150–190   底部金句: "你打字，它执行"
// 190–210   Hold
// 210–240   淡出

export const TerminalFriendly: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ──
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scary terminal phase (15–55) ──
  const scaryOpacity = interpolate(
    frame,
    [15, 25, 42, 55],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Shake effect
  const scaryShake =
    frame >= 30 && frame <= 42
      ? Math.sin((frame - 30) * 1.8) * 6 * (1 - (frame - 30) / 12)
      : 0;
  // Morph: scary → friendly
  const morphProgress = interpolate(frame, [42, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Friendly terminal window (55–) ──
  const termScale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 10, stiffness: 140, mass: 0.7 },
  });
  const termOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Typing animation (90–150) ──
  const userText = "帮我清理一下磁盘";
  const userChars = Math.floor(
    interpolate(frame, [90, 115], [0, userText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const aiReply = "✓ 好的，已清理 106 GB，磁盘空间充足";
  const aiDelay = 125;
  const aiChars = Math.floor(
    interpolate(frame, [aiDelay, aiDelay + 25], [0, aiReply.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const aiOpacity = interpolate(frame, [aiDelay - 3, aiDelay + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Bottom punchline (150–) ──
  const punchOpacity = interpolate(frame, [150, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const punchY = interpolate(frame, [150, 170], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const punchScale = spring({
    frame: frame - 155,
    fps,
    config: { damping: 10, stiffness: 160, mass: 0.6 },
  });

  // ── Fade out ──
  const fadeOut = interpolate(frame, [210, 240], [0, 1], {
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

        {/* ── Scary → Friendly emoji transition ── */}
        <div
          style={{
            position: "absolute",
            top: s(80),
            width: "100%",
            textAlign: "center",
            opacity: scaryOpacity,
            transform: `translateX(${scaryShake}px)`,
          }}
        >
          <div style={{ fontSize: s(72), marginBottom: s(12) }}>
            {morphProgress < 0.5 ? "😰" : "😊"}
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(32),
              fontWeight: fontWeight.bold,
              color: morphProgress < 0.5 ? color.red : color.green,
            }}
          >
            {morphProgress < 0.5
              ? "终端？好可怕..."
              : "其实超简单！"}
          </div>
        </div>

        {/* ── Friendly terminal window ── */}
        <div
          style={{
            position: "absolute",
            top: s(220),
            left: "50%",
            transform: `translateX(-50%) scale(${Math.min(termScale, 1.03)})`,
            opacity: termOpacity,
            width: s(620),
          }}
        >
          {/* Window chrome */}
          <div
            style={{
              background: `${color.text}08`,
              borderRadius: `${s(14)}px ${s(14)}px 0 0`,
              padding: `${s(10)}px ${s(16)}px`,
              display: "flex",
              alignItems: "center",
              gap: s(7),
              border: `1px solid ${color.border}`,
              borderBottom: "none",
            }}
          >
            <div
              style={{
                width: s(10),
                height: s(10),
                borderRadius: "50%",
                background: "#ff5f56",
              }}
            />
            <div
              style={{
                width: s(10),
                height: s(10),
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: s(10),
                height: s(10),
                borderRadius: "50%",
                background: "#27c93f",
              }}
            />
            <span
              style={{
                marginLeft: s(12),
                fontFamily: font.mono,
                fontSize: s(12),
                color: color.textTertiary,
              }}
            >
              Terminal — zsh
            </span>
          </div>

          {/* Terminal body */}
          <div
            style={{
              background: color.bgCard,
              borderRadius: `0 0 ${s(14)}px ${s(14)}px`,
              padding: `${s(20)}px ${s(24)}px`,
              border: `1px solid ${color.border}`,
              borderTop: "none",
              minHeight: s(160),
              display: "flex",
              flexDirection: "column",
              gap: s(14),
            }}
          >
            {/* User input line */}
            <div style={{ display: "flex", alignItems: "center", gap: s(8) }}>
              <span
                style={{
                  fontFamily: font.mono,
                  fontSize: s(15),
                  color: color.green,
                  fontWeight: fontWeight.semibold,
                }}
              >
                $
              </span>
              <span
                style={{
                  fontFamily: font.display,
                  fontSize: s(18),
                  color: color.text,
                }}
              >
                {userText.slice(0, userChars)}
                {userChars > 0 && userChars < userText.length && (
                  <span
                    style={{
                      color: color.green,
                      opacity: frame % 10 < 6 ? 1 : 0,
                    }}
                  >
                    ▌
                  </span>
                )}
              </span>
            </div>

            {/* AI reply */}
            {aiOpacity > 0 && (
              <div
                style={{
                  opacity: aiOpacity,
                  display: "flex",
                  flexDirection: "column",
                  gap: s(6),
                }}
              >
                <div
                  style={{
                    fontFamily: font.mono,
                    fontSize: s(15),
                    color: color.green,
                    lineHeight: 1.6,
                  }}
                >
                  {aiReply.slice(0, aiChars)}
                </div>
                {/* Done indicator */}
                {aiChars >= aiReply.length && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: s(6),
                      marginTop: s(4),
                    }}
                  >
                    <span
                      style={{
                        fontFamily: font.mono,
                        fontSize: s(13),
                        color: color.textTertiary,
                      }}
                    >
                      $
                    </span>
                    <span
                      style={{
                        color: color.green,
                        opacity: frame % 12 < 7 ? 0.6 : 0,
                      }}
                    >
                      ▌
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Annotation: 对话式标注 */}
          <div
            style={{
              position: "absolute",
              right: -s(30),
              top: s(60),
              opacity: interpolate(frame, [100, 115], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                padding: `${s(6)}px ${s(14)}px`,
                borderRadius: radius.full,
                background: `${color.blue}12`,
                border: `1px solid ${color.blue}25`,
                fontFamily: font.display,
                fontSize: s(13),
                color: color.blue,
                fontWeight: fontWeight.medium,
                whiteSpace: "nowrap",
              }}
            >
              ← 你说的话
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: -s(30),
              top: s(125),
              opacity: interpolate(frame, [aiDelay + 15, aiDelay + 28], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div
              style={{
                padding: `${s(6)}px ${s(14)}px`,
                borderRadius: radius.full,
                background: `${color.green}12`,
                border: `1px solid ${color.green}25`,
                fontFamily: font.display,
                fontSize: s(13),
                color: color.green,
                fontWeight: fontWeight.medium,
                whiteSpace: "nowrap",
              }}
            >
              ← 电脑执行
            </div>
          </div>
        </div>

        {/* ── Bottom punchline ── */}
        <div
          style={{
            position: "absolute",
            bottom: s(100),
            width: "100%",
            textAlign: "center",
            opacity: punchOpacity,
            transform: `translateY(${punchY}px) scale(${Math.min(punchScale, 1.05)})`,
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(40),
              fontWeight: fontWeight.heavy,
              color: color.text,
              letterSpacing: "0.03em",
            }}
          >
            你
            <span style={{ color: color.blue }}>打字</span>
            ，它
            <span style={{ color: color.green }}>执行</span>
          </div>
          <div
            style={{
              fontFamily: font.display,
              fontSize: s(22),
              fontWeight: fontWeight.medium,
              color: color.textSecondary,
              marginTop: s(10),
            }}
          >
            就这么简单
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
