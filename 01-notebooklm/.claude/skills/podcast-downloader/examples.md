# Podcast Downloader - Usage Examples

This document provides detailed examples of using the podcast-downloader skill.

## Example 1: Simple Search and Download

**User Request**: "Find and download the latest episode of The Daily"

**Claude's Response**:

```
I'll search for "The Daily" podcast and download the latest episode.

🔍 Searching for podcasts...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "the daily" 5
```

```
✅ Found 5 podcasts:

1. The Daily (ID: 1200361736)
   - Author: The New York Times
   - Episodes: 2464
   - Genre: Daily News

2. The Journal. (ID: 1469394914)
   - Author: The Wall Street Journal
   - Episodes: 311
   - Genre: Daily News

3. Today, Explained (ID: 1346207297)
   - Author: Vox
   - Episodes: 2000
   - Genre: Daily News

I'll select #1 "The Daily" from The New York Times.

📻 Getting latest episode...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes 1200361736 1
```

```
Latest episode:
- Title: "Marriage and Sex in the Age of Ozempic: An Update"
- Released: 2025-12-26
- Duration: 20m 47s

Would you like me to download this episode?
```

**User**: "Yes, please"

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1200361736 0
```

```
📥 Downloading episode...
⏳ Progress: 100.0% (19.0/19.0 MB)
✅ Download complete!

File saved to: downloads/podcasts/The Daily/The Daily - Marriage and Sex in the Age of Ozempic An Update.mp3
```

---

## Example 2: Browse Episodes Before Downloading

**User Request**: "Show me the last 5 episodes of Python Bytes"

**Claude's Response**:

```
I'll search for "Python Bytes" and show you the latest episodes.

🔍 Searching...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "python bytes" 3
```

```
Found podcast: Python Bytes (ID: 1173690032)
- Author: Michael Kennedy & Brian Okken
- Episodes: 400+
- Genre: Technology

📻 Fetching latest 5 episodes...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes 1173690032 5
```

```
Latest 5 episodes:

[0] Episode #367: Fastest Python Editor
    Released: 2025-12-20 | Duration: 52m
    Description: Discussing the fastest Python code editors and IDE performance...

[1] Episode #366: Python 3.13 Features
    Released: 2025-12-13 | Duration: 48m
    Description: New features in Python 3.13 including performance improvements...

[2] Episode #365: Type Hints Deep Dive
    Released: 2025-12-06 | Duration: 55m
    Description: Advanced type hinting patterns and best practices...

[3] Episode #364: Async Python Patterns
    Released: 2025-11-29 | Duration: 51m
    Description: Modern asyncio patterns and common pitfalls...

[4] Episode #363: Testing Strategies
    Released: 2025-11-22 | Duration: 49m
    Description: Comprehensive testing strategies for Python projects...

Which episode(s) would you like to download? (Provide the number, e.g., 0 or 0,2,4)
```

**User**: "Download 0 and 1"

```
Downloading 2 episodes...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1173690032 0
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1173690032 1
```

```
✅ Downloaded:
1. downloads/podcasts/Python Bytes/Python Bytes - Episode #367 Fastest Python Editor.mp3
2. downloads/podcasts/Python Bytes/Python Bytes - Episode #366 Python 3.13 Features.mp3
```

---

## Example 3: Batch Download Multiple Episodes

**User Request**: "Download the 3 most recent episodes of All-In Podcast"

**Claude's Response**:

```
I'll find "All-In Podcast" and download the 3 latest episodes.

🔍 Searching...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "all-in podcast" 3
```

```
Found: All-In with Chamath, Jason, Sacks & Friedberg (ID: 1502871393)

📻 Getting latest 3 episodes...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes 1502871393 3
```

```
Found 3 episodes:

[0] E163: Tech predictions 2026
[1] E162: Year in review 2025
[2] E161: Trump's second term begins

Downloading all 3 episodes...

Episode 1/3: E163: Tech predictions 2026
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1502871393 0
```

```
⏳ Progress: 100.0%
✅ Complete

Episode 2/3: E162: Year in review 2025
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1502871393 1
```

```
⏳ Progress: 100.0%
✅ Complete

Episode 3/3: E161: Trump's second term begins
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1502871393 2
```

```
⏳ Progress: 100.0%
✅ Complete

✅ All 3 episodes downloaded successfully!
Location: downloads/podcasts/All-In with Chamath Jason Sacks & Friedberg/
```

---

## Example 4: Search with Specific Criteria

**User Request**: "Find technology podcasts about AI and show me the top 3"

**Claude's Response**:

```
I'll search for technology podcasts related to AI.

🔍 Searching for: "AI technology"
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "AI technology" 10
```

```
Found 10 podcasts. Here are the top 3:

1. AI Breakdown
   - Author: NLX.ai
   - Episodes: 245
   - Genre: Technology
   - Description: Daily AI news and analysis

