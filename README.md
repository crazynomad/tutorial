# Tutorial Resources 教程资源库

> 这是一个教程资源分享仓库，包含我在制作教学视频过程中使用和分享的各类资源。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Public Repository](https://img.shields.io/badge/Visibility-Public-brightgreen)](https://github.com/crazynomad/tutorial)

## 📚 仓库简介

本仓库用于存储和分享教学视频制作过程中的各类资源，包括：
- 软件工具和使用文档
- 视频制作脚本和模板
- AI 辅助工具和提示词
- 技术教程和最佳实践

## 📁 目录结构

```
tutorial/
├── notebooklm/                    # 第一期：NotebookLM 完整工作流教程
│   ├── downloads/                 # 源材料
│   ├── recording/                 # ScreenFlow 录制文件
│   ├── output/                    # 最终视频输出
│   ├── artifact/                  # NotebookLM 生成的产出物
│   ├── transript/                 # 视频字幕
│   ├── prompt/                    # 提示词模板
│   │   ├── 5w1h.md               # 5W1H 分析法
│   │   └── rednote.md            # 小红书内容生成
│   └── README.md                  # 第一期教程文档
│
├── 02-podcast-downloader/         # 第二期：Claude Skills 播客下载工具
│   ├── downloads/                 # 源材料
│   ├── recording/                 # ScreenFlow 录制文件
│   ├── output/                    # 最终视频输出
│   ├── artifact/                  # NotebookLM 生成的产出物
│   ├── skills/                    # Claude Skills 代码
│   ├── prompt/                    # 提示词模板
│   └── README.md                  # 第二期教程文档
│
├── software/                      # 软件资源目录
│   ├── README.md                 # 软件说明文档
│   └── ScreenFlow教程/            # ScreenFlow 教程资源
│
└── README.md                      # 本文档
```

## 🛠️ 资源分类

### 🎥 视频教程系列

#### 第一期：NotebookLM 完整工作流 (notebooklm/)

**主题**：2026年的 NotebookLM🔥 也太强了！10分钟速通 Claude Skills

**内容**：
- 完整的 C.O.D.E 工作流演示（收集→整理→消化→表达）
- 5W1H 结构化信息图生成
- NotebookLM 多形式内容输出（演示文稿、播客、图文）
- 多平台发布策略（Bilibili、YouTube、抖音、小红书、微信）

**资源**：
- 📝 提示词模板：5W1H 分析法、小红书内容生成
- 🎨 NotebookLM 产出物：演示文稿、信息图、图文内容
- 📹 完整视频字幕

详细信息请查看 [notebooklm/README.md](./notebooklm/README.md)

#### 第二期：Claude Skills 播客下载工具 (02-podcast-downloader/)

**主题**：Claude Skills 实战 - 从零构建播客下载工具

**内容**（筹备中）：
- Claude Skills 核心概念和工作原理
- Skills vs MCP 的优势对比
- 实战开发播客下载 Skill
- Skills 集成与最佳实践

**资源**：
- 💻 Claude Skills 完整代码
- 📝 NotebookLM 学习指南
- 🎨 教学演示文稿

详细信息请查看 [02-podcast-downloader/README.md](./02-podcast-downloader/README.md)

### 软件工具 (software/)

包含视频录制和编辑软件的安装包和使用文档：
- **Screen Studio** - 专业屏幕录制软件（Apple Silicon）
- **ScreenFlow** - Mac 平台视频编辑工具
- **使用教程** - 软件使用指南和最佳实践

详细信息请查看 [software/README.md](./software/README.md)

## 🎯 使用说明

### 克隆仓库

```bash
git clone https://github.com/crazynomad/tutorial.git
cd tutorial
```

### 查看教程资源

```bash
# 第一期：NotebookLM 工作流
cd notebooklm
cat README.md

# 第二期：Claude Skills 播客下载
cd 02-podcast-downloader
cat README.md
```

### 使用 Prompt 模板

```bash
cd notebooklm/prompt
# 查看提示词模板
cat 5w1h.md
cat rednote.md
```

### 查看软件资源

```bash
cd software
cat README.md
```

## 📝 关于隐私保护

为保护创作过程中的私密信息，以下内容不会提交到仓库：

### 已忽略的文件类型
- ✅ 视频文件 (mp4, mov, avi 等)
- ✅ 音频文件 (mp3, wav, m4a 等)
- ✅ 软件安装包 (dmg, iso, exe 等)
- ✅ 图片文件 (jpg, png, gif 等)
- ✅ 项目文件 (ScreenFlow, CapCut 等)

### 已忽略的目录
- ✅ `notebooklm/downloads/` - 下载的资源文件
- ✅ `notebooklm/aigc/` - AI 生成的内容
- ✅ `notebooklm/recording/` - 录制的原始素材
- ✅ `notebooklm/output/` - 输出的成品文件
- ✅ `notebooklm/sample/` - 示例素材
- ✅ `notebooklm/capcut/` - 剪映项目文件

## 🤝 贡献

欢迎提出建议和改进意见！

如果你发现有用的资源或工具，欢迎：
1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：
- GitHub Issues: [提交问题](https://github.com/crazynomad/tutorial/issues)
- Repository: [crazynomad/tutorial](https://github.com/crazynomad/tutorial)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**持续更新中...** 🚀

*最后更新: 2026-01-13*
