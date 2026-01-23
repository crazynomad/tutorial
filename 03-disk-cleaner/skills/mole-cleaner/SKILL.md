# Mole Cleaner - Mac 智能磁盘清理

一键式 Mac 磁盘清理工具，基于 Mole 深度清理功能，提供友好的分析报告和安全建议。

## Description

将 Mole 的 `mo clean` 功能包装成用户友好的自动化工具。自动检测环境、安装依赖、预览清理内容、生成分析报告，并在用户确认后执行清理，最后展示清理效果。

## When to Use

Use this skill when users:
- 想要清理 Mac 磁盘空间
- 提到 "清理磁盘", "释放空间", "disk cleanup", "free up space"
- 询问 "我的 Mac 空间不够了"
- 想使用 Mole 进行系统清理

## Features

- **环境自动检测**: 检查 Homebrew 和 Mole 是否已安装
- **一键安装**: 自动安装缺失的依赖
- **安全预览**: 先执行 dry-run，展示将清理的内容
- **智能分析**: 生成可读性强的清理报告和建议
- **分类展示**: 按类别显示可清理项目和空间
- **效果对比**: 清理前后的空间变化展示

## Usage

### Basic Syntax

```bash
python scripts/mole_cleaner.py [OPTIONS]
```

### Commands

**预览清理内容（推荐先执行）**:
```bash
python scripts/mole_cleaner.py --preview
```

**执行完整清理流程**:
```bash
python scripts/mole_cleaner.py --clean
```

**仅检查环境**:
```bash
python scripts/mole_cleaner.py --check
```

**查看磁盘状态**:
```bash
python scripts/mole_cleaner.py --status
```

### Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `--check` | 仅检查环境（Homebrew、Mole 是否安装） | - |
| `--preview` | 执行 dry-run 预览，生成清理报告 | - |
| `--clean` | 执行实际清理（会先预览确认） | - |
| `--status` | 显示当前磁盘使用状态 | - |
| `--auto-install` | 自动安装缺失的依赖 | False |
| `--json` | 输出 JSON 格式报告 | False |
| `--no-sample-data` | 解析失败时不使用示例数据 | False |
| `-o, --output` | 保存报告到文件 | - |

## Dependencies

**系统要求**:
- macOS 10.15+
- Python 3.8+

**自动安装的依赖**:
- Homebrew（如未安装）
- Mole（通过 `brew install tw93/tap/mole`）

## Output

### 预览报告示例

```
╔══════════════════════════════════════════════════════════════╗
║              Mole 磁盘清理分析报告                           ║
╠══════════════════════════════════════════════════════════════╣
║ 扫描时间: 2026-01-21 15:30:00                                ║
║ 当前可用空间: 27 GB / 926 GB                                 ║
╚══════════════════════════════════════════════════════════════╝

📊 可清理项目分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗂️  用户应用缓存                                    24.27 GB
    └── 各应用产生的临时缓存文件，清理后会自动重建

🤖 AI 模型缓存                                       6.30 GB
    └── HuggingFace 模型缓存，如不使用可清理

🌐 浏览器缓存                                        4.24 GB
    └── Chrome/Safari 等浏览器缓存数据

📱 iOS 模拟器缓存                                    6.36 GB
    └── Xcode Simulator dyld 缓存

🎬 应用专属缓存                                      2.19 GB
    └── ScreenFlow 等应用的项目缓存

📦 包管理器缓存                                      1.58 GB
    └── Homebrew、npm 等包管理器下载缓存

💻 开发工具缓存                                      0.93 GB
    └── VS Code、Xcode DerivedData 等

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 预计可释放空间: 45.87 GB
📁 涉及文件数量: 1,173 个
📂 涉及目录数量: 58 个

💡 建议:
  ✅ 用户缓存 - 安全清理，不影响应用功能
  ✅ 浏览器缓存 - 安全清理，会自动重建
  ⚠️  AI 模型缓存 - 如常用 HuggingFace 建议保留
  ⚠️  iOS 模拟器 - iOS 开发者建议保留

🔒 已保护项目（不会清理）:
  • Playwright 缓存
  • Ollama 模型
  • JetBrains 配置
  • iCloud 文档
```

