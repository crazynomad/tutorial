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
├── software/              # 软件资源目录
│   ├── README.md         # 软件说明文档
│   └── ScreenFlow教程/    # ScreenFlow 教程资源
│
├── notebooklm/           # NotebookLM 相关资源
│   ├── prompt/           # 提示词模板
│   │   ├── 5w1h.md      # 5W1H 分析法提示词
│   │   └── rednote.md   # 小红书内容生成提示词
│   └── .claude/          # Claude 技能和工具
│       └── skills/       # 自定义 Claude 技能
│
└── README.md             # 本文档
```

## 🛠️ 资源分类

### 软件工具 (software/)

包含视频录制和编辑软件的安装包和使用文档：
- **Screen Studio** - 专业屏幕录制软件（Apple Silicon）
- **ScreenFlow** - Mac 平台视频编辑工具
- **使用教程** - 软件使用指南和最佳实践

详细信息请查看 [software/README.md](./software/README.md)

### NotebookLM 资源 (notebooklm/)

NotebookLM 视频制作相关的资源和工具：

#### Prompt 模板 (notebooklm/prompt/)
- **5w1h.md** - 使用 5W1H 方法分析和组织内容
- **rednote.md** - 小红书风格内容生成提示词

#### Claude 技能 (notebooklm/.claude/skills/)
- **podcast-downloader** - 播客下载和管理工具

## 🎯 使用说明

### 克隆仓库

```bash
git clone https://github.com/crazynomad/tutorial.git
cd tutorial
```

### 查看软件资源

```bash
cd software
cat README.md
```

### 使用 Prompt 模板

```bash
cd notebooklm/prompt
# 查看提示词模板
cat 5w1h.md
cat rednote.md
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

*最后更新: 2025-01-09*
