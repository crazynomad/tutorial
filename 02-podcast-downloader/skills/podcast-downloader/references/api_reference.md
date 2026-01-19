# API Reference - iTunes Search API for Podcasts

## Overview

The iTunes Search API provides programmatic access to Apple Podcasts metadata without requiring authentication. This document covers podcast-specific endpoints used by the downloader.

Official Documentation: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

## Base URL

```
https://itunes.apple.com/lookup
```

## Common Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Podcast or episode ID |
| `entity` | string | No | Type: `podcast`, `podcastEpisode` |
| `country` | string | No | 2-letter ISO code (default: `us`) |
| `limit` | number | No | Max results: 1-200 (default: 50) |

## Endpoints

### 1. Lookup Podcast Episode

**Purpose**: Get specific episode details by episode ID

**Request**:
```http
GET https://itunes.apple.com/lookup?id={episode_id}&entity=podcastEpisode&country={country}
```

**Example**:
```http
GET https://itunes.apple.com/lookup?id=1000744375610&entity=podcastEpisode&country=cn
```

**Response**:
```json
{
  "resultCount": 1,
  "results": [
    {
      "wrapperType": "podcastEpisode",
      "kind": "podcast-episode",
      "collectionId": 1711052890,
      "trackId": 1000744375610,
      "artistName": "XYZ.FM",
      "collectionName": "独树不成林",
      "trackName": "289-我在童年如何与权威周旋？",
      "collectionCensoredName": "独树不成林",
      "trackCensoredName": "289-我在童年如何与权威周旋？",
      "collectionViewUrl": "https://podcasts.apple.com/cn/podcast/...",
      "feedUrl": "https://feed.xyzfm.space/...",
      "trackViewUrl": "https://podcasts.apple.com/cn/podcast/...",
      "artworkUrl30": "https://is1-ssl.mzstatic.com/image/.../30x30bb.jpg",
      "artworkUrl60": "https://is1-ssl.mzstatic.com/image/.../60x60bb.jpg",
      "artworkUrl100": "https://is1-ssl.mzstatic.com/image/.../100x100bb.jpg",
      "collectionPrice": 0.00,
      "trackPrice": 0.00,
      "trackRentalPrice": 0,
      "collectionHdPrice": 0,
      "trackHdPrice": 0,
      "trackHdRentalPrice": 0,
      "releaseDate": "2025-01-10T00:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackCount": 272,
      "trackNumber": 289,
      "trackTimeMillis": 2415000,
      "country": "CHN",
      "currency": "CNY",
      "primaryGenreName": "Society & Culture",
      "contentAdvisoryRating": "Clean",
      "artworkUrl600": "https://is1-ssl.mzstatic.com/image/.../600x600bb.jpg",
      "genreIds": ["1324", "26"],
      "genres": ["Society & Culture", "Podcasts"],
      "episodeFileExtension": "m4a",
      "episodeContentType": "audio",
      "episodeUrl": "https://...",
      "closedCaptioning": "none",
      "collectionArtistId": 1711052890,
      "collectionArtistName": "XYZ.FM",
      "description": "在这期节目中..."
    }
  ]
}
```

**Key Fields**:
- `trackId`: Episode unique identifier
- `trackName`: Episode title
- `collectionName`: Podcast name
- `releaseDate`: Publication date (ISO 8601)
- `trackTimeMillis`: Duration in milliseconds
- `episodeUrl`: Direct audio file URL
- `description`: Episode description
- `episodeFileExtension`: File type (m4a, mp3)

### 2. Lookup Podcast with Episodes

**Purpose**: Get podcast info + list of recent episodes

**Request**:
```http
GET https://itunes.apple.com/lookup?id={podcast_id}&entity=podcastEpisode&country={country}&limit={limit}
```

**Example**:
```http
GET https://itunes.apple.com/lookup?id=1711052890&entity=podcastEpisode&country=cn&limit=200
```

**Response**:
```json
{
  "resultCount": 201,
  "results": [
    {
      "wrapperType": "track",
      "kind": "podcast",
      "collectionId": 1711052890,
      "trackId": 1711052890,
      "artistName": "XYZ.FM",
      "collectionName": "独树不成林",
      "trackName": "独树不成林",
      "collectionCensoredName": "独树不成林",
      "trackCensoredName": "独树不成林",
      "collectionViewUrl": "https://podcasts.apple.com/cn/podcast/...",
      "feedUrl": "https://feed.xyzfm.space/y9qnpfdrctnx",
      "trackViewUrl": "https://podcasts.apple.com/cn/podcast/...",
      "artworkUrl30": "https://is1-ssl.mzstatic.com/image/.../30x30bb.jpg",
      "artworkUrl60": "https://is1-ssl.mzstatic.com/image/.../60x60bb.jpg",
      "artworkUrl100": "https://is1-ssl.mzstatic.com/image/.../100x100bb.jpg",
      "collectionPrice": 0.00,
      "trackPrice": 0.00,
      "collectionHdPrice": 0,
      "releaseDate": "2025-01-10T00:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "trackCount": 272,
      "country": "CHN",
      "currency": "CNY",
      "primaryGenreName": "Society & Culture",
      "contentAdvisoryRating": "Clean",
      "artworkUrl600": "https://is1-ssl.mzstatic.com/image/.../600x600bb.jpg",
      "genreIds": ["1324", "26"],
      "genres": ["Society & Culture", "Podcasts"]
    },
    {
      "wrapperType": "podcastEpisode",
      "kind": "podcast-episode",
      "collectionId": 1711052890,
      "trackId": 1000744375610,
      "trackName": "289-我在童年如何与权威周旋？",
      ...
    },
    {
      "wrapperType": "podcastEpisode",
      "trackId": 1000743926153,
      "trackName": "288-在自我与外界之间建立纽带",
      ...
    },
    ...
  ]
}
```

