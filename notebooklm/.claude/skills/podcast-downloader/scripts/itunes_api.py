#!/usr/bin/env python3
"""
Apple iTunes Podcast API Helper
Provides command-line interface for searching and downloading podcasts
"""

import sys
import json
import re
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from urllib.parse import quote


class iTunesAPI:
    """Apple iTunes Search API wrapper"""

    BASE_URL = "https://itunes.apple.com"

    def search_podcasts(self, term, limit=10):
        """
        Search for podcasts by keyword

        Args:
            term: Search keyword
            limit: Number of results (max 200)

        Returns:
            List of podcast dictionaries
        """
        url = f"{self.BASE_URL}/search?term={self._encode(term)}&entity=podcast&limit={limit}"
        data = self._fetch_json(url)
        return data.get("results", [])

    def get_episodes(self, collection_id, limit=10):
        """
        Get episodes for a podcast

        Args:
            collection_id: Podcast collection ID
            limit: Number of episodes to fetch

        Returns:
            List of episode dictionaries
        """
        url = f"{self.BASE_URL}/lookup?id={collection_id}&entity=podcastEpisode&limit={limit}"
        data = self._fetch_json(url)
        results = data.get("results", [])

        # Filter out the podcast itself (first result)
        return [r for r in results if r.get("kind") == "podcast-episode"]

    def download_episode(self, episode_url, output_path):
        """
        Download podcast episode audio file

        Args:
            episode_url: Direct URL to audio file
            output_path: Where to save the file

        Returns:
            Path to downloaded file
        """
        print(f"📥 Downloading to: {output_path}", file=sys.stderr)

        try:
            request = Request(episode_url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urlopen(request)

            # Get file size
            content_length = response.headers.get('Content-Length')
            total_size = int(content_length) if content_length else 0

            # Download with progress
            downloaded = 0
            chunk_size = 8192

            output_path.parent.mkdir(parents=True, exist_ok=True)

            with open(output_path, 'wb') as f:
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break

                    f.write(chunk)
                    downloaded += len(chunk)

                    # Show progress
                    if total_size > 0:
                        progress = (downloaded / total_size) * 100
                        mb_downloaded = downloaded / (1024 * 1024)
                        mb_total = total_size / (1024 * 1024)
                        print(f"\r⏳ Progress: {progress:.1f}% ({mb_downloaded:.1f}/{mb_total:.1f} MB)",
                              end='', file=sys.stderr)

            print(f"\n✅ Download complete: {output_path}", file=sys.stderr)
            return str(output_path)

        except (URLError, HTTPError) as e:
            print(f"\n❌ Download failed: {e}", file=sys.stderr)
            raise

    def _fetch_json(self, url):
        """Fetch and parse JSON from URL"""
        try:
            request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urlopen(request)
            return json.loads(response.read().decode('utf-8'))
        except (URLError, HTTPError) as e:
            print(f"❌ API request failed: {e}", file=sys.stderr)
            raise

    def _encode(self, text):
        """URL encode text (supports Unicode)"""
        return quote(text, safe='')


def safe_filename(name, max_length=100):
    """Create safe filename from text"""
    # Remove unsafe characters
    safe = re.sub(r'[<>:"/\\|?*]', '', name)
    # Replace spaces and multiple dashes
    safe = re.sub(r'\s+', ' ', safe)
    safe = re.sub(r'-+', '-', safe)
    # Limit length
    return safe[:max_length].strip()


def format_duration(milliseconds):
    """Convert milliseconds to readable duration"""
    if not milliseconds:
        return "Unknown"

    seconds = milliseconds // 1000
    minutes = seconds // 60
    hours = minutes // 60

    if hours > 0:
        return f"{hours}h {minutes % 60}m"
    else:
        return f"{minutes}m {seconds % 60}s"


def format_date(iso_date):
    """Format ISO date to readable format"""
    if not iso_date:
        return "Unknown"

    # Simple format: 2025-12-26T10:45:00Z -> 2025-12-26
    return iso_date.split('T')[0]


def cmd_search(args):
    """Search command handler"""
    if len(args) < 1:
        print("Usage: search <keyword> [limit]", file=sys.stderr)
        return 1

    keyword = args[0]
    limit = int(args[1]) if len(args) > 1 else 10

    api = iTunesAPI()
    print(f"🔍 Searching for: '{keyword}'", file=sys.stderr)

    results = api.search_podcasts(keyword, limit)

    if not results:
        print("❌ No results found", file=sys.stderr)
        return 1

    print(f"✅ Found {len(results)} podcasts\n", file=sys.stderr)

    # Output JSON to stdout for Claude to parse
    print(json.dumps(results, indent=2))
    return 0


def cmd_episodes(args):
    """Episodes command handler"""
    if len(args) < 1:
        print("Usage: episodes <collection_id> [limit]", file=sys.stderr)
        return 1

    collection_id = args[0]
    limit = int(args[1]) if len(args) > 1 else 10

    api = iTunesAPI()
    print(f"📻 Fetching episodes for podcast ID: {collection_id}", file=sys.stderr)

    episodes = api.get_episodes(collection_id, limit)

    if not episodes:
        print("❌ No episodes found", file=sys.stderr)
        return 1

    print(f"✅ Found {len(episodes)} episodes\n", file=sys.stderr)

    # Output JSON to stdout
    print(json.dumps(episodes, indent=2))
    return 0


def cmd_download(args):
    """Download command handler"""
    if len(args) < 2:
        print("Usage: download <collection_id> <episode_index> [output_dir]", file=sys.stderr)
        return 1

    collection_id = args[0]
    episode_index = int(args[1])
    output_dir = Path(args[2]) if len(args) > 2 else Path("downloads/podcasts")

    # Fetch episodes
    api = iTunesAPI()
    print(f"📻 Fetching episodes for podcast ID: {collection_id}", file=sys.stderr)

    episodes = api.get_episodes(collection_id, limit=episode_index + 1)

    if not episodes or episode_index >= len(episodes):
        print(f"❌ Episode index {episode_index} not found", file=sys.stderr)
        return 1

    episode = episodes[episode_index]

    # Get episode details
    episode_name = episode.get('trackName', 'Unknown Episode')
    episode_url = episode.get('episodeUrl')
    podcast_name = episode.get('collectionName', 'Unknown Podcast')

    if not episode_url:
        print("❌ No download URL found for this episode", file=sys.stderr)
        return 1

    # Create safe filename
    filename = safe_filename(f"{podcast_name} - {episode_name}") + ".mp3"
    output_path = output_dir / safe_filename(podcast_name) / filename

    print(f"🎧 Episode: {episode_name}", file=sys.stderr)
    print(f"📁 Saving to: {output_path}", file=sys.stderr)

    # Download
    try:
        result_path = api.download_episode(episode_url, output_path)

        # Output result as JSON
        result = {
            "success": True,
            "path": result_path,
            "episode": episode_name,
            "podcast": podcast_name
        }
        print(json.dumps(result, indent=2))
        return 0

    except Exception as e:
        result = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(result, indent=2))
        return 1


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Apple iTunes Podcast API Helper", file=sys.stderr)
        print("\nUsage:", file=sys.stderr)
        print("  search <keyword> [limit]              - Search for podcasts", file=sys.stderr)
        print("  episodes <collection_id> [limit]      - Get podcast episodes", file=sys.stderr)
        print("  download <collection_id> <index> [dir] - Download episode", file=sys.stderr)
        return 1

    command = sys.argv[1]
    args = sys.argv[2:]

    commands = {
        'search': cmd_search,
        'episodes': cmd_episodes,
        'download': cmd_download
    }

    if command not in commands:
        print(f"❌ Unknown command: {command}", file=sys.stderr)
        return 1

    return commands[command](args)


if __name__ == "__main__":
    sys.exit(main())