2. The AI Podcast
   - Author: NVIDIA
   - Episodes: 180
   - Genre: Technology
   - Description: Conversations with AI researchers and practitioners

3. Hard Fork
   - Author: The New York Times
   - Episodes: 156
   - Genre: Technology
   - Description: Tech news including AI developments

Would you like to:
- See episodes from any of these? (Specify number)
- Download latest episodes? (Specify number and how many)
- Search for something else?
```

---

## Example 5: Error Handling

**User Request**: "Download episode 100 from The Daily"

**Claude's Response**:

```
I'll fetch episode #100 from The Daily podcast.

🔍 Getting podcast info...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "the daily" 1
```

```
Found: The Daily (ID: 1200361736)

⚠️ Note: The API limits episode fetching. To get episode #100, I'll need to fetch 101 episodes.

📻 Fetching episodes...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes 1200361736 101
```

```
⚠️ API returned only 100 episodes (API limit: 100)

The episode you requested (#100, 0-indexed) is:
- Title: "[Episode from ~3 months ago]"
- Date: 2025-09-20
- Duration: 28m

Would you like to download this episode, or would you prefer a more recent one?
```

---

## Example 6: Custom Download Location

**User Request**: "Download latest episode of Lex Fridman to my Desktop/Podcasts folder"

**Claude's Response**:

```
I'll download the latest Lex Fridman podcast to your Desktop/Podcasts folder.

🔍 Searching...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "lex fridman" 1
```

```
Found: Lex Fridman Podcast (ID: 1434243584)

📻 Getting latest episode...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes 1434243584 1
```

```
Latest episode:
- Title: "#410 - Elon Musk on AI, Mars, and the Future"
- Released: 2025-12-15
- Duration: 3h 12m

📥 Downloading to Desktop/Podcasts...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py download 1434243584 0 "/Users/username/Desktop/Podcasts"
```

```
✅ Downloaded to:
/Users/username/Desktop/Podcasts/Lex Fridman Podcast/Lex Fridman Podcast - #410 - Elon Musk on AI Mars and the Future.mp3

File size: 185 MB
```

---

## Example 7: Getting Podcast Information

**User Request**: "What's the RSS feed URL for The Daily podcast?"

**Claude's Response**:

```
I'll get the RSS feed information for The Daily.

🔍 Searching...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "the daily" 1
```

```
The Daily - by The New York Times

📊 Podcast Information:
- Collection ID: 1200361736
- Total Episodes: 2464
- Genre: Daily News
- RSS Feed: https://feeds.simplecast.com/Sl5CSM3S
- Apple Podcasts URL: https://podcasts.apple.com/us/podcast/the-daily/id1200361736

You can use this RSS feed URL to:
- Subscribe in any podcast app
- Get all episodes (not just recent ones)
- Access episode metadata
```

---

## Example 8: Search Refinement

**User Request**: "Find podcasts about Python programming"

**Claude's Response**:

```
🔍 Searching for Python programming podcasts...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py search "python programming" 10
```

```
Found 10 podcasts:

Top 5:
1. Talk Python To Me
2. Python Bytes
3. Real Python Podcast
4. Teaching Python
5. Test & Code

Would you like to:
- See more details about any of these? (Specify number)
- List episodes from any? (Specify number)
- Download latest episodes? (Specify which and how many)
- Refine search? (Provide new keywords)
```

**User**: "Show me episodes from Talk Python To Me"

```
📻 Fetching episodes from Talk Python To Me (ID: 979020229)...
```

```bash
python3 .claude/skills/podcast-downloader/scripts/itunes_api.py episodes 979020229 10
```

```
Latest 10 episodes:

[0] #445: Django performance improvements
[1] #444: Python packaging in 2025
[2] #443: FastAPI best practices
[3] #442: Data science with Polars
[4] #441: Testing strategies
[5] #440: Python 3.13 deep dive
[6] #439: Building CLI tools
[7] #438: Async Python patterns
[8] #437: Web scraping techniques
[9] #436: ML deployment strategies

Which would you like to download?
```

---

## Common Patterns

### Pattern: "Quick Download"
User: "Download latest [podcast name]"
→ Search → Get episodes (limit 1) → Download

### Pattern: "Browse and Choose"
User: "Show me recent [podcast name] episodes"
→ Search → Get episodes (limit 10) → Display → Wait for selection → Download

### Pattern: "Batch Download"
User: "Download [N] latest episodes of [podcast]"
→ Search → Get episodes (limit N) → Download all sequentially

### Pattern: "Information Lookup"
User: "What's the RSS feed for [podcast]?"
→ Search → Display metadata including feedUrl

### Pattern: "Explore Topic"
User: "Find podcasts about [topic]"
→ Search → Display results → Offer next steps
