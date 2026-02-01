/**
 * Unified Design System — "Anthropic Editorial"
 *
 * Aesthetic direction: warm, humanist, restrained elegance.
 * Cream canvas with deep charcoal text, terracotta orange as the sole
 * accent color, generous negative space. Serif typography-driven hierarchy.
 *
 * Font pairing:
 *   Display — Playfair Display + Noto Serif SC
 *   Body   — Crimson Pro + Noto Serif SC
 *   Mono   — SF Mono / Menlo
 */

// ── Colors ────────────────────────────────────────────────

export const color = {
  // Backgrounds
  bg: "#faf9f0",
  bgSubtle: "#f3f0e8",
  bgCard: "rgba(19,19,20,0.03)",
  bgCardHover: "rgba(19,19,20,0.06)",
  bgElevated: "rgba(19,19,20,0.05)",

  // Surfaces & Borders
  border: "rgba(19,19,20,0.08)",
  borderSubtle: "rgba(19,19,20,0.05)",
  borderAccent: "rgba(19,19,20,0.15)",
  divider: "rgba(19,19,20,0.10)",

  // Text
  text: "#131314",
  textSecondary: "#9c958b",
  textTertiary: "#b8b0a4",
  textInverse: "#faf9f0",

  // Semantic accents (desaturated, warm-toned)
  green: "#6b9e78",
  greenMuted: "#6b9e7820",
  red: "#c4665a",
  redMuted: "#c4665a18",
  blue: "#7a9bb5",
  blueMuted: "#7a9bb518",
  gold: "#c9a84c",
  goldMuted: "#c9a84c18",
  purple: "#9b8bb5",
  purpleMuted: "#9b8bb518",
  orange: "#d97757",
  orangeMuted: "#d9775718",

  // Named accents
  terracotta: "#d97757",
  cream: "#faf9f0",
  warmGray: "#9c958b",
  lightGray: "#e8e4db",

  // Special
  white: "#ffffff",
  black: "#131314",
} as const;

// ── Scale ─────────────────────────────────────────────────

/** Global scale factor — change this one number to resize all UI elements */
export const SCALE = 1.4;
export const s = (px: number) => Math.round(px * SCALE);

// ── Typography ────────────────────────────────────────────

export const font = {
  display:
    '"Playfair Display", "Noto Serif SC", "Source Han Serif SC", serif',
  body:
    '"Crimson Pro", "Noto Serif SC", "Source Han Serif SC", serif',
  mono: '"SF Mono", "Fira Code", Menlo, Consolas, monospace',
} as const;

export const fontSize = {
  /** Hero / impact numbers */
  hero: s(128),
  /** Section titles */
  display: s(64),
  /** Card titles */
  title: s(36),
  /** Subtitles & emphasis */
  subtitle: s(28),
  /** Body text */
  body: s(22),
  /** Captions & labels */
  caption: s(16),
  /** Small labels */
  micro: s(13),
};

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heavy: 800,
} as const;

// ── Spacing ───────────────────────────────────────────────

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
  xxxl: 96,
} as const;

// ── Radii ─────────────────────────────────────────────────

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

// ── Shadows ───────────────────────────────────────────────

export const shadow = {
  /** Subtle card elevation */
  card: "0 1px 3px rgba(19,19,20,0.06), 0 8px 24px rgba(19,19,20,0.04)",
  /** Elevated card */
  elevated:
    "0 2px 8px rgba(19,19,20,0.08), 0 16px 48px rgba(19,19,20,0.06)",
  /** Accent glow — use with template literal for color */
  glow: (c: string, intensity = 0.15) =>
    `0 0 20px ${c}${Math.round(intensity * 255)
      .toString(16)
      .padStart(2, "0")}, 0 0 48px ${c}${Math.round(intensity * 0.3 * 255)
      .toString(16)
      .padStart(2, "0")}`,
  /** Text glow */
  textGlow: (c: string, intensity = 0.2) =>
    `0 0 16px ${c}${Math.round(intensity * 255)
      .toString(16)
      .padStart(2, "0")}, 0 0 40px ${c}${Math.round(intensity * 0.2 * 255)
      .toString(16)
      .padStart(2, "0")}`,
} as const;

// ── Gradients ─────────────────────────────────────────────

export const gradient = {
  /** Default scene background — cream with subtle warm radial */
  sceneBg:
    "radial-gradient(ellipse 80% 60% at 50% 40%, #faf9f0 0%, #f3f0e8 100%)",
  /** Warm variant */
  sceneWarm:
    "radial-gradient(ellipse 80% 60% at 50% 40%, #faf9f0 0%, #efe9dc 100%)",
  /** Accent tinted card */
  cardTint: (c: string) =>
    `linear-gradient(145deg, ${c}08 0%, ${c}03 100%)`,
  /** Horizontal fade line */
  accentLine: (c: string) =>
    `linear-gradient(90deg, transparent, ${c}, transparent)`,
  /** Vertical divider */
  vertDivider:
    "linear-gradient(180deg, transparent, rgba(19,19,20,0.12), transparent)",
} as const;

// ── Style Factories ───────────────────────────────────────

/** Base text style with proper font stack */
export const textStyle = (
  size: number = fontSize.body,
  weight: number = fontWeight.medium,
  c: string = color.text,
): React.CSSProperties => ({
  fontFamily: font.display,
  fontSize: size,
  fontWeight: weight,
  color: c,
  letterSpacing: size >= fontSize.display ? "-0.03em" : "-0.01em",
});

/** Editorial card — light surface with subtle border */
export const cardStyle = (accent?: string): React.CSSProperties => ({
  background: accent ? gradient.cardTint(accent) : color.bgCard,
  borderRadius: radius.lg,
  border: `1px solid ${accent ? accent + "18" : color.border}`,
  boxShadow: accent
    ? `${shadow.card}, 0 0 30px ${accent}06`
    : shadow.card,
});

/** Icon badge — round colored indicator */
export const iconBadge = (
  accent: string,
  size = 56,
): React.CSSProperties => ({
  width: size,
  height: size,
  borderRadius: radius.full,
  background: `${accent}10`,
  border: `1.5px solid ${accent}25`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: Math.round(size * 0.48),
  flexShrink: 0,
});

/** Noise/grain overlay texture (very subtle for editorial feel) */
export const noiseOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.01,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize: "128px 128px",
  pointerEvents: "none",
};

/** Scene background wrapper styles */
export const sceneBg = (
  variant: "default" | "warm" = "default",
): React.CSSProperties => ({
  background:
    variant === "warm" ? gradient.sceneWarm : gradient.sceneBg,
});
