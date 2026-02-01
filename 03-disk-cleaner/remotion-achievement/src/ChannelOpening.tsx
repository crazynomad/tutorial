import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  Easing,
} from "remotion";
import { color, font, fontWeight } from "./lib/theme";

// ── 频道开场动画 ──
// 基于频道封面图（赛博朋克绿皮火车站）的开场动画
//
// Timeline (180 frames @ 30fps = 6s):
//   0–15    黑屏
//  15–45    封面图从模糊+暗 渐入清晰+亮（Ken Burns 缓推）
//  45–70    "AI FOR EVERYONE" 从透明淡入（上方区域）
//  70–100   分隔线展开 + "听得懂，学得会，用得上" 淡入
// 100–145   Hold（继续 Ken Burns）
// 145–180   整体淡出到奶白

export const ChannelOpening: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Ken Burns: slow zoom in + slight pan ──
  const scale = interpolate(frame, [0, 180], [1.05, 1.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const panX = interpolate(frame, [0, 180], [0, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panY = interpolate(frame, [0, 180], [0, -6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Image reveal: dark+blur → clear ──
  const imgOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imgBrightness = interpolate(frame, [15, 50], [0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imgBlur = interpolate(frame, [15, 45], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Vignette overlay (warm dark edges) ──
  const vignetteOpacity = interpolate(frame, [15, 60], [0.8, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── "AI FOR EVERYONE" ──
  const aiSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.7 },
  });
  const aiOpacity = interpolate(frame, [45, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aiY = interpolate(aiSpring, [0, 1], [18, 0]);

  // ── Decorative line ──
  const lineWidth = spring({
    frame: frame - 65,
    fps,
    config: { damping: 18, stiffness: 100, mass: 0.6 },
  });

  // ── Tagline: 听得懂，学得会，用得上 ──
  const tagOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [70, 90], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Glow behind text ──
  const glowOpacity = interpolate(
    frame,
    [50, 80, 145, 170],
    [0, 0.5, 0.5, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // ── Fade out to cream ──
  const fadeOut = interpolate(frame, [145, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── All content fades with exit ──
  const contentOpacity = interpolate(frame, [145, 170], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Background image with Ken Burns */}
      <AbsoluteFill
        style={{
          opacity: imgOpacity,
          filter: `brightness(${imgBrightness}) blur(${imgBlur}px)`,
        }}
      >
        <Img
          src={staticFile("channel-16-9.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          }}
        />
      </AbsoluteFill>

      {/* Warm vignette overlay */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(10,8,5,0.85) 100%)",
          opacity: vignetteOpacity,
        }}
      />

      {/* Bottom gradient for text readability */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(10,8,5,0.6) 0%, rgba(10,8,5,0.25) 30%, transparent 55%)",
          opacity: imgOpacity,
        }}
      />

      {/* Content container — positioned in lower-center area above 绿皮火车 */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 160,
          opacity: contentOpacity,
        }}
      >
        {/* Glow behind text */}
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(217,119,87,0.25) 0%, transparent 70%)",
            opacity: glowOpacity,
            filter: "blur(35px)",
            bottom: 180,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        {/* AI FOR EVERYONE */}
        <div
          style={{
            fontFamily: font.mono,
            fontSize: 20,
            fontWeight: fontWeight.medium,
            color: "#d97757",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            opacity: aiOpacity,
            transform: `translateY(${aiY}px)`,
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        >
          AI for Everyone
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 160 * lineWidth,
            height: 1.5,
            background:
              "linear-gradient(90deg, transparent, #d97757, transparent)",
            marginTop: 14,
            marginBottom: 14,
            opacity: tagOpacity,
          }}
        />

        {/* Tagline: 听得懂，学得会，用得上 */}
        <div
          style={{
            fontFamily: font.display,
            fontSize: 26,
            fontWeight: fontWeight.regular,
            color: "rgba(250,249,240,0.85)",
            letterSpacing: "0.08em",
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            textShadow: "0 1px 10px rgba(0,0,0,0.5)",
          }}
        >
          听得懂，学得会，用得上
        </div>
      </AbsoluteFill>

      {/* Fade out to cream (matches next scene bg) */}
      <AbsoluteFill
        style={{
          backgroundColor: color.bg,
          opacity: fadeOut,
          zIndex: 999,
        }}
      />
    </AbsoluteFill>
  );
};
