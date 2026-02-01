import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Header } from "./components/Header";
import { HeroNumber } from "./components/HeroNumber";
import { MoneyBadge } from "./components/MoneyBadge";
import { StatsRow } from "./components/StatsRow";
import { Callout } from "./components/Callout";
import {
  color,
  font,
  gradient,
  noiseOverlay,
} from "./lib/theme";

export type AchievementProps = {
  totalGB: number;
  moneySaved: number;
  photoCount: number;
  songCount: number;
  ssdPrice: string;
  title: string;
  quip: string;
};

export const Achievement: React.FC<AchievementProps> = ({
  totalGB,
  moneySaved,
  photoCount,
  songCount,
  ssdPrice,
  title,
  quip,
}) => {
  const frame = useCurrentFrame();

  // Background fade in
  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle breathing scale at the end
  const breatheScale = interpolate(
    frame,
    [165, 172, 180],
    [1, 1.01, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const stats = [
    { value: photoCount, label: "张照片" },
    { value: songCount, label: "首歌曲" },
    { value: ssdPrice, label: "SSD 价格" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: gradient.sceneBg,
        opacity: bgOpacity,
      }}
    >
      <div style={noiseOverlay} />
      <div
        style={{
          ...styles.page,
          transform: `scale(${breatheScale})`,
        }}
      >
        {/* Header with icon and title */}
        <Header title={title} />

        {/* Hero section with big number */}
        <div style={styles.hero}>
          <HeroNumber targetGB={totalGB} />
          <div style={styles.moneySpacer} />
          <MoneyBadge amount={moneySaved} quip={quip} />
        </div>

        {/* Stats row */}
        <StatsRow stats={stats} />

        {/* Bottom callout */}
        <div style={styles.calloutWrapper}>
          <Callout text="Mole 小而美，tw93 大而强！这才叫真正的极客精神，佩服佩服 🙇" />
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>感谢开源，感谢 tw93</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
    boxSizing: "border-box",
    fontFamily: font.display,
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 0",
    marginTop: 30,
    marginBottom: 30,
    borderTop: `1px solid ${color.border}`,
    borderBottom: `1px solid ${color.border}`,
    width: "100%",
  },
  moneySpacer: {
    height: 24,
  },
  calloutWrapper: {
    marginTop: 36,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 30,
  },
  footerText: {
    fontSize: 18,
    color: color.textSecondary,
  },
};
