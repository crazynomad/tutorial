# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Public companion repository for EP03 (Mac Disk Cleaner) — a tutorial video about using Claude Code for non-coders. Contains guides, the Mole disk cleanup script, and Remotion animation source code.

## Project Structure

- `03-disk-cleaner/` — EP03 content
  - `README.md` — Episode overview
  - `DEMO_MODE_GUIDE.md` — Demo mode instructions
  - `claude-code-for-non-coder.md` — Non-coder guide
  - `GUIDES/` — Setup guides (Claude Code install, etc.)
  - `scripts/mole_cleaner.py` — Disk cleanup utility
  - `remotion-achievement/src/` — Remotion animation scenes (29 components)

## Development Commands

### Remotion (EP03 Video Animations)

```bash
cd 03-disk-cleaner/remotion-achievement

# Preview in browser
npx remotion studio

# Render a single composition to MP4
npx remotion render <CompositionId> --output out/<name>.mp4

# Render a still frame (for preview/debugging)
npx remotion still <CompositionId> --frame=150 --output out/<name>.png

# Type-check
npx tsc --noEmit
```

Compositions are registered in `src/Root.tsx`. Each `.tsx` file in `src/` is a self-contained scene component.

## Remotion Design System ("Anthropic Editorial")

EP03 animations live in `03-disk-cleaner/remotion-achievement/src/`. All scene components share a unified design system:

- **Theme**: `src/lib/theme.ts` — exports `color`, `font`, `fontWeight`, `gradient`, `shadow`, `radius`, `cardStyle()`, `iconBadge()`, `noiseOverlay`, and `s()` scaling helper
- **Scale factor**: `SCALE = 1.4` — all pixel values go through `s(px)` to ensure consistent sizing at 1920×1080
- **Standard scene structure**: `AbsoluteFill > gradient.sceneBg > noiseOverlay > content > fade to color.black`
- **Animation patterns**: `interpolate` for opacity/transform, `spring` for entrance, `Easing.out(Easing.cubic)` for slides
- **Colors**: Use `color.bg` / `color.text` / `color.terracotta` etc. from theme, never hardcode hex values
- **Fade out**: Always fade to `color.black` (not hardcoded `"#131314"`)

## Commit Style

Use short, imperative subjects: "Add ...", "Update ...", "Fix ..."