**Response Structure**:
- First result (`wrapperType: "track"`): Podcast metadata
- Subsequent results (`wrapperType: "podcastEpisode"`): Episodes (up to limit)
- Sorted by release date (newest first)

### 3. Lookup Podcast Only

**Purpose**: Get podcast metadata including RSS feed URL

**Request**:
```http
GET https://itunes.apple.com/lookup?id={podcast_id}&entity=podcast&country={country}
```

**Example**:
```http
GET https://itunes.apple.com/lookup?id=1711052890&entity=podcast&country=cn
```

**Response**:
```json
{
  "resultCount": 1,
  "results": [
    {
      "wrapperType": "track",
      "kind": "podcast",
      "collectionId": 1711052890,
      "trackId": 1711052890,
      "artistName": "XYZ.FM",
      "collectionName": "独树不成林",
      "feedUrl": "https://feed.xyzfm.space/y9qnpfdrctnx",
      "trackCount": 272,
      "country": "CHN",
      "primaryGenreName": "Society & Culture",
      ...
    }
  ]
}
```

**Key Field**:
- `feedUrl`: RSS feed URL for podcast (used as fallback)

## Response Format

### Success Response

**Status**: 200 OK

**Content-Type**: application/json; charset=utf-8

**Structure**:
```json
{
  "resultCount": number,
  "results": [
    { /* result object */ },
    ...
  ]
}
```

### Error Responses

**Invalid ID (404)**:
```json
{
  "resultCount": 0,
  "results": []
}
```

**Rate Limit (429)**:
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

**Server Error (500)**:
```json
{
  "errorMessage": "Internal Server Error"
}
```

## Field Definitions

### Common Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `wrapperType` | string | Result type | `"track"`, `"podcastEpisode"` |
| `kind` | string | Content kind | `"podcast"`, `"podcast-episode"` |
| `artistName` | string | Podcast author | `"XYZ.FM"` |
| `collectionId` | number | Podcast ID | `1711052890` |
| `collectionName` | string | Podcast name | `"独树不成林"` |
| `trackId` | number | Episode/Podcast ID | `1000744375610` |
| `trackName` | string | Episode/Podcast name | `"289-我在童年..."` |
| `country` | string | ISO 3166-1 alpha-3 | `"CHN"`, `"USA"` |
| `primaryGenreName` | string | Main genre | `"Society & Culture"` |

### Episode-Specific Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `trackNumber` | number | Episode number | `289` |
| `releaseDate` | string | ISO 8601 datetime | `"2025-01-10T00:00:00Z"` |
| `trackTimeMillis` | number | Duration (ms) | `2415000` (40.25 min) |
| `episodeUrl` | string | Audio file URL | `"https://..."` |
| `episodeFileExtension` | string | File type | `"m4a"`, `"mp3"` |
| `episodeContentType` | string | Content type | `"audio"`, `"video"` |
| `description` | string | Episode description | Full HTML text |
| `closedCaptioning` | string | CC availability | `"none"`, `"available"` |

### Artwork URLs

All podcasts include artwork in multiple sizes:
- `artworkUrl30`: 30×30 pixels
- `artworkUrl60`: 60×60 pixels
- `artworkUrl100`: 100×100 pixels
- `artworkUrl600`: 600×600 pixels

**Format**: JPEG, hosted on `is1-ssl.mzstatic.com`

## Country Codes

### Supported Regions

| Code | Country | Example URL |
|------|---------|-------------|
| `us` | United States | `podcasts.apple.com/us/` |
| `cn` | China | `podcasts.apple.com/cn/` |
| `jp` | Japan | `podcasts.apple.com/jp/` |
| `uk` | United Kingdom | `podcasts.apple.com/uk/` |
| `ca` | Canada | `podcasts.apple.com/ca/` |
| `au` | Australia | `podcasts.apple.com/au/` |
| `de` | Germany | `podcasts.apple.com/de/` |
| `fr` | France | `podcasts.apple.com/fr/` |
| `kr` | South Korea | `podcasts.apple.com/kr/` |
| `in` | India | `podcasts.apple.com/in/` |
| `mx` | Mexico | `podcasts.apple.com/mx/` |
| `es` | Spain | `podcasts.apple.com/es/` |
| `it` | Italy | `podcasts.apple.com/it/` |
| `br` | Brazil | `podcasts.apple.com/br/` |

