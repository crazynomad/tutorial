/**
 * GitHub-Inspired Light Theme
 *
 * Clean, professional aesthetic inspired by GitHub's design system.
 * Light canvas with subtle borders, clean typography, and
 * selective vivid accents.
 */

import { s } from "./theme";

// ── Colors ────────────────────────────────────────────────

export const gh = {
  // Backgrounds
  bg: "#ffffff",
  bgSubtle: "#f6f8fa",
  bgInset: "#f0f3f5",
  bgOverlay: "rgba(0,0,0,0.04)",

  // Borders
  border: "#d0d7de",
  borderMuted: "#e8e8e8",
  borderAccent: "#0969da",

  // Text
  text: "#1f2328",
  textSecondary: "#656d76",
  textTertiary: "#8b949e",
  textOnAccent: "#ffffff",

  // Accent colors (GitHub Primer)
  blue: "#0969da",
  blueBg: "#ddf4ff",
  green: "#1a7f37",
  greenBg: "#dafbe1",
  purple: "#8250df",
  purpleBg: "#eddeff",
  orange: "#bf8700",
  orangeBg: "#fff8c5",
  red: "#cf222e",
  redBg: "#ffebe9",
  pink: "#bf3989",
  pinkBg: "#ffeff7",

  // Special
  white: "#ffffff",
  black: "#1f2328",
} as const;

// ── Typography ────────────────────────────────────────────

export const ghFont = {
  display:
    '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: '"SF Mono", "Fira Code", Menlo, Consolas, monospace',
} as const;

export const ghWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ── Radii ─────────────────────────────────────────────────

export const ghRadius = {
  sm: s(4),
  md: s(6),
  lg: s(12),
  xl: s(16),
  full: 9999,
} as const;

// ── Shadows ───────────────────────────────────────────────

export const ghShadow = {
  sm: "0 1px 0 rgba(31,35,40,0.04)",
  md: "0 1px 3px rgba(31,35,40,0.08), 0 1px 2px rgba(31,35,40,0.06)",
  lg: "0 4px 12px rgba(31,35,40,0.1), 0 1px 3px rgba(31,35,40,0.06)",
  xl: "0 8px 24px rgba(31,35,40,0.12), 0 2px 6px rgba(31,35,40,0.06)",
} as const;

// ── Style Factories ───────────────────────────────────────

/** GitHub-style card */
export const ghCard = (accent?: string): React.CSSProperties => ({
  background: gh.white,
  borderRadius: ghRadius.md,
  border: `1px solid ${accent ? accent : gh.border}`,
  boxShadow: ghShadow.sm,
});

/** GitHub-style label / pill */
export const ghLabel = (
  bgColor: string,
  textColor: string,
): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  padding: `${s(3)}px ${s(10)}px`,
  borderRadius: ghRadius.full,
  background: bgColor,
  fontFamily: ghFont.display,
  fontSize: s(13),
  fontWeight: ghWeight.semibold,
  color: textColor,
  whiteSpace: "nowrap",
});

/** GitHub-style code block */
export const ghCodeBlock: React.CSSProperties = {
  background: gh.bgSubtle,
  borderRadius: ghRadius.md,
  border: `1px solid ${gh.borderMuted}`,
  fontFamily: ghFont.mono,
  fontSize: s(14),
  color: gh.text,
  padding: `${s(12)}px ${s(16)}px`,
  lineHeight: 1.6,
};

/** Section title text style */
export const ghTitle = (size: number = s(32)): React.CSSProperties => ({
  fontFamily: ghFont.display,
  fontSize: size,
  fontWeight: ghWeight.bold,
  color: gh.text,
  letterSpacing: "-0.02em",
});

/** Body text style */
export const ghBody = (size: number = s(16)): React.CSSProperties => ({
  fontFamily: ghFont.display,
  fontSize: size,
  fontWeight: ghWeight.regular,
  color: gh.textSecondary,
  lineHeight: 1.5,
});

/** Step number badge */
export const ghStepBadge = (accent: string): React.CSSProperties => ({
  width: s(32),
  height: s(32),
  borderRadius: "50%",
  background: accent,
  color: gh.textOnAccent,
  fontFamily: ghFont.display,
  fontSize: s(16),
  fontWeight: ghWeight.bold,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});

/** Progress bar container */
export const ghProgressTrack: React.CSSProperties = {
  width: "100%",
  height: s(8),
  borderRadius: ghRadius.full,
  background: gh.bgInset,
  border: `1px solid ${gh.borderMuted}`,
  overflow: "hidden",
};
