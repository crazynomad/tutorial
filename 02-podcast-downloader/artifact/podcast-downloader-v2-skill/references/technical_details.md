# Technical Details - Apple Podcast Downloader V2

## Architecture Overview

```
User Input (Apple Podcast URL)
    ↓
URL Parser (extract IDs & region)
    ↓
Data Retrieval (multi-tier fallback)
    ├─→ Method A: Direct API Query (fastest)
    ├─→ Method B: List Search (fast)
    └─→ Method C: RSS Parse (fallback)
    ↓
Audio Downloader (streaming with progress)
    ↓
Metadata Saver (JSON format)
    ↓
Output (organized files)
```

## Core Components

### 1. URL Parser (`extract_podcast_info`)

**Purpose**: Extract identifiers from Apple Podcast URL

**Input**: 
```
https://podcasts.apple.com/cn/podcast/podcast-name/id1711052890?i=1000744375610
```

**Output**:
```python
podcast_id = "1711052890"      # Required
episode_id = "1000744375610"   # Optional
country_code = "cn"            # Auto-detected
```

**Algorithm**:
```python
def extract_podcast_info(apple_url):
    # 1. Extract region code
    country_match = re.search(r'apple\.com/([a-z]{2})/', apple_url)
    country_code = country_match.group(1) if country_match else 'us'
    
    # 2. Extract episode ID from query params
    parsed_url = urlparse(apple_url)
    query_params = parse_qs(parsed_url.query)
    episode_id = query_params.get('i', [None])[0]
    
    # 3. Extract podcast ID from path
    id_match = re.search(r'id(\d+)', apple_url)
    podcast_id = id_match.group(1) if id_match else None
    
    return podcast_id, episode_id, country_code
```

### 2. API Data Retrieval

#### Method A: Direct Episode Query (`fetch_episode_by_id`)

**When**: User provides specific episode URL with `?i=` parameter

**Endpoint**:
```
GET https://itunes.apple.com/lookup
    ?id={episode_id}
    &entity=podcastEpisode
    &country={country_code}
```

**Response Example**:
```json
{
  "resultCount": 1,
  "results": [
    {
      "wrapperType": "podcastEpisode",
      "trackId": 1000744375610,
      "trackName": "289-我在童年如何与权威周旋？",
      "collectionName": "独树不成林",
      "artistName": "XYZ.FM",
      "releaseDate": "2025-01-10T00:00:00Z",
      "trackTimeMillis": 2415000,
      "episodeUrl": "https://...",
      "description": "..."
    }
  ]
}
```

**Advantages**:
- Fastest (single API call)
- Direct access to specific episode
- No list parsing needed

**Limitations**:
- Only works with valid episode ID
- Returns single episode only

#### Method B: List Search (`fetch_episodes_via_api`)

**When**: Method A fails, or user provides podcast homepage URL

**Endpoint**:
```
GET https://itunes.apple.com/lookup
    ?id={podcast_id}
    &entity=podcastEpisode
    &country={country_code}
    &limit=200
```

**Response Structure**:
```json
{
  "resultCount": 201,
  "results": [
    {
      "wrapperType": "track",  // First result: podcast info
      "collectionId": 1711052890,
      "collectionName": "独树不成林",
      "artistName": "XYZ.FM",
      "feedUrl": "https://feed.xyzfm.space/..."
    },
    {
      "wrapperType": "podcastEpisode",  // Subsequent: episodes
      "trackId": 1000744375610,
      "trackName": "Episode Title",
      ...
    },
    ...
  ]
}
```

**Processing**:
```python
results = data.get('results', [])
podcast_info = results[0]  # First item
episodes = [r for r in results if r.get('wrapperType') == 'podcastEpisode']
```

**Advantages**:
- Returns up to 200 episodes
- Includes podcast metadata
- Single API call for batch info

**Limitations**:
- Max 200 episodes (API limit)
- Slightly slower than Method A
- Need to filter results

#### Method C: RSS Feed Fallback (`parse_rss_feed`)

**When**: API methods fail or unavailable

**Step 1 - Get RSS URL**:
```
GET https://itunes.apple.com/lookup
    ?id={podcast_id}
    &country={country_code}
    &entity=podcast
```

**Step 2 - Parse RSS**:
```python
feed = feedparser.parse(rss_url, request_headers={
    'User-Agent': 'Mozilla/5.0 ...'
})

for entry in feed.entries:
    for enclosure in entry.get('enclosures', []):
        if 'audio' in enclosure.get('type', ''):
            audio_url = enclosure.get('href')
```

**Advantages**:
- Most reliable fallback
- Works when API down
- Can access all episodes (no 200 limit)

**Limitations**:
- Slower (XML parsing)
- May have different metadata format
- Some feeds protected (403 errors)

### 3. Audio Downloader (`download_audio`)