**Note**: Different regions may have different podcast availability.

## Rate Limiting

### Official Limits

Apple does not publish official rate limits for iTunes Search API.

### Recommended Practices

1. **Batch requests**: Combine multiple IDs when possible
2. **Cache responses**: Store results locally
3. **Respect 429**: Wait specified time in `Retry-After` header
4. **Reasonable rate**: <20 requests/second recommended
5. **User-Agent**: Always include valid User-Agent header

### Example Implementation

```python
import time
import requests

last_request_time = 0
MIN_INTERVAL = 0.05  # 50ms between requests (20 req/s max)

def rate_limited_request(url):
    global last_request_time
    elapsed = time.time() - last_request_time
    if elapsed < MIN_INTERVAL:
        time.sleep(MIN_INTERVAL - elapsed)
    
    response = requests.get(url)
    last_request_time = time.time()
    return response
```

## Best Practices

### 1. Always Include User-Agent

```python
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}
response = requests.get(url, headers=headers)
```

### 2. Handle Empty Results

```python
data = response.json()
if data.get('resultCount', 0) == 0:
    print("No results found")
    return None
```

### 3. Validate Response Structure

```python
results = data.get('results', [])
if not results:
    return None

first_result = results[0]
if first_result.get('wrapperType') != 'podcastEpisode':
    print("Unexpected result type")
```

### 4. Parse Dates Properly

```python
from datetime import datetime

release_str = episode.get('releaseDate', '')
if release_str:
    release_date = datetime.fromisoformat(release_str.replace('Z', '+00:00'))
```

### 5. Handle Audio URLs

```python
# Priority order
audio_url = (
    episode.get('episodeUrl') or
    episode.get('previewUrl') or
    None
)

if not audio_url:
    print("No audio URL available")
```

## Comparison with RSS Feeds

| Feature | iTunes API | RSS Feed |
|---------|------------|----------|
| Speed | Fast (JSON) | Slower (XML) |
| Parsing | Native Python | Requires feedparser |
| Episode Limit | 200 max | No limit |
| Metadata Quality | Standardized | Varies by feed |
| Availability | High | Variable |
| Authentication | None | Sometimes required |

## Error Handling

### Network Errors

```python
try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.ConnectionError:
    print("Connection failed")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e.response.status_code}")
```

### Response Validation

```python
try:
    data = response.json()
except ValueError:
    print("Invalid JSON response")
    return None

if 'resultCount' not in data:
    print("Unexpected response format")
    return None
```

## Example Usage

### Python

```python
import requests

def get_podcast_episodes(podcast_id, country='us', limit=10):
    url = f"https://itunes.apple.com/lookup"
    params = {
        'id': podcast_id,
        'entity': 'podcastEpisode',
        'country': country,
        'limit': limit
    }
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    }
    
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    data = response.json()
    
    results = data.get('results', [])
    episodes = [r for r in results if r.get('wrapperType') == 'podcastEpisode']
    
    return episodes

# Usage
episodes = get_podcast_episodes(1711052890, 'cn', 5)
for ep in episodes:
    print(f"{ep['trackName']} - {ep['releaseDate'][:10]}")
```

### cURL

```bash
# Get podcast with episodes
curl -H "User-Agent: Mozilla/5.0" \
  "https://itunes.apple.com/lookup?id=1711052890&entity=podcastEpisode&country=cn&limit=10"

# Get specific episode
curl -H "User-Agent: Mozilla/5.0" \
  "https://itunes.apple.com/lookup?id=1000744375610&entity=podcastEpisode&country=cn"
```

## Additional Resources

- **Official Docs**: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
- **Podcast RSS Spec**: https://help.apple.com/itc/podcasts_connect/#/itcb54353390
- **RSS 2.0 Spec**: https://www.rssboard.org/rss-specification
- **Podcast Namespace**: https://github.com/Podcastindex-org/podcast-namespace

## Changes and Updates

### Recent Updates

- 2024-01: Increased limit parameter maximum to 200
- 2023-06: Added `episodeUrl` field for direct audio access
- 2022-11: Enhanced description field with full HTML

### Deprecated Fields

- `previewUrl` (still supported, but `episodeUrl` preferred)
- `collectionViewUrl` (use `trackViewUrl` instead)

## Support

For API issues:
1. Check response format matches this documentation
2. Verify podcast/episode ID is valid
3. Try different country codes
4. Fall back to RSS feed if API unavailable

No official Apple support channel for third-party API usage.
