# Repository Guidelines

## Project Structure & Module Organization
- This repository is a collection of tutorial resources. Each episode lives in its own top-level folder (e.g., `notebooklm/`, `02-podcast-downloader/`, `03-disk-cleaner/`).
- Episode folders typically contain `prompt/`, `artifact/`, and `transcript/` (or `transript/`) for public assets. Production directories like `downloads/`, `recording/`, `output/`, `capcut/`, and `aigc/` are intentionally ignored.
- `software/` documents local tooling and installers. Only `software/README.md` is tracked.

## Build, Test, and Development Commands
- There is no repo-wide build or test system.
- For the podcast downloader skill, run the script directly:
  ```bash
  python 02-podcast-downloader/skills/podcast-downloader/scripts/download_podcast.py "<Apple Podcasts URL>" -n 3
  ```
- When adding new scripts, document exact usage in the relevant episode `README.md`.

## Coding Style & Naming Conventions
- Content is primarily Markdown; keep headings concise and match the existing bilingual tone (Chinese + English where appropriate).
- Preserve existing naming patterns, including Chinese filenames and spaced titles, to avoid breaking references.
- Use clear directory names for new episodes (e.g., `04-new-topic/`).

## Testing Guidelines
- No formal test framework is defined.
- If you introduce code, include a minimal manual verification step in the episode README (command + expected outcome).

## Commit & Pull Request Guidelines
- Recent history uses short, imperative subjects like “Add …” or “Update …”. Follow this style.
- PRs should include: purpose summary, list of new/updated assets, and any required links (video pages, issue references).
- If the change adds visual assets (slides, infographics), include a screenshot or PDF preview in the PR description.

## Assets, Privacy, and Large Files
- Large binaries and media are excluded by `.gitignore` (e.g., `software/*.dmg`, `notebooklm/output/`, `*/recording/`). Keep raw media local.
- Store shareable outputs under `artifact/` and prompts under `prompt/` so they can be reviewed and versioned.

## Agent-Specific Notes
- This repo is content-first. Prefer updating Markdown and artifacts over introducing new tooling unless the episode explicitly requires it.
