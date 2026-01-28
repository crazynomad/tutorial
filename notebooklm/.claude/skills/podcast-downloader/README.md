# Apple Podcast Downloader - Claude Skill

A comprehensive Claude Code skill for searching, browsing, and downloading podcast episodes from Apple Podcasts.

## 🎯 Features

- 🔍 **Search Podcasts** - Find podcasts by keyword, author, or topic
- 📋 **Browse Episodes** - List episodes with detailed metadata
- 📥 **Download Audio** - Download episodes as MP3 files
- 📊 **Get Metadata** - Access RSS feeds, artwork, and detailed information
- ⚡ **Fast & Simple** - No authentication required, uses Apple's free API

## 📁 Project Structure

```
podcast-downloader/
├── SKILL.md              # Main skill definition (Claude reads this)
├── README.md             # This file
├── examples.md           # Usage examples and common patterns
├── reference.md          # Complete API documentation
└── scripts/
    └── itunes_api.py     # Python helper script
```

## 🚀 Quick Start

### Installation

1. This skill is already installed in `.claude/skills/podcast-downloader/`
2. No additional dependencies required (uses Python 3 standard library)
3. Claude will automatically use this skill when you mention podcasts

### Basic Usage

Just ask Claude natural questions:

```
"Find and download the latest episode of The Daily"
```

```
"Show me the 5 most recent Python Bytes episodes"
```

```
"Download episodes 1, 3, and 5 from All-In Podcast"
```

## 💡 Example Conversations

### Example 1: Quick Download

**You**: "Download the latest episode of The Daily podcast"

**Claude**:
- Searches for "The Daily"
- Shows you the result
- Gets the latest episode
- Downloads it to `downloads/podcasts/The Daily/`

### Example 2: Browse and Choose

**You**: "Show me the latest 10 episodes of Python Bytes"

**Claude**:
- Searches for "Python Bytes"
- Lists 10 latest episodes with titles and descriptions
- Waits for you to choose which to download

### Example 3: Get Information

**You**: "What's the RSS feed URL for Talk Python To Me?"

**Claude**:
- Searches for the podcast
- Returns the RSS feed URL and other metadata

## 🔧 Technical Details

### How It Works

1. **Search**: Uses iTunes Search API to find podcasts
2. **Episodes**: Fetches episode list using podcast ID
3. **Download**: Downloads MP3 files directly from CDN

### API Information

- **Provider**: Apple iTunes Search API
- **Authentication**: None required (free public API)
- **Rate Limits**: Reasonable use (recommended: <20 req/sec)
- **Documentation**: See `reference.md` for complete API docs

### Helper Script

The Python helper script (`scripts/itunes_api.py`) provides three commands:

```bash
# Search for podcasts
python3 scripts/itunes_api.py search "keyword" [limit]

# Get episodes
python3 scripts/itunes_api.py episodes <podcast_id> [limit]

# Download episode
python3 scripts/itunes_api.py download <podcast_id> <episode_index> [output_dir]
```

## 📚 Documentation

- **SKILL.md** - Main instructions for Claude
- **examples.md** - Real-world usage examples
- **reference.md** - Complete API reference
- **README.md** - This overview (for humans)

## ⚙️ Skill Configuration

From `SKILL.md` frontmatter:

```yaml
name: podcast-downloader
description: Search and download podcast episodes from Apple Podcasts
allowed-tools: Bash(python3:*), Bash(curl:*), Read, Write
```

Claude will automatically activate this skill when you:
- Mention podcasts, Apple Podcasts, or iTunes
- Ask to search for or download podcast episodes
- Request podcast information or metadata

## 🎓 Teaching Resources

This skill was created as a teaching example for the NotebookLM tutorial on creating Claude Skills.

### Learning Objectives

1. **Skill Structure**: Understanding Claude Skill file organization
2. **API Integration**: Working with REST APIs in skills
3. **Tool Usage**: Using allowed-tools for system operations
4. **Documentation**: Creating comprehensive skill documentation

### What Makes This a Good Example

- ✅ **Simple API**: No authentication, easy to understand
- ✅ **Clear Use Case**: Practical and useful functionality
- ✅ **Complete Documentation**: All files included
- ✅ **Tested**: Fully functional and tested
- ✅ **Extensible**: Easy to add features

## 🧪 Testing

To test the skill functionality:

```bash
# Test search
python3 scripts/itunes_api.py search "python" 3

# Test episodes (Real Python Podcast ID: 1501905538)
python3 scripts/itunes_api.py episodes 1501905538 5

# Test download (creates a small test download)
python3 scripts/itunes_api.py download 1501905538 0
```

## 🤝 Usage Tips

### For Best Results

1. **Be specific** in your search terms
2. **Confirm before downloading** large batches
3. **Check available space** for downloads
4. **Use episode numbers** from the list Claude provides

### Common Patterns

- **Quick download**: "Download latest [podcast name]"
- **Browse first**: "Show me recent episodes of [podcast]"
- **Batch download**: "Download episodes 1-5 from [podcast]"
- **Get info**: "What's the RSS feed for [podcast]?"

## 📝 Notes

- Downloads are saved to `downloads/podcasts/` by default
- Files are organized by podcast name
- MP3 format, typical quality: 128kbps, 44.1kHz
- Episode files are named: `[Podcast] - [Episode Title].mp3`

## 🔍 Troubleshooting

**Skill not activating?**
- Make sure you mention "podcast" in your request
- Try being more explicit: "Use podcast-downloader to..."

**Download failing?**
- Check internet connection
- Verify disk space
- Try a different episode

**No results found?**
- Try different search terms
- Check podcast name spelling
- Try searching by author name

## 📄 License

This skill uses the Apple iTunes Search API, which is free for reasonable use.
Downloaded content is subject to copyright - personal use only.

## 🙏 Credits

Created for the NotebookLM tutorial on Claude Skills development.

Based on Apple iTunes Search API: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

---

**Version**: 1.0.0
**Last Updated**: 2025-12-27
**Status**: ✅ Fully Functional
