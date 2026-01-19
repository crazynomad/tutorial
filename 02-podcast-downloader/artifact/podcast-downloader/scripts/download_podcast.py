#!/usr/bin/env python3
"""
Podcast downloader script for Apple Podcasts (via RSS feed).
Supports downloading specific episodes or the latest N episodes.
"""

import sys
import argparse
import feedparser
import requests
from pathlib import Path
from urllib.parse import urlparse
import json
import re
from datetime import datetime


def sanitize_filename(filename):
    """Remove invalid characters from filename."""
    # Replace invalid characters with underscore
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Remove leading/trailing spaces and dots
    filename = filename.strip('. ')
    # Limit length to 200 characters
    return filename[:200] if len(filename) > 200 else filename


def parse_podcast_feed(rss_url):
    """Parse podcast RSS feed and return episodes list."""
    try:
        feed = feedparser.parse(rss_url)
        if feed.bozo:
            print(f"⚠️  Warning: Feed parsing had issues: {feed.bozo_exception}")
        
        if not feed.entries:
            print("❌ No episodes found in the feed.")
            return None, []
        
        # Extract podcast info
        podcast_info = {
            'title': feed.feed.get('title', 'Unknown Podcast'),
            'description': feed.feed.get('description', ''),
            'author': feed.feed.get('author', ''),
            'link': feed.feed.get('link', ''),
            'image': feed.feed.get('image', {}).get('href', '')
        }
        
        # Extract episodes
        episodes = []
        for idx, entry in enumerate(feed.entries, 1):
            # Find audio enclosure
            audio_url = None
            for enclosure in entry.get('enclosures', []):
                if 'audio' in enclosure.get('type', ''):
                    audio_url = enclosure.get('href')
                    break
            
            if not audio_url:
                continue
            
            episode = {
                'index': idx,
                'title': entry.get('title', f'Episode {idx}'),
                'description': entry.get('summary', ''),
                'published': entry.get('published', ''),
                'duration': entry.get('itunes_duration', ''),
                'audio_url': audio_url,
                'episode_number': entry.get('itunes_episode', ''),
                'season': entry.get('itunes_season', '')
            }
            episodes.append(episode)
        
        return podcast_info, episodes
    
    except Exception as e:
        print(f"❌ Error parsing feed: {e}")
        return None, []


def download_audio(url, output_path, episode_title):
    """Download audio file with progress indication."""
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        progress = (downloaded / total_size) * 100
                        print(f"\r   Downloading: {progress:.1f}%", end='', flush=True)
        
        print()  # New line after progress
        return True
    
    except Exception as e:
        print(f"\n❌ Error downloading audio: {e}")
        return False


def download_episodes(rss_url, output_dir, count=None, episode_index=None):
    """
    Download podcast episodes.
    
    Args:
        rss_url: RSS feed URL
        output_dir: Output directory path
        count: Number of latest episodes to download (None = all)
        episode_index: Specific episode index to download (1-based)
    """
    print(f"🎙️  Fetching podcast feed from: {rss_url}")
    
    podcast_info, episodes = parse_podcast_feed(rss_url)
    
    if not podcast_info:
        return False
    
    print(f"\n📻 Podcast: {podcast_info['title']}")
    print(f"📝 Total episodes available: {len(episodes)}")
    
    # Create output directory
    podcast_name = sanitize_filename(podcast_info['title'])
    output_path = Path(output_dir) / podcast_name
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Save podcast metadata
    metadata_path = output_path / 'podcast_info.json'
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(podcast_info, f, indent=2, ensure_ascii=False)
    
    # Determine which episodes to download
    if episode_index:
        if episode_index < 1 or episode_index > len(episodes):
            print(f"❌ Invalid episode index: {episode_index}. Valid range: 1-{len(episodes)}")
            return False
        episodes_to_download = [episodes[episode_index - 1]]
        print(f"\n📥 Downloading episode #{episode_index}")
    elif count:
        episodes_to_download = episodes[:min(count, len(episodes))]
        print(f"\n📥 Downloading latest {len(episodes_to_download)} episode(s)")
    else:
        episodes_to_download = episodes
        print(f"\n📥 Downloading all {len(episodes_to_download)} episode(s)")
    
    # Download episodes
    success_count = 0
    for episode in episodes_to_download:
        print(f"\n🎵 Episode {episode['index']}: {episode['title']}")
        
        # Determine file extension from URL
        parsed_url = urlparse(episode['audio_url'])
        ext = Path(parsed_url.path).suffix or '.mp3'
        
        # Create filename with episode number
        ep_num = episode['episode_number'] or episode['index']
        filename = f"{ep_num:03d} - {sanitize_filename(episode['title'])}{ext}"
        file_path = output_path / filename
        
        # Download audio
        if download_audio(episode['audio_url'], file_path, episode['title']):
            success_count += 1
            print(f"   ✅ Saved to: {filename}")
            
            # Save episode metadata
            episode_metadata = {
                'title': episode['title'],
                'description': episode['description'],
                'published': episode['published'],
                'duration': episode['duration'],
                'audio_file': filename
            }
            metadata_file = file_path.with_suffix('.json')
            with open(metadata_file, 'w', encoding='utf-8') as f:
                json.dump(episode_metadata, f, indent=2, ensure_ascii=False)
    
    print(f"\n✨ Download complete!")
    print(f"   📂 Output directory: {output_path}")
    print(f"   ✅ Successfully downloaded: {success_count}/{len(episodes_to_download)} episode(s)")
    
    return True


def main():
    parser = argparse.ArgumentParser(
        description='Download podcasts from Apple Podcasts RSS feed',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Download latest 5 episodes
  %(prog)s "https://feeds.example.com/podcast.rss" -n 5
  
  # Download specific episode (e.g., episode #3)
  %(prog)s "https://feeds.example.com/podcast.rss" -e 3
  
  # Download all episodes
  %(prog)s "https://feeds.example.com/podcast.rss"
        """
    )
    
    parser.add_argument('rss_url', help='Podcast RSS feed URL')
    parser.add_argument('-n', '--count', type=int, 
                       help='Number of latest episodes to download')
    parser.add_argument('-e', '--episode', type=int,
                       help='Specific episode index to download (1-based)')
    parser.add_argument('-o', '--output', default='.',
                       help='Output directory (default: current directory)')
    
    args = parser.parse_args()
    
    if args.count and args.episode:
        print("❌ Cannot specify both --count and --episode")
        return 1
    
    success = download_episodes(
        args.rss_url,
        args.output,
        count=args.count,
        episode_index=args.episode
    )
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
