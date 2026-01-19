---
name: podcast-downloader
description: Download podcasts from Apple Podcasts (via RSS feed). Use when the user wants to download specific episodes or the latest N episodes from a podcast. Supports downloading audio files, metadata, and show notes. Triggers include "download podcast", "download episode", "get podcast audio", "download latest episodes", or when user provides an Apple Podcasts RSS feed URL.
---

# Podcast Downloader

Download podcasts from Apple Podcasts via RSS feed. Supports downloading specific episodes or the latest N episodes with metadata.

## Quick Start

Install required dependencies first:

```bash
pip install feedparser requests --break-system-packages
```

## Usage

The `scripts/download_podcast.py` script provides three main use cases:

### 1. Download Latest N Episodes

```bash
python scripts/download_podcast.py "RSS_FEED_URL" -n 5 -o /mnt/user-data/outputs
```

Downloads the latest 5 episodes to the outputs directory.

### 2. Download Specific Episode

```bash
python scripts/download_podcast.py "RSS_FEED_URL" -e 3 -o /mnt/user-data/outputs
```

Downloads episode #3 (episodes are numbered starting from 1, with 1 being the latest).

### 3. Download All Episodes

```bash
python scripts/download_podcast.py "RSS_FEED_URL" -o /mnt/user-data/outputs
```

Downloads all available episodes.

## Output Structure

The script creates a directory structure like:

```
[Podcast Name]/
├── podcast_info.json          # Podcast metadata
├── 001 - Episode Title.mp3    # Audio file
├── 001 - Episode Title.json   # Episode metadata
├── 002 - Episode Title.mp3
├── 002 - Episode Title.json
└── ...
```

## Getting RSS Feed URL

Most users won't have the RSS feed URL readily available. See `references/get_rss_feed.md` for detailed instructions on how to obtain the RSS feed URL from Apple Podcasts.

**Quick method:**
1. Find the podcast in Apple Podcasts web or app
2. Copy the podcast page URL (e.g., `https://podcasts.apple.com/us/podcast/name/id1234567890`)
3. Extract the ID number from the URL
4. Use Apple's lookup API: `https://podcasts.apple.com/lookup?id=1234567890&entity=podcast`
5. Find the `feedUrl` field in the JSON response

## Common User Requests

When users make requests like:
- "Download the latest episode of [podcast name]"
- "Get me the last 10 episodes of [podcast]"
- "Download episode 5 from [podcast]"

Follow this workflow:
1. Ask for the Apple Podcasts link or RSS feed URL if not provided
2. If given an Apple Podcasts link, help extract the RSS feed URL using the methods in `references/get_rss_feed.md`
3. Run the download script with appropriate parameters
4. Move downloaded files to `/mnt/user-data/outputs` for user access

## Error Handling

- If RSS feed URL is invalid, the script will report parsing errors
- If episode index is out of range, the script will show valid range
- Network errors during download are caught and reported
- Invalid characters in filenames are automatically sanitized
