# Mole Cleaner Plus - Mac 智能文件整理助手

专注于用户文件整理的增强工具，补充 Mole 的系统清理功能。通过“高情商”的 Smart Folder 引导方式，帮助用户安全地发现并清理大文件、备份和社交软件缓存。

## Description

Mole Cleaner Plus 是 Mole 的深度扩展，它不直接删除系统垃圾，而是专注于用户个人的文件整理。它通过生成 macOS 原生的智能文件夹（Smart Folder），让用户在熟悉的 Finder 环境中自主决策，从而达到释放空间的目的。

## When to Use

Use this skill when users:
- 想要整理个人文件（视频、文档、照片）
- 发现磁盘被 iOS 备份或微信缓存占满
- 想要“安全地”清理大文件，而不是交给机器自动处理
- 寻求比单纯系统清理更深层次的磁盘空间优化

## Features

- **🥇 大文件安全清理**: 生成 Smart Folder 引导用户在 Finder 中清理旧视频、文档和音频。
- **📱 iOS 备份管理**: 扫描并识别旧设备或重复的 iOS 备份。
- **💬 社交软件清理**: 分析微信、QQ 缓存分布并提供清理建议。
- **📸 相似照片检测**: 利用感知哈希技术发现连拍或重复照片。
- **🕰️ 长期未使用分析**: 找出长时间未变动的大型文件。

## Usage

*(开发中 - 见 PLAN.md)*

### 核心命令规划

```bash
python scripts/smart_cleaner.py --large-files     # 大文件安全清理 + Smart Folder
python scripts/smart_cleaner.py --ios-backups     # iOS 备份管理
python scripts/smart_cleaner.py --wechat          # 微信缓存清理
```

## Workflow

1. **扫描分析**: 扫描用户目录，按大小和时间戳分类。
2. **生成报告**: 展示可视化统计信息和清理建议。
3. **创建智能文件夹**: 自动生成 `.savedSearch` 文件。
4. **引导决策**: 自动打开 Finder，用户手动备份或删除。

## Safety Features

- **不直接删除**: 核心功能通过 Smart Folder 引导，最终删除权在用户手中。
- **双重保护**: 内置严密的受保护路径和扩展名清单。
- **回收站机制**: 所有删除操作优先移至废纸篓。

## References

- [PLAN.md](./PLAN.md) - 详细功能规划和技术实现细节
