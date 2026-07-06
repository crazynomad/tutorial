---
name: podcast-downloader
description: Search and download podcast episodes from Apple Podcasts. Use when user wants to find podcasts, download podcast episodes, get podcast information, or mentions Apple Podcasts, iTunes, podcast search, or audio downloads.
allowed-tools: Bash(python3:*), Bash(curl:*), Read, Write
---

# Apple Podcast Downloader

A comprehensive skill for searching, browsing, and downloading podcast episodes from Apple Podcasts using the iTunes Search API.

## Core Capabilities

1. **Search Podcasts** - Find podcasts by keyword, author, or topic
2. **Browse Episodes** - List episodes from a specific podcast
3. **Download Audio** - Download podcast episodes as MP3 files
4. **Get Metadata** - Retrieve detailed information about podcasts and episodes

## Quick Start

### Search for Podcasts

When user asks to search for podcasts:

1. Use the helper script to search:
```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "keyword" [limit]
```

2. Display results in a clear table format showing:
   - Podcast name
   - Author/Publisher
   - Total episodes
   - Genres
   - Collection ID (for downloading episodes)

### List Episodes

When user wants to see episodes from a podcast:

1. Get the collection ID from search results
2. Fetch episodes:
```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes <collection_id> [limit]
```

3. Show episode list with:
   - Episode title
   - Release date
   - Duration
   - Short description
   - Episode index number (for downloading)

### Download Episodes

When user wants to download podcast audio:

1. Ensure download directory exists:
```bash
mkdir -p downloads/podcasts
```

2. Download using the helper script:
```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download <collection_id> <episode_index> [output_path]
```

3. Confirm download completion with file size and location

## Workflow Examples

### Example 1: Search and Download Latest Episode

**User Request**: "Download the latest episode of The Daily podcast"

**Steps**:
1. Search for "The Daily"
2. Get the collection ID from results
3. Fetch episodes (limit 1)
4. Download the first episode
5. Confirm completion

### Example 2: Browse and Select

**User Request**: "Show me the latest 10 episodes of Python Bytes and let me choose which to download"

**Steps**:
1. Search for "Python Bytes"
2. Get collection ID
3. Fetch 10 latest episodes
4. Display numbered list
5. Wait for user selection
6. Download selected episode(s)

### Example 3: Batch Download

**User Request**: "Download the 5 latest episodes from All-In Podcast"

**Steps**:
1. Search for "All-In Podcast"
2. Get collection ID
3. Fetch 5 latest episodes
4. Download each episode sequentially
5. Report progress and completion

## Best Practices

### User Experience

1. **Always confirm before downloading** - Show episode details and ask for confirmation
2. **Display progress** - Show download progress and estimated time
3. **Handle errors gracefully** - Provide clear error messages and suggestions
4. **Organize downloads** - Create organized directory structure (e.g., `downloads/podcasts/podcast-name/`)

### Error Handling

Common errors and solutions:

- **No results found**: Suggest alternative search terms
- **Invalid collection ID**: Verify the ID or re-search
- **Download failed**: Check network connection, retry with error details
- **File exists**: Ask user whether to overwrite or skip

### Performance

- **Limit search results**: Default to 10 results, max 50
- **Batch downloads**: Use sequential downloads to avoid overwhelming the API
- **Cache metadata**: Reuse search results within the same conversation

## Command Reference

### Search Command
```bash
python3 scripts/itunes_api.py search <keyword> [limit]
```
**Parameters**:
- `keyword`: Search term (required)
- `limit`: Number of results (optional, default: 10)

**Output**: JSON array of podcast objects

### Episodes Command
```bash
python3 scripts/itunes_api.py episodes <collection_id> [limit]
```
**Parameters**:
- `collection_id`: Podcast ID from search results (required)
- `limit`: Number of episodes (optional, default: 10)

**Output**: JSON array of episode objects

### Download Command
```bash
python3 scripts/itunes_api.py download <collection_id> <episode_index> [output_path]
```
**Parameters**:
- `collection_id`: Podcast ID (required)
- `episode_index`: Episode number from list (0-based) (required)
- `output_path`: Save location (optional, default: downloads/podcasts/)

**Output**: Downloaded MP3 file path

## Data Structures

### Podcast Object
```json
{
  "collectionId": 1200361736,
  "collectionName": "The Daily",
  "artistName": "The New York Times",
  "trackCount": 2464,
  "feedUrl": "https://feeds.simplecast.com/...",
  "genres": ["Daily News", "Podcasts", "News"]
}
```

### Episode Object
```json
{
  "trackId": 1000742770142,
  "trackName": "Episode Title",
  "releaseDate": "2025-12-26T10:45:00Z",
  "trackTimeMillis": 1247000,
  "episodeUrl": "https://...",
  "description": "Full description...",
  "shortDescription": "Brief description..."
}
```

## Advanced Features

### RSS Feed Access

Podcasts include RSS feed URLs that can be used for:
- Getting ALL episodes (not limited by API)
- Subscribing in podcast apps
- Accessing additional metadata

Access via `feedUrl` field in search results.

### Metadata Extraction

Extract rich metadata including:
- Artwork (multiple resolutions: 30px, 60px, 100px, 600px)
- Genres and categories
- Explicit content ratings
- Publisher information
- Episode descriptions

### Filtering and Sorting

When displaying results, consider:
- Sorting by release date (newest first)
- Filtering by duration
- Grouping by genre
- Showing only recent episodes (e.g., last 30 days)

## Troubleshooting

### Common Issues

**Issue**: "curl: command not found"
**Solution**: Install curl or use Python's requests library

**Issue**: "Invalid JSON response"
**Solution**: Check network connection and API availability

**Issue**: "Permission denied" when saving files
**Solution**: Check directory permissions or use different output path

**Issue**: "File too large"
**Solution**: Check available disk space, typical episodes are 20-100MB

## Additional Resources

- For detailed API documentation, see [reference.md](reference.md)
- For more usage examples, see [examples.md](examples.md)
- Helper script source: `scripts/itunes_api.py`

## Notes

- This skill uses the free Apple iTunes Search API (no authentication required)
- Audio files are downloaded directly from podcast CDNs
- Supports all podcasts available on Apple Podcasts
- Download speeds depend on network connection and CDN performance