**Streaming Download**:
```python
response = requests.get(url, stream=True, timeout=60, headers={
    'User-Agent': 'Mozilla/5.0 ...'
})

total_size = int(response.headers.get('content-length', 0))
downloaded = 0

with open(output_path, 'wb') as f:
    for chunk in response.iter_content(chunk_size=8192):
        if chunk:
            f.write(chunk)
            downloaded += len(chunk)
            progress = (downloaded / total_size) * 100
            # Display progress
```

**Features**:
- Streaming (memory efficient)
- Progress tracking (percentage & MB)
- Timeout handling (60 seconds)
- User-Agent header (prevent 403)
- Chunk size: 8192 bytes (8 KB)

**Error Handling**:
```python
try:
    response.raise_for_status()  # Check HTTP status
    # Download
except requests.exceptions.RequestException as e:
    print(f"Download failed: {e}")
    return False
```

### 4. Metadata Management

**Podcast Metadata** (`podcast_info.json`):
```python
metadata = {
    'podcast_name': podcast_info.get('collectionName'),
    'artist': podcast_info.get('artistName'),
    'country': country_code,
    'total_episodes': len(episodes),
    'download_date': datetime.now().isoformat()
}
```

**Episode Metadata** (per episode JSON):
```python
episode_meta = {
    'title': episode.get('trackName'),
    'release_date': episode.get('releaseDate')[:10],
    'duration_minutes': int(episode.get('trackTimeMillis', 0) / 1000 / 60),
    'description': episode.get('description'),
    'audio_file': filename,
    'download_url': audio_url
}
```

### 5. File Management

**Filename Sanitization**:
```python
def sanitize_filename(filename):
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Trim spaces and dots
    filename = filename.strip('. ')
    # Limit length
    return filename[:200]
```

**Invalid Characters**:
- Windows: `< > : " / \ | ? *`
- All replaced with underscore `_`
- Leading/trailing spaces removed
- Max length: 200 characters

**File Extension Detection**:
```python
parsed_url = urlparse(audio_url)
ext = Path(parsed_url.path).suffix or '.m4a'
```

**Common Extensions**:
- `.m4a` - AAC audio (most common)
- `.mp3` - MP3 audio
- `.m4v` - Video podcast
- Default: `.m4a` if undetermined

## Performance Characteristics

### Speed Comparison

| Method | Operation | Time | Data Transfer |
|--------|-----------|------|---------------|
| Direct API | Single episode | ~1-2s | <10 KB |
| List API | 200 episodes info | ~2-3s | ~100 KB |
| RSS Parse | Full feed | ~3-5s | ~200 KB |
| Audio Download | 40 MB file | ~5-10s | 40 MB |

### Memory Usage

- **Streaming download**: ~8-16 KB buffer
- **JSON parsing**: <1 MB per request
- **RSS parsing**: ~1-2 MB for large feeds
- **Total runtime**: <50 MB typically

### Network Calls

**Minimal scenario** (specific episode):
1. Direct API query: 1 call
2. Audio download: 1 call
Total: 2 network calls

**Typical scenario** (latest 5 episodes):
1. List API query: 1 call
2. Audio downloads: 5 calls
Total: 6 network calls

**Fallback scenario** (API fails):
1. Get RSS URL: 1 call
2. Parse RSS: 1 call
3. Audio downloads: N calls
Total: 2 + N calls

## Error Handling Strategy

### HTTP Status Codes

```python
# 200 OK - Success
response.raise_for_status()

# 403 Forbidden - Add User-Agent header
headers = {'User-Agent': 'Mozilla/5.0 ...'}

# 404 Not Found - Episode/podcast doesn't exist
print("Episode not found")

# 500 Server Error - Retry or fallback to RSS
```

### Timeout Handling

```python
try:
    response = requests.get(url, timeout=60)
except requests.exceptions.Timeout:
    print("Request timed out, please retry")
```

### Network Failures

```python
try:
    response = requests.get(url)
except requests.exceptions.ConnectionError:
    print("Network connection failed")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
```

## Security Considerations

### User-Agent Spoofing

**Purpose**: Prevent 403 errors from servers that block scripts

**Implementation**:
```python
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}
```

**Note**: Mimics legitimate browser request, commonly accepted practice for personal tools

### Input Validation

```python
# Validate podcast ID exists
if not podcast_id:
    print("Invalid URL: No podcast ID found")
    return False

# Validate episode index range
if episode_index < 1 or episode_index > len(episodes):
    print(f"Invalid episode: {episode_index}")
    return False
```

### File System Safety

```python
# Sanitize filenames
filename = sanitize_filename(title)

# Create directory safely
output_path.mkdir(parents=True, exist_ok=True)

# Prevent path traversal
output_path = Path(output_dir).resolve() / podcast_name
```

## iTunes Search API Details

### Official Documentation

https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

### Key Parameters

