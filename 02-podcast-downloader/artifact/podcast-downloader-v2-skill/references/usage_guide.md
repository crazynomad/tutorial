# Usage Guide - Apple Podcast Downloader V2

## Quick Start

### Installation

```bash
# Install required packages
pip install requests feedparser --break-system-packages
```

### Basic Usage

```bash
# Download specific episode
python scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/xxx/id123456?i=789012"

# Download latest 5 episodes
python scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id123456" -n 5

# Download to specific directory
python scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id123456" -n 10 -o ~/Downloads
```

## Detailed Examples

### Example 1: Single Episode Download

**Scenario**: User shares a specific episode URL with `?i=` parameter

```bash
python scripts/download_podcast.py \
  "https://podcasts.apple.com/cn/podcast/独树不成林/id1711052890?i=1000744375610"
```

**Output**:
```
🎙️  Apple Podcast 下载器 (API 增强版)
==================================================
🌍 商店地区: CN
📂 Podcast ID: 1711052890
🎯 单集 ID: 1000744375610

正在查询指定单集...

📻 播客: 独树不成林
👤 作者: XYZ.FM
📝 可用节目数: 1
📥 准备下载 1 集

[1/1] 289-我在童年如何与权威周旋？
   📅 2025-01-10 | ⏱️  40 分钟
   ⬇️  正在下载: 289-我在童年如何与权威周旋？
   进度: 100.0% (36.21/36.21 MB)
   ✅ 已保存: 001 - 289-我在童年如何与权威周旋？.m4a

==================================================
✨ 下载完成!
📂 输出目录: ./独树不成林
✅ 成功: 1/1 集
```

### Example 2: Batch Download

**Scenario**: Download latest episodes from podcast homepage

```bash
python scripts/download_podcast.py \
  "https://podcasts.apple.com/cn/podcast/id1711052890" \
  -n 5 \
  -o /mnt/user-data/outputs
```

**What happens**:
1. Script extracts podcast ID: `1711052890`
2. Detects region: `cn` (China)
3. Calls iTunes API to get episode list
4. Downloads first 5 episodes
5. Saves to `/mnt/user-data/outputs/独树不成林/`

### Example 3: Download All Available Episodes

**Scenario**: Archive entire podcast (up to 200 episodes)

```bash
python scripts/download_podcast.py \
  "https://podcasts.apple.com/us/podcast/the-daily/id1200361736"
```

**Note**: Without `-n` flag, downloads all available episodes (API limit: 200)

### Example 4: Different Regions

**Chinese podcast**:
```bash
python scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id123456" -n 3
```

**US podcast**:
```bash
python scripts/download_podcast.py "https://podcasts.apple.com/us/podcast/id789012" -n 3
```

**Japanese podcast**:
```bash
python scripts/download_podcast.py "https://podcasts.apple.com/jp/podcast/id345678" -n 3
```

Region code is auto-detected from URL.

## Command Line Arguments

### Positional Arguments

- `url` (required): Apple Podcast URL
  - Format: `https://podcasts.apple.com/{region}/podcast/{name}/id{podcast_id}`
  - With episode: `...?i={episode_id}`

### Optional Arguments

- `-n COUNT, --count COUNT`: Number of episodes to download
  - Default: All available (up to 200)
  - Example: `-n 10` downloads latest 10 episodes

- `-o OUTPUT, --output OUTPUT`: Output directory
  - Default: Current directory (`.`)
  - Creates subdirectory with podcast name
  - Example: `-o ~/Downloads/Podcasts`

- `-h, --help`: Show help message

## Output Organization

### Directory Structure

```
OutputDirectory/
└── PodcastName/                    # Sanitized podcast name
    ├── podcast_info.json           # Podcast metadata
    ├── 001 - Episode1.m4a          # Audio file (m4a/mp3)
    ├── 001 - Episode1.json         # Episode metadata
    ├── 002 - Episode2.m4a
    ├── 002 - Episode2.json
    └── ...
```

### File Naming Convention

- Episodes numbered sequentially: `001`, `002`, `003`...
- Format: `{number:03d} - {sanitized_title}.{ext}`
- Invalid characters (`<>:"/\|?*`) replaced with `_`
- Limited to 200 characters

### Metadata Files

**podcast_info.json** - One per podcast:
```json
{
  "podcast_name": "独树不成林",
  "artist": "XYZ.FM",
  "country": "cn",
  "total_episodes": 272,
  "download_date": "2026-01-13T14:30:00.123456"
}
```

**{episode}.json** - One per episode:
```json
{
  "title": "289-我在童年如何与权威周旋？",
  "release_date": "2025-01-10",
  "duration_minutes": 40,
  "description": "在这期节目中...",
  "audio_file": "001 - 289-我在童年如何与权威周旋？.m4a",
  "download_url": "https://..."
}
```

