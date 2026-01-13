# 第二期：Claude Skills 实战 - 播客下载工具构建

## 📺 视频主题

通过实战演示如何使用 Claude Skills 构建一个实用的播客下载工具，展示 Skills 的强大能力和实际应用价值。

## 🎯 学习目标

- 理解 Claude Skills 的核心概念和工作原理
- 掌握 Skills 的开发流程和最佳实践
- 学会将 Skills 集成到实际工作流程中
- 体验 Skills 相比 MCP 的优势（按需加载、Token 优化）

## 🗂️ 目录结构

```
02-podcast-downloader/
├── downloads/                      # 下载的播客文件（示例和测试）
│   └── 独树不成林/                # 实际下载的播客示例
├── recording/                      # ScreenFlow 录制项目文件
├── output/                         # 最终输出的视频文件
├── capcut/                         # 剪映项目文件
├── aigc/                          # AI 生成的内容素材
├── artifact/                      # 产出物和工具
│   └── podcast-downloader-v2-skill/  # 播客下载 Skill v2.0
├── transript/                     # 视频字幕文件
├── sample/                        # 示例文件和模板
├── prompt/                        # NotebookLM 提示词
└── README.md                      # 本文件
```

## 💡 内容规划

### 1. Skills 基础概念回顾
- 什么是 Claude Skills
- Skills vs MCP 的区别
- Skills 的应用场景

### 2. 播客下载 Skill 开发（v2.0 已完成）
- ✅ 需求分析：解决 Apple Podcasts 播客下载和元数据保存需求
- ✅ Skill 设计：基于 iTunes API 的增强版架构
  - 智能地区检测（cn/us/jp 等）
  - 多重回退机制（API → 列表搜索 → RSS）
  - 丰富的元数据保存
- ✅ 核心功能实现：
  - iTunes API 优先（3-5x 速度提升）
  - 支持单集下载、批量下载（最新 N 集）
  - 自动解析 Apple Podcasts URL
  - 实时进度显示
- ✅ 实战测试：成功下载「独树不成林」播客多集

### 3. Skills 集成与使用
- 如何将 Skill 加载到 Claude Code
- 实际使用场景演示
- 与 NotebookLM 的配合使用

### 4. 最佳实践总结
- Skill 开发的注意事项
- 性能优化技巧
- 常见问题与解决方案

## 🎬 制作进度

- [x] 内容准备：收集 Claude Skills 官方文档和示例
- [x] Skill 开发：完成播客下载工具 v2.0（iTunes API 增强版）
- [x] 功能测试：实际下载和验证播客功能
- [ ] NotebookLM 处理：生成学习指南和演示文稿
- [ ] 视频录制：录制完整的操作演示
- [ ] 后期制作：剪辑、添加字幕、特效
- [ ] 多平台发布：Bilibili、YouTube、抖音、小红书、微信

## 🚀 Podcast Downloader Skill v2.0 特性

### 核心功能
- **iTunes API 优先**：比传统 RSS 解析快 3-5 倍
- **智能地区检测**：自动从 URL 提取国家代码（cn/us/jp/uk 等）
- **多重回退机制**：
  1. 直接 API 查询（最快）
  2. 列表搜索（快速）
  3. RSS feed 解析（可靠回退）
- **丰富元数据**：保存标题、发布日期、时长、描述等

### 使用示例

**下载指定单集**：
```bash
python scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id1711052890?i=1000736888214"
```

**下载最新 3 集**：
```bash
python scripts/download_podcast.py "https://podcasts.apple.com/cn/podcast/id1711052890" -n 3
```

### 实际测试案例
- ✅ 「独树不成林」播客
  - 289 - 我在童年如何与权威周旋？（36MB, 40分钟）
  - 288 - 伊朗老百姓为什么这么讨厌伊斯兰共和国？（36MB, 39分钟）
  - 287 - 2025年美国政府呈现出什么总体大趋势？（32MB, 34分钟）

## 📝 相关资源

- [Claude Skills 官方文档](https://docs.anthropic.com/en/docs/build-with-claude/claude-skills)
- [第一期视频 - NotebookLM 完整工作流](../01-notebooklm/)
- [Podcast Downloader Skill v2.0](artifact/podcast-downloader-v2-skill/) - 实际开发的 Skill

## 🔗 发布平台

待视频制作完成后更新...

---

**创建日期**: 2026-01-13
**最后更新**: 2026-01-13
**状态**: 🔧 开发中（Skill v2.0 已完成）
