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
  noiseOverlay,
  s,
} from "./lib/theme";

// ── macOS-style "Storage Almost Full" warning dialog ──
// Scene 01 opening: 0:00–0:08 (240 frames @ 30fps)
//
// Timeline:
//   0–20   Desktop fade-in with blurred wallpaper
//  20–40   Dialog drops in (spring bounce)
//  40–60   Warning icon pulse
//  60–90   Storage bar fills to ~95%
//  90–120  Text "你的磁盘空间即将用完" typewriter
// 120–160  Red glow intensifies, subtle screen shake
// 160–200  Second warning notification slides in from top-right
// 200–240  Everything pulses red, fade to black

export const StorageWarning: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Desktop background ──
  const desktopOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Dialog entrance (spring drop) ──
  const dialogScale = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  });
  const dialogOpacity = interpolate(frame, [18, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dialogY = interpolate(
    dialogScale,
    [0, 1],
    [-40, 0],
  );

  // ── Warning icon pulse (after dialog lands) ──
  const iconPulse =
    frame > 45
      ? 1 + 0.06 * Math.sin((frame - 45) * 0.15)
      : interpolate(frame, [38, 45], [0.8, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  // ── Storage bar fill ──
  const barFillPercent = interpolate(frame, [55, 100], [0, 95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const barColor =
    barFillPercent > 85
      ? `rgb(${196 + Math.sin(frame * 0.2) * 15}, 102, 90)`
      : barFillPercent > 70
        ? "#c9943a"
        : "#5daa68";

  // ── Typewriter text ──
  const fullText = "你的磁盘空间即将用完";
  const charsVisible = Math.floor(
    interpolate(frame, [85, 130], [0, fullText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const displayText = fullText.slice(0, charsVisible);
  const showCursor = frame >= 85 && frame <= 140 && frame % 10 < 6;

  // ── Red vignette intensify ──
  const redGlow = interpolate(frame, [110, 180], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Screen shake ──
  const shakeX =
    frame > 120 && frame < 200
      ? Math.sin(frame * 1.8) * interpolate(frame, [120, 160], [0, 3], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  const shakeY =
    frame > 120 && frame < 200
      ? Math.cos(frame * 2.1) * interpolate(frame, [120, 160], [0, 2], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  // ── Top-right notification slide-in ──
  const notifX = interpolate(frame, [155, 175], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const notifOpacity = interpolate(frame, [155, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Remaining space countdown ──
  const remainingGB = interpolate(frame, [55, 100], [28, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Final fade to black ──
  const fadeOut = interpolate(frame, [215, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Disk usage label ──
  const usedGB = interpolate(frame, [55, 100], [221, 248.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#faf9f0",
        opacity: desktopOpacity,
      }}
    >
      {/* macOS-style desktop gradient */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, #faf9f0 0%, #f3f0e8 40%, #efe9dc 100%)",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Noise overlay */}
        <div style={noiseOverlay} />

        {/* Subtle desktop dots pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "radial-gradient(circle, #131314 1px, transparent 1px)",
            backgroundSize: `${s(30)}px ${s(30)}px`,
          }}
        />

        {/* ── macOS Menu Bar ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: s(32),
            background: "rgba(245, 242, 235, 0.92)",
            backdropFilter: "blur(20px)",
            display: "flex",
            alignItems: "center",
            padding: `0 ${s(16)}px`,
            fontSize: s(14),
            fontFamily: font.display,
            color: color.text,
            fontWeight: fontWeight.semibold,
            zIndex: 10,
          }}
        >
          {/* Apple logo */}
          <span style={{ fontSize: s(18), marginRight: s(24) }}></span>
          <span style={{ marginRight: s(20), fontWeight: fontWeight.bold }}>Finder</span>
          <span style={{ marginRight: s(20), fontWeight: fontWeight.regular, opacity: 0.9 }}>
            文件
          </span>
          <span style={{ marginRight: s(20), fontWeight: fontWeight.regular, opacity: 0.9 }}>
            编辑
          </span>
          <span style={{ marginRight: s(20), fontWeight: fontWeight.regular, opacity: 0.9 }}>
            显示
          </span>
        </div>

        {/* ── Center Dialog ── */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${dialogY}px) scale(${Math.min(dialogScale, 1)})`,
            opacity: dialogOpacity,
            width: s(520),
            background: "rgba(250, 249, 240, 0.97)",
            backdropFilter: "blur(40px)",
            borderRadius: s(14),
            boxShadow: `
              0 20px 60px rgba(19,19,20,0.12),
              0 0 0 0.5px rgba(19,19,20,0.08),
              0 0 ${30 + redGlow * 60}px rgba(196,102,90,${redGlow * 0.4})
            `,
            padding: `${s(36)}px ${s(36)}px ${s(28)}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          {/* Warning Icon */}
          <div
            style={{
              width: s(72),
              height: s(72),
              marginBottom: s(20),
              transform: `scale(${iconPulse})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="72" height="72" viewBox="0 0 72 72">
              {/* Disk icon base */}
              <rect
                x="8"
                y="16"
                width="56"
                height="40"
                rx="6"
                fill="#e8e4db"
                stroke={color.textTertiary}
                strokeWidth="1"
              />
              {/* Disk platter */}
              <ellipse cx="36" cy="33" rx="16" ry="16" fill="#f3f0e8" />
              <ellipse
                cx="36"
                cy="33"
                rx="12"
                ry="12"
                fill="none"
                stroke={color.textTertiary}
                strokeWidth="0.5"
              />
              <ellipse cx="36" cy="33" rx="4" ry="4" fill={color.textTertiary} />
              {/* Warning triangle overlay */}
              <g transform="translate(40, 2)">
                <polygon
                  points="14,0 28,24 0,24"
                  fill={`rgb(${196 + Math.sin(frame * 0.2) * 15}, 102, 90)`}
                  stroke={color.white}
                  strokeWidth="1.5"
                />
                <text
                  x="14"
                  y="19"
                  textAnchor="middle"
                  fill={color.white}
                  fontSize="16"
                  fontWeight="bold"
                  fontFamily={font.display}
                >
                  !
                </text>
              </g>
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: s(22),
              fontWeight: fontWeight.bold,
              color: color.text,
              marginBottom: s(8),
              fontFamily: font.display,
              letterSpacing: -0.3,
            }}
          >
            磁盘空间不足
          </div>

          {/* Typewriter subtitle */}
          <div
            style={{
              fontSize: s(15),
              color: color.textSecondary,
              marginBottom: s(24),
              height: s(22),
              fontFamily: font.display,
            }}
          >
            {displayText}
            {showCursor && (
              <span style={{ color: color.red, fontWeight: 300 }}>|</span>
            )}
          </div>

          {/* Storage bar */}
          <div style={{ width: "100%", marginBottom: s(8) }}>
            <div
              style={{
                width: "100%",
                height: s(10),
                backgroundColor: "#e8e4db",
                borderRadius: s(5),
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${barFillPercent}%`,
                  height: "100%",
                  backgroundColor: barColor,
                  borderRadius: s(5),
                  transition: "background-color 0.3s",
                  boxShadow:
                    barFillPercent > 85
                      ? `0 0 8px rgba(196,102,90,0.4)`
                      : "none",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: s(12),
                color: color.textSecondary,
                marginTop: s(6),
                fontFamily: font.display,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <span>
                {frame >= 55
                  ? `已使用 ${usedGB.toFixed(1)} GB（共 250 GB）`
                  : "已使用 221.0 GB（共 250 GB）"}
              </span>
              <span
                style={{
                  color: remainingGB < 5 ? "#c4665a" : color.textSecondary,
                  fontWeight: remainingGB < 5 ? fontWeight.bold : fontWeight.regular,
                }}
              >
                剩余 {frame >= 55 ? remainingGB.toFixed(1) : "28.0"} GB
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: s(12),
              marginTop: s(20),
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <button
              style={{
                padding: `${s(7)}px ${s(20)}px`,
                borderRadius: s(6),
                border: "1px solid rgba(19,19,20,0.12)",
                background: "rgba(19,19,20,0.05)",
                color: "#131314",
                fontSize: s(14),
                fontFamily: font.display,
                cursor: "default",
              }}
            >
              以后再说
            </button>
            <button
              style={{
                padding: `${s(7)}px ${s(20)}px`,
                borderRadius: s(6),
                border: "none",
                background: "#d97757",
                color: color.white,
                fontSize: s(14),
                fontWeight: fontWeight.semibold,
                fontFamily: font.display,
                cursor: "default",
              }}
            >
              管理存储空间…
            </button>
          </div>
        </div>

        {/* ── Top-right macOS notification ── */}
        <div
          style={{
            position: "absolute",
            top: s(44),
            right: s(16),
            transform: `translateX(${notifX}px)`,
            opacity: notifOpacity,
            width: s(360),
            background: "rgba(250, 249, 240, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: s(14),
            boxShadow: "0 8px 32px rgba(19,19,20,0.1), 0 0 0 0.5px rgba(19,19,20,0.08)",
            padding: `${s(14)}px ${s(16)}px`,
            display: "flex",
            alignItems: "center",
            gap: s(12),
            zIndex: 200,
          }}
        >
          {/* Notification icon */}
          <div
            style={{
              width: s(38),
              height: s(38),
              borderRadius: s(8),
              background: `linear-gradient(135deg, #c4665a, ${color.red})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: s(20), color: color.white, fontWeight: fontWeight.heavy }}
            >
              !
            </span>
          </div>
          <div>
            <div
              style={{
                fontSize: s(14),
                fontWeight: fontWeight.bold,
                color: color.text,
                fontFamily: font.display,
                marginBottom: s(2),
              }}
            >
              系统偏好设置
            </div>
            <div
              style={{
                fontSize: s(13),
                color: color.textSecondary,
                fontFamily: font.display,
              }}
            >
              存储空间严重不足，部分功能可能受限
            </div>
          </div>
        </div>

        {/* ── Red vignette overlay ── */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, rgba(196,102,90,${redGlow * 0.3}) 100%)`,
            pointerEvents: "none",
            zIndex: 300,
          }}
        />
      </AbsoluteFill>

      {/* ── Fade to black ── */}
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
