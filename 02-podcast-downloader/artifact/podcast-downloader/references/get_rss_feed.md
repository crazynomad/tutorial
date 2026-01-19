# 如何获取 Apple Podcasts RSS Feed URL

## 方法 1: 通过 Apple Podcasts 网页版

1. 在浏览器中打开 Apple Podcasts 网页版 (podcasts.apple.com)
2. 搜索并打开你想下载的播客
3. 在播客页面，查看浏览器地址栏的 URL
4. 复制 URL 中的播客 ID (通常是 `id` 后面的数字)
5. 使用以下格式构建 RSS feed URL:
   ```
   https://podcasts.apple.com/lookup?id=[PODCAST_ID]&entity=podcast
   ```
6. 访问该 URL，在返回的 JSON 中找到 `feedUrl` 字段

**示例:**
- 播客页面: `https://podcasts.apple.com/us/podcast/corecursive/id1330329512`
- Podcast ID: `1330329512`
- Lookup URL: `https://podcasts.apple.com/lookup?id=1330329512&entity=podcast`
- 在返回的 JSON 中找到 `feedUrl`

## 方法 2: 通过 Apple Podcasts iOS App

1. 在 iOS 设备上打开 Apple Podcasts app
2. 找到你想下载的播客
3. 点击播客封面进入详情页
4. 点击右上角的 **分享** 图标 (方框带向上箭头)
5. 选择 **拷贝链接**
6. 使用方法 1 的步骤从链接中提取 RSS feed URL

## 方法 3: 使用在线工具

有一些在线工具可以帮助你获取 RSS feed URL:
- PodLink (pod.link) - 输入 Apple Podcasts 链接自动获取 RSS feed
- Podcast RSS Finder - 搜索播客名称获取 RSS feed

## 常见播客平台的 RSS Feed

大多数播客都会在多个平台发布，你也可以从以下平台获取 RSS feed:

- **小宇宙**: 播客详情页可能会显示 RSS 地址
- **喜马拉雅**: 部分播客提供 RSS feed
- **直接从播客官网**: 很多播客会在官网提供 RSS feed URL

## 注意事项

- RSS feed URL 通常以 `.rss` 或 `.xml` 结尾
- 有些播客可能需要订阅才能访问 RSS feed
- RSS feed URL 是公开的，不需要 Apple ID 即可访问
- 获取到 RSS feed URL 后就可以使用任何 RSS 阅读器或下载工具访问
