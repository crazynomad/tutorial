# Podcast Downloader - API Reference

Complete reference documentation for the Apple iTunes Search API and helper script.

## Table of Contents

1. [iTunes Search API](#itunes-search-api)
2. [Helper Script Reference](#helper-script-reference)
3. [Data Structures](#data-structures)
4. [Error Codes](#error-codes)
5. [Performance Guidelines](#performance-guidelines)

---

## iTunes Search API

### Base URL
```
https://itunes.apple.com
```

### Endpoints

#### 1. Search Endpoint

**URL**: `/search`

**Method**: GET

**Purpose**: Search for podcasts or episodes by keyword

**Parameters**:

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `term` | Yes | string | - | Search keyword (URL encoded) |
| `entity` | No | string | `all` | Search type: `podcast`, `podcastEpisode` |
| `limit` | No | integer | 50 | Number of results (max: 200) |
| `country` | No | string | `US` | Country code (US, CN, GB, etc.) |
| `lang` | No | string | `en_us` | Language code |
| `explicit` | No | string | - | Filter explicit content: `Yes`, `No` |

**Example Request**:
```
https://itunes.apple.com/search?term=python+programming&entity=podcast&limit=10
```

**Response Structure**:
```json
{
  "resultCount": 10,
  "results": [
    {
      "wrapperType": "track",
      "kind": "podcast",
      "collectionId": 979020229,
      "trackId": 979020229,
      "artistName": "Michael Kennedy",
      "collectionName": "Talk Python To Me",
      "trackName": "Talk Python To Me",
      "feedUrl": "https://talkpython.fm/episodes/rss",
      "trackCount": 445,
      "artworkUrl600": "https://...",
      "primaryGenreName": "Technology",
      "genres": ["Technology", "Podcasts"]
    }
  ]
}
```

---

#### 2. Lookup Endpoint

**URL**: `/lookup`

**Method**: GET

**Purpose**: Get specific podcast details or episode list by ID

**Parameters**:

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `id` | Yes | integer | - | Collection ID or Track ID |
| `entity` | No | string | - | Return type: `podcast`, `podcastEpisode` |
| `limit` | No | integer | 50 | Number of episodes to return |

**Example Request**:
```
https://itunes.apple.com/lookup?id=979020229&entity=podcastEpisode&limit=10
```

**Response Structure**:
```json
{
  "resultCount": 11,
  "results": [
    {
      "wrapperType": "track",
      "kind": "podcast",
      "collectionId": 979020229,
      "...": "podcast details"
    },
    {
      "wrapperType": "podcastEpisode",
      "kind": "podcast-episode",
      "trackId": 1000742770142,
      "trackName": "Episode Title",
      "releaseDate": "2025-12-26T10:45:00Z",
      "trackTimeMillis": 1247000,
      "episodeUrl": "https://...",
      "episodeFileExtension": "mp3",
      "description": "Full description",
      "shortDescription": "Brief description"
    }
  ]
}
```

**Note**: First result is always the podcast itself, subsequent results are episodes.

---

## Helper Script Reference

### Installation

No installation required. Uses Python 3 standard library only.

### Usage

```bash
python3 scripts/itunes_api.py <command> [arguments]
```

### Commands

#### search

Search for podcasts by keyword.

**Syntax**:
```bash
python3 scripts/itunes_api.py search <keyword> [limit]
```

**Arguments**:
- `keyword` (required): Search term
- `limit` (optional): Number of results, default: 10, max: 200

**Output**: JSON array to stdout, progress to stderr

**Example**:
```bash
python3 scripts/itunes_api.py search "python programming" 5
```

**Output Format**:
```json
[
  {
    "collectionId": 979020229,
    "collectionName": "Talk Python To Me",
    "artistName": "Michael Kennedy",
    "trackCount": 445,
    "feedUrl": "https://talkpython.fm/episodes/rss",
    "genres": ["Technology", "Podcasts"]
  }
]
```

---

#### episodes

Get episode list for a podcast.

**Syntax**:
```bash
python3 scripts/itunes_api.py episodes <collection_id> [limit]
```

**Arguments**:
- `collection_id` (required): Podcast ID from search results
- `limit` (optional): Number of episodes, default: 10, max: 100*

**Output**: JSON array to stdout, progress to stderr

**Example**:
```bash
python3 scripts/itunes_api.py episodes 979020229 10
```

**Output Format**:
```json
[
  {
    "trackId": 1000742770142,
    "trackName": "Episode Title",
    "releaseDate": "2025-12-26T10:45:00Z",
    "trackTimeMillis": 1247000,
    "episodeUrl": "https://...",
    "collectionName": "Talk Python To Me",
    "description": "Full description",
    "shortDescription": "Brief description"
  }
]
```

*Note: iTunes API has a practical limit around 100 episodes per request.

---

#### download

Download a podcast episode.

**Syntax**:
```bash
python3 scripts/itunes_api.py download <collection_id> <episode_index> [output_dir]
```

**Arguments**:
- `collection_id` (required): Podcast ID
- `episode_index` (required): 0-based index from episode list
- `output_dir` (optional): Download directory, default: `downloads/podcasts`

**Output**: JSON result to stdout, progress to stderr

**Example**:
```bash
python3 scripts/itunes_api.py download 979020229 0 ~/Downloads
```

**Output Format** (Success):
```json
{
  "success": true,
  "path": "/Users/username/Downloads/Talk Python To Me/Talk Python To Me - Episode Title.mp3",
  "episode": "Episode Title",
  "podcast": "Talk Python To Me"
}
```

**Output Format** (Error):
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Data Structures

### Podcast Object

Complete podcast metadata from iTunes API.

```typescript
interface Podcast {
  // Identification
  wrapperType: "track"
  kind: "podcast"
  collectionId: number          // Unique podcast ID
  trackId: number               // Same as collectionId
  artistId: number              // Publisher/creator ID

  // Names and URLs
  artistName: string            // Publisher name
  collectionName: string        // Podcast name
  trackName: string             // Same as collectionName
  artistViewUrl: string         // Publisher's page
  collectionViewUrl: string     // Podcast page on Apple Podcasts
  feedUrl: string               // RSS feed URL

  // Artwork
  artworkUrl30: string          // 30x30px thumbnail
  artworkUrl60: string          // 60x60px thumbnail
  artworkUrl100: string         // 100x100px thumbnail
  artworkUrl600: string         // 600x600px cover art

  // Metadata
  trackCount: number            // Total number of episodes
  primaryGenreName: string      // Main genre
  genres: string[]              // All genres
  releaseDate: string           // Latest episode date (ISO 8601)
  country: string               // Country code
  currency: string              // Currency code

  // Ratings
  collectionExplicitness: "notExplicit" | "explicit" | "cleaned"
  contentAdvisoryRating: string // Rating (e.g., "Clean")

  // Pricing
  collectionPrice: number       // Usually 0 (free)
  trackPrice: number            // Usually 0 (free)
}
```

---

### Episode Object

Complete episode metadata from iTunes API.

```typescript
interface Episode {
  // Identification
  wrapperType: "podcastEpisode"
  kind: "podcast-episode"
  trackId: number               // Unique episode ID
  collectionId: number          // Parent podcast ID
  episodeGuid: string           // Episode GUID from RSS

  // Names
  trackName: string             // Episode title
  collectionName: string        // Podcast name
  artistIds: number[]           // Creator IDs

  // URLs
  trackViewUrl: string          // Episode page on Apple Podcasts
  collectionViewUrl: string     // Podcast page
  episodeUrl: string            // ⭐ Direct audio file URL
  feedUrl: string               // Podcast RSS feed

  // Audio info
  episodeFileExtension: "mp3"   // File format
  episodeContentType: "audio"   // Content type

  // Artwork
  artworkUrl60: string
  artworkUrl160: string
  artworkUrl600: string

  // Metadata
  releaseDate: string           // ISO 8601 date
  trackTimeMillis: number       // Duration in milliseconds
  description: string           // Full HTML description
  shortDescription: string      // Plain text summary

  // Ratings
  contentAdvisoryRating: string
  closedCaptioning: "none" | "available"

  // Categories
  genres: Array<{
    name: string
    id: string
  }>
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning | Handling |
|------|---------|----------|
| 200 | Success | Parse JSON response |
| 302 | Redirect | Follow redirect (automatic) |
| 400 | Bad Request | Check parameters |
| 403 | Forbidden | Check terms of service compliance |
| 404 | Not Found | Invalid ID or deleted content |
| 429 | Too Many Requests | Implement rate limiting |
| 500 | Server Error | Retry with exponential backoff |
| 503 | Service Unavailable | Retry later |

### Script Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (see stderr for details) |

---

## Performance Guidelines

### Rate Limiting

**iTunes API**:
- No official rate limit published
- Recommended: Max 20 requests per second
- Implement exponential backoff on errors

**Best Practices**:
```python
import time

def with_rate_limit(func):
    """Decorator to rate limit API calls"""
    last_call = [0]

    def wrapper(*args, **kwargs):
        now = time.time()
        time_since_last = now - last_call[0]

        if time_since_last < 0.05:  # 20 req/sec = 0.05s between
            time.sleep(0.05 - time_since_last)

        result = func(*args, **kwargs)
        last_call[0] = time.time()
        return result

    return wrapper
```

---

### Caching Strategy

**Search Results**:
- Cache duration: 1 hour
- Key: `search:{term}:{limit}`
- Invalidate: Manual or on error

**Episode Lists**:
- Cache duration: 15 minutes
- Key: `episodes:{collection_id}:{limit}`
- Invalidate: On new episode detection

**Example Implementation**:
```python
import json
import time
from pathlib import Path

class SimpleCache:
    def __init__(self, cache_dir=".cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)

    def get(self, key, max_age=3600):
        cache_file = self.cache_dir / f"{key}.json"

        if not cache_file.exists():
            return None

        # Check age
        age = time.time() - cache_file.stat().st_mtime
        if age > max_age:
            return None

        with open(cache_file) as f:
            return json.load(f)

    def set(self, key, data):
        cache_file = self.cache_dir / f"{key}.json"
        with open(cache_file, 'w') as f:
            json.dump(data, f)
```

---

### Download Optimization

**Parallel Downloads**:
```python
from concurrent.futures import ThreadPoolExecutor

def download_multiple(episodes, max_workers=3):
    """Download multiple episodes in parallel"""
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(download_episode, ep)
            for ep in episodes
        ]

        for future in futures:
            try:
                result = future.result()
                print(f"Downloaded: {result}")
            except Exception as e:
                print(f"Error: {e}")
```

**Recommendations**:
- Max 3 concurrent downloads
- Use streaming for large files
- Show progress for downloads >10MB
- Implement resume capability for failed downloads

---

### Memory Management

**Large Episode Lists**:
```python
def get_all_episodes(collection_id):
    """Get all episodes using pagination"""
    episodes = []
    batch_size = 100
    offset = 0

    while True:
        batch = get_episodes(collection_id, limit=batch_size, offset=offset)

        if not batch:
            break

        episodes.extend(batch)
        offset += batch_size

        # Prevent infinite loop
        if len(batch) < batch_size:
            break

    return episodes
```

---

## Advanced Usage

### Using RSS Feeds Directly

For getting ALL episodes (not limited by API):

```python
import xml.etree.ElementTree as ET
from urllib.request import urlopen

def get_all_episodes_from_rss(feed_url):
    """Parse RSS feed to get all episodes"""
    response = urlopen(feed_url)
    xml_data = response.read()

    root = ET.fromstring(xml_data)
    episodes = []

    for item in root.findall('.//item'):
        episode = {
            'title': item.find('title').text,
            'description': item.find('description').text,
            'pub_date': item.find('pubDate').text,
            'audio_url': item.find('enclosure').get('url'),
            'duration': item.find('{http://www.itunes.com/dtds/podcast-1.0.dtd}duration').text
        }
        episodes.append(episode)

    return episodes
```

---

### Filtering and Sorting

```python
def filter_episodes(episodes, **criteria):
    """Filter episodes by criteria"""
    filtered = episodes

    # Filter by date range
    if 'after' in criteria:
        after = criteria['after']
        filtered = [e for e in filtered if e['releaseDate'] >= after]

    if 'before' in criteria:
        before = criteria['before']
        filtered = [e for e in filtered if e['releaseDate'] <= before]

    # Filter by duration
    if 'min_duration' in criteria:
        min_dur = criteria['min_duration']
        filtered = [e for e in filtered if e.get('trackTimeMillis', 0) >= min_dur]

    if 'max_duration' in criteria:
        max_dur = criteria['max_duration']
        filtered = [e for e in filtered if e.get('trackTimeMillis', 0) <= max_dur]

    return filtered

# Usage
recent_short_episodes = filter_episodes(
    episodes,
    after='2025-12-01T00:00:00Z',
    max_duration=30 * 60 * 1000  # 30 minutes in milliseconds
)
```

---

## Troubleshooting

### Common Issues

**Issue**: API returns empty results
**Causes**:
- Search term too specific
- Content not available in specified country
- Podcast removed from Apple Podcasts

**Solutions**:
- Broaden search terms
- Try different country codes
- Search with artist name instead

---

**Issue**: Download fails with 403/404
**Causes**:
- Episode removed or moved
- CDN link expired
- Geo-restrictions

**Solutions**:
- Re-fetch episode list to get fresh URL
- Try different network/VPN
- Contact podcast publisher

---

**Issue**: Slow downloads
**Causes**:
- Network congestion
- CDN routing
- Large file size

**Solutions**:
- Use parallel downloads (limit 3)
- Download during off-peak hours
- Implement resume capability

---

## API Limits and Quotas

| Resource | Limit | Notes |
|----------|-------|-------|
| Search results | 200 per request | Use pagination for more |
| Episode list | ~100 per request | Use RSS for full list |
| Request rate | ~20/second (unofficial) | Implement rate limiting |
| File size | No limit | Typical: 20-200 MB |

---

## Legal and Terms of Service

- iTunes Search API is provided by Apple Inc.
- Content accessed through API is subject to copyright
- Downloaded content for personal use only
- Respect publisher rights and terms
- See: [Apple Developer Terms](https://developer.apple.com/terms/)

---

**Last Updated**: 2025-12-27
**API Version**: iTunes Search API v2
**Helper Script Version**: 1.0.0
