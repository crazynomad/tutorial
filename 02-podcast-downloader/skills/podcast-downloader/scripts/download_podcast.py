#!/usr/bin/env python3
"""
Apple Podcast 下载器 - API 增强版
支持通过 iTunes API 和 RSS Feed 下载播客节目
"""

import sys
import argparse
import requests
import feedparser
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import json
import re
from datetime import datetime


def sanitize_filename(filename):
    """移除文件名中的非法字符"""
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = filename.strip('. ')
    return filename[:200] if len(filename) > 200 else filename


def extract_podcast_info(apple_url):
    """
    从 Apple Podcast URL 中提取信息
    返回: (podcast_id, episode_id, country_code)
    """
    # 提取地区代码
    country_match = re.search(r'apple\.com/([a-z]{2})/', apple_url)
    country_code = country_match.group(1) if country_match else 'us'
    
    # 提取 ID
    parsed_url = urlparse(apple_url)
    query_params = parse_qs(parsed_url.query)
    episode_id = query_params.get('i', [None])[0]
    
    id_match = re.search(r'id(\d+)', apple_url)
    podcast_id = id_match.group(1) if id_match else None
    
    return podcast_id, episode_id, country_code


def fetch_episodes_via_api(collection_id, country_code, limit=200):
    """
    通过 iTunes API 获取播客节目列表
    返回: (podcast_info, episodes_list)
    """
    api_url = f"https://itunes.apple.com/lookup?id={collection_id}&entity=podcastEpisode&country={country_code}&limit={limit}"
    
    try:
        print(f"📡 正在通过 API 获取节目信息...")
        resp = requests.get(api_url, timeout=15, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        resp.raise_for_status()
        data = resp.json()
        
        results = data.get('results', [])
        if not results:
            return None, []
        
        # 第一个是播客信息
        podcast_info = results[0] if results[0].get('wrapperType') == 'track' else {}
        
        # 后面的是单集
        episodes = [r for r in results if r.get('wrapperType') == 'podcastEpisode']
        
        return podcast_info, episodes
    
    except Exception as e:
        print(f"⚠️  API 获取失败: {e}")
        return None, []


def fetch_episode_by_id(episode_id, country_code):
    """
    直接通过单集 ID 获取信息
    """
    track_url = f"https://itunes.apple.com/lookup?id={episode_id}&entity=podcastEpisode&country={country_code}"
    
    try:
        resp = requests.get(track_url, timeout=10, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        resp.raise_for_status()
        data = resp.json()
        
        if data.get('resultCount', 0) > 0:
            return data['results'][0]
    except:
        pass
    
    return None


def get_rss_feed_url(podcast_id, country_code):
    """
    获取播客的 RSS Feed URL
    """
    lookup_url = f"https://itunes.apple.com/lookup?id={podcast_id}&country={country_code}&entity=podcast"
    
    try:
        resp = requests.get(lookup_url, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        if data.get('resultCount', 0) > 0:
            return data['results'][0].get('feedUrl')
    except:
        pass
    
    return None


def parse_rss_feed(rss_url):
    """
    解析 RSS Feed (作为 API 失败时的备选方案)
    """
    try:
        print(f"📡 正在解析 RSS Feed...")
        feed = feedparser.parse(rss_url, request_headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        
        if feed.bozo:
            print(f"⚠️  RSS 解析警告: {feed.bozo_exception}")
        
        if not feed.entries:
            return None, []
        
        podcast_info = {
            'collectionName': feed.feed.get('title', 'Unknown Podcast'),
            'artistName': feed.feed.get('author', ''),
            'feedUrl': rss_url
        }
        
        episodes = []
        for entry in feed.entries:
            audio_url = None
            for enclosure in entry.get('enclosures', []):
                if 'audio' in enclosure.get('type', ''):
                    audio_url = enclosure.get('href')
                    break
            
            if audio_url:
                episodes.append({
                    'trackName': entry.get('title', ''),
                    'releaseDate': entry.get('published', ''),
                    'episodeUrl': audio_url,
                    'description': entry.get('summary', ''),
                    'trackTimeMillis': 0  # RSS 中可能没有
                })
        
        return podcast_info, episodes
    
    except Exception as e:
        print(f"❌ RSS 解析失败: {e}")
        return None, []


def download_audio(url, output_path, episode_title):
    """下载音频文件"""
    try:
        print(f"   ⬇️  正在下载: {episode_title}")
        response = requests.get(url, stream=True, timeout=60, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
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
                        mb_downloaded = downloaded / 1024 / 1024
                        mb_total = total_size / 1024 / 1024
                        print(f"\r   进度: {progress:.1f}% ({mb_downloaded:.1f}/{mb_total:.1f} MB)", end='', flush=True)
        
        print()
        return True
    
    except Exception as e:
        print(f"\n   ❌ 下载失败: {e}")
        return False


def download_from_apple_url(apple_url, output_dir='.', download_count=None):
    """
    从 Apple Podcast URL 下载节目
    """
    print(f"🎙️  Apple Podcast 下载器 (API 增强版)")
    print(f"=" * 50)
    
    # 1. 解析 URL
    podcast_id, episode_id, country_code = extract_podcast_info(apple_url)
    
    if not podcast_id:
        print("❌ 无法解析 Podcast ID,请检查链接格式")
        return False
    
    print(f"🌍 商店地区: {country_code.upper()}")
    print(f"📂 Podcast ID: {podcast_id}")
    if episode_id:
        print(f"🎯 单集 ID: {episode_id}")
    
    # 2. 获取信息
    podcast_info = None
    episodes = []
    target_episode = None
    
    # 场景 1: 有单集 ID,直接获取该单集
    if episode_id:
        print(f"\n正在查询指定单集...")
        target_episode = fetch_episode_by_id(episode_id, country_code)
        
        if not target_episode:
            # 从列表中搜索
            print("⚠️  直接查询失败,尝试从列表中搜索...")
            podcast_info, episodes = fetch_episodes_via_api(podcast_id, country_code)
            target_episode = next((e for e in episodes if str(e.get('trackId')) == str(episode_id)), None)
        
        if target_episode:
            episodes = [target_episode]
            if not podcast_info:
                podcast_info = {'collectionName': target_episode.get('collectionName', 'Unknown')}
    
    # 场景 2: 获取播客的节目列表
    if not episodes:
        podcast_info, episodes = fetch_episodes_via_api(podcast_id, country_code)
    
    # 场景 3: API 失败,尝试 RSS
    if not episodes:
        print("⚠️  API 方法失败,尝试 RSS Feed...")
        rss_url = get_rss_feed_url(podcast_id, country_code)
        if rss_url:
            podcast_info, episodes = parse_rss_feed(rss_url)
    
    if not episodes:
        print("❌ 无法获取任何节目信息")
        return False
    
    # 3. 显示信息
    podcast_name = podcast_info.get('collectionName', 'Unknown Podcast')
    print(f"\n📻 播客: {podcast_name}")
    print(f"👤 作者: {podcast_info.get('artistName', 'Unknown')}")
    print(f"📝 可用节目数: {len(episodes)}")
    
    # 4. 确定要下载的节目
    if download_count and download_count < len(episodes):
        episodes_to_download = episodes[:download_count]
        print(f"📥 准备下载最近 {download_count} 集")
    else:
        episodes_to_download = episodes
        print(f"📥 准备下载 {len(episodes_to_download)} 集")
    
    # 5. 创建输出目录
    podcast_folder = sanitize_filename(podcast_name)
    output_path = Path(output_dir) / podcast_folder
    output_path.mkdir(parents=True, exist_ok=True)
    
    # 保存播客元数据
    metadata = {
        'podcast_name': podcast_name,
        'artist': podcast_info.get('artistName', ''),
        'country': country_code,
        'total_episodes': len(episodes),
        'download_date': datetime.now().isoformat()
    }
    with open(output_path / 'podcast_info.json', 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    # 6. 下载节目
    print(f"\n开始下载到: {output_path}")
    print("=" * 50)
    
    success_count = 0
    for idx, episode in enumerate(episodes_to_download, 1):
        title = episode.get('trackName', f'Episode {idx}')
        release_date = episode.get('releaseDate', '')[:10]
        audio_url = episode.get('episodeUrl') or episode.get('previewUrl')
        duration_ms = episode.get('trackTimeMillis', 0)
        duration_min = int(duration_ms / 1000 / 60) if duration_ms else 0
        
        print(f"\n[{idx}/{len(episodes_to_download)}] {title}")
        print(f"   📅 {release_date} | ⏱️  {duration_min} 分钟")
        
        if not audio_url:
            print("   ⚠️  未找到音频链接,跳过")
            continue
        
        # 确定文件扩展名
        parsed_url = urlparse(audio_url)
        ext = Path(parsed_url.path).suffix or '.m4a'
        
        # 生成文件名
        filename = f"{idx:03d} - {sanitize_filename(title)}{ext}"
        file_path = output_path / filename
        
        # 下载
        if download_audio(audio_url, file_path, title):
            success_count += 1
            print(f"   ✅ 已保存: {filename}")
            
            # 保存单集元数据
            episode_meta = {
                'title': title,
                'release_date': release_date,
                'duration_minutes': duration_min,
                'description': episode.get('description', ''),
                'audio_file': filename,
                'download_url': audio_url
            }
            with open(file_path.with_suffix('.json'), 'w', encoding='utf-8') as f:
                json.dump(episode_meta, f, indent=2, ensure_ascii=False)
    
    # 7. 完成
    print("\n" + "=" * 50)
    print(f"✨ 下载完成!")
    print(f"📂 输出目录: {output_path}")
    print(f"✅ 成功: {success_count}/{len(episodes_to_download)} 集")
    
    return True


def main():
    parser = argparse.ArgumentParser(
        description='Apple Podcast 下载器 (API 增强版)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 下载指定单集
  %(prog)s "https://podcasts.apple.com/cn/podcast/id123456?i=789012"
  
  # 下载最新 5 集
  %(prog)s "https://podcasts.apple.com/cn/podcast/id123456" -n 5
  
  # 下载所有可用节目 (最多 200 集)
  %(prog)s "https://podcasts.apple.com/us/podcast/id123456"
  
  # 指定输出目录
  %(prog)s "https://podcasts.apple.com/cn/podcast/id123456" -n 10 -o /path/to/output
        """
    )
    
    parser.add_argument('url', help='Apple Podcast 链接')
    parser.add_argument('-n', '--count', type=int,
                       help='下载最新 N 集 (默认下载所有可用节目)')
    parser.add_argument('-o', '--output', default='.',
                       help='输出目录 (默认: 当前目录)')
    
    args = parser.parse_args()
    
    success = download_from_apple_url(
        args.url,
        output_dir=args.output,
        download_count=args.count
    )
    
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
