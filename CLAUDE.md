# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

A tutorial resources repository for video production, containing materials for educational videos about AI tools and workflows. Content is primarily Markdown with some Python utility scripts.

## Project Structure

- **Episode folders**: `notebooklm/`, `02-podcast-downloader/`, `03-disk-cleaner/`, etc.
  - Each episode has: `prompt/`, `artifact/`, `skills/`, `transript/` (tracked)
  - Production directories are gitignored: `downloads/`, `recording/`, `output/`, `capcut/`, `aigc/`, `sample/`
- **software/**: Local tooling documentation (only README.md tracked)
- **`.agents/skills/`**: Shared Claude Skills for content generation (infographics, slides, etc.)

## Development Commands

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

## Content Guidelines

- Maintain bilingual tone (Chinese + English) where appropriate
- Preserve existing naming patterns including Chinese filenames
- New episodes follow pattern `04-new-topic/`, `05-new-topic/`, etc.
- Store shareable outputs under `artifact/` and prompts under `prompt/`
- Keep raw media files local (not committed)

## Commit Style

Use short, imperative subjects: "Add ...", "Update ...", "Fix ..."