## Advanced Usage

### Custom Python Script

```python
from download_podcast import download_from_apple_url

# Download latest 10 episodes
success = download_from_apple_url(
    apple_url="https://podcasts.apple.com/cn/podcast/id1711052890",
    output_dir="/path/to/output",
    download_count=10
)

if success:
    print("Download completed!")
```

### Integration with Other Tools

**Download and convert to MP3**:
```bash
# Download
python scripts/download_podcast.py "URL" -n 5 -o /tmp/podcast

# Convert to MP3 (requires ffmpeg)
cd /tmp/podcast/PodcastName
for f in *.m4a; do
    ffmpeg -i "$f" -codec:a libmp3lame -qscale:a 2 "${f%.m4a}.mp3"
done
```

**Batch processing multiple podcasts**:
```bash
# Create a file with URLs
cat > podcasts.txt << EOF
https://podcasts.apple.com/cn/podcast/id1711052890
https://podcasts.apple.com/us/podcast/id1200361736
https://podcasts.apple.com/jp/podcast/id123456789
EOF

# Download each
while IFS= read -r url; do
    python scripts/download_podcast.py "$url" -n 3 -o ~/Podcasts
done < podcasts.txt
```

## Troubleshooting

### Issue: 403 Forbidden Error

**Symptom**: Download fails with HTTP 403 status

**Solution**: 
- V2 includes User-Agent headers to prevent most 403 errors
- If still occurs, may be temporary server restriction
- Wait and retry later

### Issue: Episode Not Found

**Symptom**: "在 API 返回的最近列表中未找到该单集"

**Cause**: Episode too old (API returns max 200 recent episodes)

**Solution**:
- Script automatically falls back to RSS feed
- If RSS also fails, episode may be deleted/unavailable

### Issue: Slow Download Speed

**Symptom**: Download taking very long

**Possible Causes**:
- Large file size (some episodes are 100+ MB)
- Network connection slow
- Server throttling

**Solutions**:
- Check network connection
- Try different time of day
- Download fewer episodes at once

### Issue: Invalid Characters in Filename

**Symptom**: Error creating file with certain characters

**Solution**: 
- Script automatically sanitizes filenames
- Invalid chars replaced with `_`
- If still issues, may be filesystem limitation

### Issue: Permission Denied

**Symptom**: Can't write to output directory

**Solution**:
```bash
# Check permissions
ls -ld /path/to/output

# Create directory if doesn't exist
mkdir -p /path/to/output

# Use home directory instead
python scripts/download_podcast.py "URL" -o ~/Downloads
```

## Performance Tips

### Optimal Download Size

- **Single episode test**: Use `-n 1` first to verify
- **Small batch**: `-n 5-10` for quick collection
- **Full archive**: No `-n` flag, but may take time

### Network Considerations

- **Bandwidth**: Each episode typically 20-50 MB
- **Time estimate**: ~5-10 seconds per episode (varies)
- **Concurrent downloads**: Not supported (sequential only)

### Storage Planning

- **Audio format**: Usually .m4a (better compression) or .mp3
- **Average size**: 30-40 MB per 30-minute episode
- **Metadata**: <1 KB per episode (JSON files)

**Example calculation**:
- 10 episodes × 40 MB = ~400 MB
- 100 episodes × 40 MB = ~4 GB

## Best Practices

1. **Test first**: Always try `-n 1` with new podcast
2. **Organize**: Use meaningful output directories
3. **Backup**: Save metadata JSON files
4. **Respect**: Only for personal use, respect copyright
5. **Monitor**: Watch progress, cancel if needed (Ctrl+C)

## FAQ

**Q: Can I download from Spotify?**  
A: No, this tool only supports Apple Podcasts. Spotify uses different API.

**Q: Can I resume interrupted downloads?**  
A: Not currently. Interrupted downloads must restart. (Feature consideration for v3)

**Q: Why only 200 episodes max?**  
A: iTunes API limitation. For older episodes, use RSS fallback (automatic).

**Q: Can I schedule downloads?**  
A: Yes, use cron (Linux/Mac) or Task Scheduler (Windows):
```bash
# Cron example: Daily at 2 AM
0 2 * * * python /path/to/scripts/download_podcast.py "URL" -n 1 -o /path/output
```

**Q: What about private/premium podcasts?**  
A: Only public podcasts supported. Authentication not implemented.

**Q: Can I change episode numbering?**  
A: Currently uses API order (newest first). Modify script if needed.

## Resources

- Apple Podcasts: https://podcasts.apple.com
- iTunes Search API: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/
- Feedparser docs: https://pythonhosted.org/feedparser/
- Requests docs: https://docs.python-requests.org/

## Support

For issues or suggestions:
1. Check this usage guide
2. Review technical details in `technical_details.md`
3. Provide feedback through Claude interface
