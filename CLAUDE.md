# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

A tutorial resources repository for video production, containing materials for educational videos about AI tools and workflows. Content is primarily Markdown with some Python utility scripts.

## Project Structure

- **Episode folders**: `notebooklm/`, `02-podcast-downloader/`, `03-disk-cleaner/`, etc.
  - Each episode has: `prompt/`, `artifact/`, `skills/`, `transript/` (tracked)
  - Production directories are gitignored: `downloads/`, `recording/`, `output/`, `capcut/`, `aigc/`, `sample/`
  - EP03 also has `remotion-achievement/` — Remotion project with 29 animation scenes (gitignored by default, source committed via `git add -f`)
- **infographic/**: Generated infographics (text assets tracked, images gitignored)
- **software/**: Local tooling documentation (only README.md tracked)
- **`.agents/skills/`**: Shared Claude Skills for content generation (infographics, slides, etc.)

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

### Podcast Downloader Script
```bash
# Install dependencies
pip install requests feedparser

# Download specific episode (with ?i= parameter)
python 02-podcast-downloader/skills/podcast-downloader/scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id1711052890?i=1000744375610"

# Download latest N episodes
python 02-podcast-downloader/skills/podcast-downloader/scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id1711052890" -n 5

# Specify output directory
python 02-podcast-downloader/skills/podcast-downloader/scripts/download_podcast.py "URL" -n 10 -o /path/to/output
```

### Other Utility Scripts
- `02-podcast-downloader/skills/youtube-downloader/scripts/download_video.py` - Download videos via yt-dlp
- `02-podcast-downloader/skills/pdf-to-images/scripts/pdf_to_images.py` - Convert PDF to images
- `03-disk-cleaner/scripts/mole_cleaner.py` - Disk cleanup utility

## Remotion Design System ("Anthropic Editorial")

EP03 animations live in `03-disk-cleaner/remotion-achievement/src/`. All scene components share a unified design system:

- **Theme**: `src/lib/theme.ts` — exports `color`, `font`, `fontWeight`, `gradient`, `shadow`, `radius`, `cardStyle()`, `iconBadge()`, `noiseOverlay`, and `s()` scaling helper
- **Scale factor**: `SCALE = 1.4` — all pixel values go through `s(px)` to ensure consistent sizing at 1920×1080
- **Standard scene structure**: `AbsoluteFill > gradient.sceneBg > noiseOverlay > content > fade to color.black`
- **Animation patterns**: `interpolate` for opacity/transform, `spring` for entrance, `Easing.out(Easing.cubic)` for slides
- **Colors**: Use `color.bg` / `color.text` / `color.terracotta` etc. from theme, never hardcode hex values
- **Fade out**: Always fade to `color.black` (not hardcoded `"#131314"`)

### Git note for Remotion source

The `**/remotion-*/` pattern in `.gitignore` excludes the entire directory. To commit source files, use `git add -f`:

```bash
git add -f 03-disk-cleaner/remotion-achievement/src/*.tsx
git add -f 03-disk-cleaner/remotion-achievement/src/lib/*.ts
```

## Content Guidelines

- Maintain bilingual tone (Chinese + English) where appropriate
- Preserve existing naming patterns including Chinese filenames
- New episodes follow pattern `04-new-topic/`, `05-new-topic/`, etc.
- Store shareable outputs under `artifact/` and prompts under `prompt/`
- Keep raw media files local (not committed)

## Visual Style / 频道视觉调性

### 首选风格：Anthropic 编辑风（用于信息图、视频内插图、社交媒体图）

参考 anthropic.com 品牌设计语言 + `frontend-design` skill，优先用 HTML/CSS 渲染再截图，确保字体精确可控。

- **配色**：深岩色 `#131314` + 奶白 `#faf9f0` + 赤陶橙 `#d97757` 作为唯一强调色
- **背景**：奶白/暖白为主，大量留白，负空间叙事
- **中文字体**：Noto Serif SC（思源宋体）— 有笔锋质感，用于标题和关键词
- **英文字体**：Playfair Display（标题/品牌名）+ Crimson Pro（正文）— 经典衬线体组合
- **装饰**：极简几何、微妙线条、角标、渐变分割线，无霓虹无渐变轰炸
- **情绪**：温暖、人文、克制的优雅 — 接近高端家居/建筑杂志
- **视频适配**：字体需放大（标题 ≥72px、行标题 ≥36px、正文 ≥22px），画布 1920×1080，2x 视网膜渲染
- **实现方式**：HTML → Chrome headless 截图（`--device-scale-factor=2`），产出 3840×2160 实际分辨率
- **参考文件**：`infographic/mac-disk-cleaner-guide/output/claude-code-vs-web-anthropic.html`

### 备选风格：赛博朋克风（用于视频封面/缩略图）

参考 `notebooklm/sample/cover4-3.jpg`，适合 YouTube/B站缩略图等需要冲击力的场景：

- **背景**：深色系（深蓝/深灰/黑），搭配速度光线、粒子或赛博朋克光效
- **配色**：高对比度 — 橙红色用于关键数据，霓虹蓝用于工具名，白色用于主文字
- **字体**：粗黑体，大号冲击力排版
- **文案语气**：口语化、挑衅式、游戏攻略感 — "干掉"、"通关"、"翻车"、"挑战"
- **叙事感**：关卡/闯关隐喻，带进度感和悬念感
- **产品 Logo**：直接放置工具 logo（Claude、Gemini、NotebookLM 等）增加辨识度
- **核心气质**：热血科技攻略博主
- **实现方式**：nano-banana-pro AI 生图（2K 分辨率）

## Commit Style

Use short, imperative subjects: "Add ...", "Update ...", "Fix ..."