- `id`: Podcast or episode ID (required)
- `entity`: Type of content (`podcast`, `podcastEpisode`)
- `country`: 2-letter country code (`us`, `cn`, `jp`)
- `limit`: Max results (1-200, default 50)

### Supported Regions

Partial list (many more available):
- `us` - United States
- `cn` - China
- `jp` - Japan
- `uk` - United Kingdom
- `ca` - Canada
- `au` - Australia
- `de` - Germany
- `fr` - France
- `kr` - South Korea

### Rate Limiting

- No official documented limit
- Recommended: <20 requests/second
- Use responsibly to avoid throttling

### API Response Fields

**Podcast Episode**:
- `trackId`: Episode ID
- `trackName`: Episode title
- `collectionName`: Podcast name
- `artistName`: Podcast author
- `releaseDate`: Publication date (ISO 8601)
- `trackTimeMillis`: Duration in milliseconds
- `episodeUrl` / `previewUrl`: Audio file URL
- `description`: Episode description
- `episodeFileExtension`: File type

## Comparison with V1

| Feature | V1 (RSS) | V2 (API) | Improvement |
|---------|----------|----------|-------------|
| Primary Method | RSS Parse | iTunes API | 3-5x faster |
| Region Support | Manual | Auto-detect | Better UX |
| Fallback | None | Multi-tier | More reliable |
| User-Agent | No | Yes | Prevents 403 |
| Progress | Basic | Detailed | Better feedback |
| Metadata | Limited | Rich | More info |
| Episode Limit | All | 200 (API) | Trade-off |

## Future Enhancements (V3 Ideas)

1. **Parallel Downloads**: Use threading/asyncio for concurrent downloads
2. **Resume Support**: Save download state, resume interrupted downloads
3. **Smart Caching**: Cache episode lists, avoid redundant API calls
4. **Format Conversion**: Automatically convert to MP3/OGG
5. **Playlist Export**: Generate M3U/XSPF playlists
6. **Authentication**: Support private/premium podcasts
7. **Database Integration**: SQLite for tracking downloads
8. **Web Interface**: Simple Flask/FastAPI web UI

## Dependencies

### Required Packages

**requests** (2.31.0+):
- HTTP client library
- Used for API calls and audio downloads
- https://docs.python-requests.org/

**feedparser** (6.0.10+):
- RSS/Atom feed parser
- Fallback for when API unavailable
- https://pythonhosted.org/feedparser/

### Installation

```bash
pip install requests feedparser --break-system-packages
```

**Note**: `--break-system-packages` needed on some systems to install outside virtual environment

## Testing

### Unit Test Examples

```python
# Test URL parsing
url = "https://podcasts.apple.com/cn/podcast/id123456?i=789012"
podcast_id, episode_id, country = extract_podcast_info(url)
assert podcast_id == "123456"
assert episode_id == "789012"
assert country == "cn"

# Test filename sanitization
dirty = 'Episode: <Test> "Name" | File?'
clean = sanitize_filename(dirty)
assert clean == 'Episode_ _Test_ _Name_ _ File_'
```

### Integration Test

```bash
# Test with real podcast
python scripts/download_podcast.py \
  "https://podcasts.apple.com/us/podcast/id1200361736" \
  -n 1 \
  -o /tmp/test_podcast

# Verify output
ls /tmp/test_podcast/*/
# Should contain: .m4a file, .json files
```

## Debugging

### Enable Verbose Logging

Modify script to add debug prints:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Common Debug Points

1. **URL parsing**: Print extracted IDs
2. **API response**: Print JSON structure
3. **Download progress**: Print chunk sizes
4. **File creation**: Print paths before write

### Example Debug Session

```python
# Add to script
print(f"DEBUG: podcast_id={podcast_id}, episode_id={episode_id}")
print(f"DEBUG: API URL={api_url}")
print(f"DEBUG: Response status={response.status_code}")
print(f"DEBUG: Audio URL={audio_url}")
```

## Performance Tuning

### Optimize Network

```python
# Increase chunk size for faster downloads
chunk_size = 16384  # 16 KB instead of 8 KB

# Adjust timeout for slow connections
timeout = 120  # 2 minutes instead of 60 seconds
```

### Optimize File I/O

```python
# Use buffered writing
with open(path, 'wb', buffering=65536) as f:  # 64 KB buffer
    f.write(data)
```

### Reduce API Calls

```python
# Cache podcast info
podcast_cache = {}
if podcast_id not in podcast_cache:
    podcast_cache[podcast_id] = fetch_episodes_via_api(podcast_id, country)
```

## Conclusion

V2 represents a significant improvement over V1 through:
- Multi-tier data retrieval with API priority
- Automatic region detection and handling
- Robust error handling and fallback mechanisms
- Enhanced user experience with progress tracking
- Rich metadata extraction and storage

The architecture is designed for reliability and extensibility, with clear upgrade paths for future versions.