### 清理效果展示

```
╔══════════════════════════════════════════════════════════════╗
║              清理完成！效果对比                              ║
╠══════════════════════════════════════════════════════════════╣

清理前: ████████████████████████████████░░░░░░░░  27 GB 可用
清理后: ████████████████░░░░░░░░░░░░░░░░░░░░░░░░  74 GB 可用
                                              ↑ +47 GB

📊 清理统计:
  • 清理文件: 1,173 个
  • 清理目录: 58 个
  • 释放空间: 47 GB
  • 耗时: 2 分 15 秒

╚══════════════════════════════════════════════════════════════╝
```

## Claude Integration

When user requests disk cleanup:

1. **Read skill documentation**:
   ```
   Read the SKILL.md file first
   ```

2. **Check environment and preview**:
   ```bash
   python scripts/mole_cleaner.py --preview --auto-install
   ```

3. **Show report to user and ask for confirmation**

4. **If confirmed, execute cleanup**:
   ```bash
   python scripts/mole_cleaner.py --clean
   ```

5. **Show cleanup results**

## Workflow

```
┌─────────────────┐
│   用户请求清理   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  1. 环境检测     │ ──→ Homebrew? Mole?
└────────┬────────┘
         │ 缺失则安装
         ▼
┌─────────────────┐
│  2. 磁盘状态     │ ──→ 当前可用空间
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Dry-run     │ ──→ mo clean --dry-run
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. 解析输出     │ ──→ 分类统计
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. 生成报告     │ ──→ 可读性报告 + 建议
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. 用户确认     │ ──→ 是否执行清理?
└────────┬────────┘
         │ 确认
         ▼
┌─────────────────┐
│  7. 执行清理     │ ──→ mo clean
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  8. 效果展示     │ ──→ 前后对比
└─────────────────┘
```

## Safety Features

- **预览优先**: 默认先执行 dry-run，不直接清理
- **白名单保护**: 继承 Mole 的白名单机制
- **用户确认**: 清理前需要明确确认
- **详细报告**: 清楚展示将清理的每个类别
- **可逆建议**: 标注哪些清理是安全可逆的

## Limitations

- 仅支持 macOS
- 需要 Homebrew（会自动安装）
- 交互式清理需要终端支持
- 某些系统目录需要管理员权限

## Common Issues

**Q: 安装 Mole 失败?**
A: 检查网络连接，或手动运行 `brew install tw93/tap/mole`

**Q: 清理后空间没变化?**
A: macOS 可能需要几分钟更新显示，或重启 Finder

**Q: 想保留某些缓存?**
A: 编辑 `~/.config/mole/whitelist` 添加白名单路径

**Q: 报告显示乱码?**
A: 确保终端支持 UTF-8 编码

## Example Conversation

**User**: "我的 Mac 磁盘空间不够了，帮我清理一下"

**Claude**:
```bash
# 1. 先预览清理内容
python /path/to/skills/mole-cleaner/scripts/mole_cleaner.py --preview --auto-install

# 2. 展示报告给用户，询问是否执行

# 3. 用户确认后执行清理
python /path/to/skills/mole-cleaner/scripts/mole_cleaner.py --clean
```

---

**User**: "检查一下我电脑上有没有安装 Mole"

**Claude**:
```bash
python /path/to/skills/mole-cleaner/scripts/mole_cleaner.py --check
```

## Version History

**v1.0** (2026-01-21)
- 初始版本
- 环境检测和自动安装
- Dry-run 预览和报告生成
- 清理执行和效果展示

## References

- [Mole GitHub](https://github.com/tw93/Mole)
- [Mole 安全审计文档](https://github.com/tw93/Mole/blob/main/SECURITY_AUDIT.md)
- [Homebrew](https://brew.sh/)

## License

MIT License. 请遵守 Mole 的使用条款。
