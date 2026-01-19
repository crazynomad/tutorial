#!/usr/bin/env python3
"""
YouTube/视频下载器 - 基于 yt-dlp
支持 YouTube、Bilibili、Twitter、TikTok 等 1000+ 网站
"""

import sys
import argparse
import subprocess
import json
import re
from pathlib import Path
from datetime import datetime


def check_ytdlp_installed():
    """检查 yt-dlp 是否安装"""
    try:
        result = subprocess.run(
            ['yt-dlp', '--version'],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(f"✅ yt-dlp 版本: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass

    print("❌ yt-dlp 未安装，请运行: pip install yt-dlp")
    return False


def check_ffmpeg_installed():
    """检查 ffmpeg 是否安装（用于音频提取）"""
    try:
        result = subprocess.run(
            ['ffmpeg', '-version'],
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def sanitize_filename(filename):
    """移除文件名中的非法字符"""
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    filename = filename.strip('. ')
    return filename[:200] if len(filename) > 200 else filename


def get_video_info(url, cookies_file=None):
    """获取视频信息（不下载）"""
    cmd = ['yt-dlp', '-j', '--no-download', url]

    if cookies_file:
        cmd.extend(['--cookies', cookies_file])

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if result.returncode == 0:
            return json.loads(result.stdout)
    except (subprocess.TimeoutExpired, json.JSONDecodeError) as e:
        print(f"⚠️  获取视频信息失败: {e}")

    return None


def build_ytdlp_command(url, output_dir, format_quality='best', audio_only=False,
                        subtitles=False, sub_lang='en,zh-Hans', cookies_file=None,
                        is_playlist=False, playlist_count=None, download_thumbnail=False):
    """构建 yt-dlp 命令"""
    cmd = ['yt-dlp']

    # 输出模板
    if is_playlist:
        output_template = str(Path(output_dir) / '%(playlist_title)s' / '%(playlist_index)03d - %(title)s [%(id)s].%(ext)s')
    else:
        output_template = str(Path(output_dir) / '%(title)s [%(id)s].%(ext)s')

    cmd.extend(['-o', output_template])

    # 格式选择
    if audio_only:
        cmd.extend(['-x', '--audio-format', 'mp3', '--audio-quality', '0'])
    else:
        format_map = {
            'best': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '1080': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best',
            '720': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
            '480': 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best',
            '360': 'bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/best',
        }
        format_str = format_map.get(format_quality, format_map['best'])
        cmd.extend(['-f', format_str])

    # 字幕
    if subtitles:
        cmd.extend([
            '--write-subs',
            '--write-auto-subs',
            '--sub-langs', sub_lang,
            '--convert-subs', 'srt'
        ])

    # 缩略图
    if download_thumbnail:
        cmd.append('--write-thumbnail')

    # 元数据
    cmd.extend(['--write-info-json'])

    # Cookies（用于需要登录的内容）
    if cookies_file:
        cmd.extend(['--cookies', cookies_file])

    # 播放列表选项
    if is_playlist:
        if playlist_count:
            cmd.extend(['--playlist-end', str(playlist_count)])
    else:
        cmd.append('--no-playlist')

    # 其他常用选项
    cmd.extend([
        '--no-overwrites',          # 不覆盖已存在的文件
        '--continue',               # 断点续传
        '--embed-metadata',         # 嵌入元数据
        '--progress',               # 显示进度
        '--console-title',          # 在终端标题显示进度
        '--restrict-filenames',     # 限制文件名字符
    ])

    cmd.append(url)

    return cmd


def download_video(url, output_dir='.', format_quality='best', audio_only=False,
                   subtitles=False, sub_lang='en,zh-Hans', cookies_file=None,
                   is_playlist=False, playlist_count=None, save_metadata=True,
                   download_thumbnail=False):
    """
    下载视频
    """
    print("🎬 YouTube/视频下载器 (yt-dlp)")
    print("=" * 50)

    # 检查依赖
    if not check_ytdlp_installed():
        return False

    if audio_only and not check_ffmpeg_installed():
        print("⚠️  警告: ffmpeg 未安装，音频提取可能失败")
        print("   请安装: brew install ffmpeg (macOS) 或 apt install ffmpeg (Linux)")

    # 创建输出目录
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"\n📂 输出目录: {output_path.absolute()}")
    print(f"🔗 URL: {url}")
    print(f"📊 格式: {'音频 (MP3)' if audio_only else format_quality}")
    if subtitles:
        print(f"📝 字幕: {sub_lang}")
    if is_playlist:
        count_str = f"前 {playlist_count} 个" if playlist_count else "全部"
        print(f"📋 播放列表模式: {count_str}")

    # 获取视频信息
    print("\n📡 正在获取视频信息...")
    info = get_video_info(url, cookies_file)

    if info:
        if 'title' in info:
            print(f"📺 标题: {info.get('title', 'Unknown')}")
        if 'uploader' in info:
            print(f"👤 作者: {info.get('uploader', 'Unknown')}")
        if 'duration' in info and info['duration']:
            duration_min = info['duration'] // 60
            duration_sec = info['duration'] % 60
            print(f"⏱️  时长: {duration_min}:{duration_sec:02d}")
        if 'view_count' in info and info['view_count']:
            print(f"👁️  观看: {info['view_count']:,}")

    # 构建命令
    cmd = build_ytdlp_command(
        url=url,
        output_dir=output_dir,
        format_quality=format_quality,
        audio_only=audio_only,
        subtitles=subtitles,
        sub_lang=sub_lang,
        cookies_file=cookies_file,
        is_playlist=is_playlist,
        playlist_count=playlist_count,
        download_thumbnail=download_thumbnail
    )

    # 执行下载
    print("\n" + "=" * 50)
    print("⬇️  开始下载...")
    print()

    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True
        )

        # 实时输出进度
        for line in process.stdout:
            print(line, end='')

        process.wait()

        if process.returncode == 0:
            print("\n" + "=" * 50)
            print("✨ 下载完成!")
            print(f"📂 文件保存在: {output_path.absolute()}")

            # 列出下载的文件
            print("\n📁 下载的文件:")
            for f in sorted(output_path.rglob('*')):
                if f.is_file() and not f.name.startswith('.'):
                    size_mb = f.stat().st_size / 1024 / 1024
                    rel_path = f.relative_to(output_path)
                    print(f"   • {rel_path} ({size_mb:.1f} MB)")

            return True
        else:
            print(f"\n❌ 下载失败，退出码: {process.returncode}")
            return False

    except subprocess.SubprocessError as e:
        print(f"\n❌ 下载出错: {e}")
        return False
    except KeyboardInterrupt:
        print("\n\n⚠️  下载被用户中断")
        return False


def main():
    parser = argparse.ArgumentParser(
        description='YouTube/视频下载器 (基于 yt-dlp)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 下载单个视频 (最佳质量)
  %(prog)s "https://www.youtube.com/watch?v=VIDEO_ID"

  # 下载 1080p 视频
  %(prog)s "https://www.youtube.com/watch?v=VIDEO_ID" -f 1080

  # 只提取音频 (MP3)
  %(prog)s "https://www.youtube.com/watch?v=VIDEO_ID" --audio-only

  # 下载带字幕
  %(prog)s "https://www.youtube.com/watch?v=VIDEO_ID" --subtitles

  # 下载播放列表的前 5 个视频
  %(prog)s "https://www.youtube.com/playlist?list=PLAYLIST_ID" --playlist -n 5

  # 指定输出目录
  %(prog)s "URL" -o /path/to/output

支持的网站: YouTube, Bilibili, Twitter/X, TikTok, Vimeo 等 1000+ 网站
完整列表: yt-dlp --list-extractors
        """
    )

    parser.add_argument('url', help='视频或播放列表 URL')
    parser.add_argument('-o', '--output', default='.',
                        help='输出目录 (默认: 当前目录)')
    parser.add_argument('-f', '--format', default='best',
                        choices=['best', '1080', '720', '480', '360'],
                        help='视频质量 (默认: best)')
    parser.add_argument('--audio-only', action='store_true',
                        help='只提取音频 (MP3 格式)')
    parser.add_argument('--subtitles', action='store_true',
                        help='下载字幕')
    parser.add_argument('--sub-lang', default='en,zh-Hans',
                        help='字幕语言 (默认: en,zh-Hans)')
    parser.add_argument('--playlist', action='store_true',
                        help='启用播放列表下载')
    parser.add_argument('-n', '--count', type=int,
                        help='播放列表中下载的视频数量')
    parser.add_argument('--thumbnail', action='store_true',
                        help='下载缩略图')
    parser.add_argument('--cookies', type=str,
                        help='Cookies 文件路径 (用于需要登录的内容)')
    parser.add_argument('--no-metadata', action='store_true',
                        help='不保存元数据 JSON')

    args = parser.parse_args()

    success = download_video(
        url=args.url,
        output_dir=args.output,
        format_quality=args.format,
        audio_only=args.audio_only,
        subtitles=args.subtitles,
        sub_lang=args.sub_lang,
        cookies_file=args.cookies,
        is_playlist=args.playlist,
        playlist_count=args.count,
        save_metadata=not args.no_metadata,
        download_thumbnail=args.thumbnail
    )

    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())
