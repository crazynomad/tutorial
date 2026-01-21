# 第三期：Mac 磁盘空间拯救指南 - Mole 深度清理实战

## 📺 视频主题

通过实战演示如何使用 Mole 工具深度清理 Mac 磁盘空间，从安全分析到实际操作，展示如何科学、安全地释放大量存储空间。

## 🎯 学习目标

- 了解 Mac 磁盘空间被占用的常见原因
- 掌握评估开源清理工具安全性的方法
- 学会使用 Mole 进行安全的磁盘清理
- 理解白名单机制保护重要数据

## 🗂️ 目录结构

```
03-disk-cleaner/
├── recording/                     # 屏幕录制素材
├── sample/                        # 示例截图和数据
├── skills/                        # 相关 Skills（如有）
├── prompt/                        # NotebookLM 提示词
├── output/                        # 输出产物
├── artifact/                      # 打包的产出物
├── capcut/                        # 剪映项目文件
├── aigc/                          # AI 生成内容
├── downloads/                     # 下载的资源
├── transcript/                    # 视频字幕文件
└── README.md                      # 本文件
```

## 💡 内容规划

### 1. 问题引入：磁盘空间告急
- Mac 用户常见的存储焦虑
- 磁盘空间都被什么占用了？
- 为什么不推荐盲目删除

### 2. 工具选择：如何评估清理工具的安全性
- **开源项目基本信息分析**
  - Star 数量、活跃度、维护状态
  - 许可证类型（MIT 等）
  - 最新版本和更新频率
- **安全审计文档解读**
  - Zero Trust 架构设计
  - 多层防护机制
  - 受保护路径列表
- **关键安全特性**
  - 60 天规则（孤立文件保护）
  - 厂商白名单（Adobe/Microsoft/Google）
  - 自定义白名单支持
  - Dry-run 预览模式

### 3. Mole 工具介绍
- **基本信息**
  - GitHub: tw93/Mole
  - 30,000+ Stars
  - Go + Shell 实现
  - MIT 许可证
- **核心功能**
  - 用户缓存清理
  - 开发工具缓存（npm/pnpm/uv/Homebrew 等）
  - 浏览器缓存
  - 已卸载应用残留清理
  - iOS 模拟器缓存
- **安全机制**
  - 多层路径验证
  - 系统目录保护（/System, /bin, /usr 等）
  - 符号链接攻击防护
  - 原子操作和超时保护

### 4. 实战演示：从 27GB 到 74GB

#### 4.1 安装 Mole
```bash
# 方式一：Homebrew（推荐）
brew install tw93/tap/mole

# 方式二：官方脚本
curl -fsSL https://raw.githubusercontent.com/tw93/Mole/main/install.sh | bash
```

#### 4.2 预览模式（Dry-run）
```bash
mo clean --dry-run
```
- 查看将被清理的文件列表
- 分析各类别占用空间
- 确认白名单保护状态

#### 4.3 自定义白名单
```bash
# 编辑白名单文件
vim ~/.config/mole/whitelist

# 示例：保护 Python 和 Node 包缓存
/Users/*/Library/pnpm/store*
/Users/*/.cache/uv*
```

#### 4.4 执行清理
```bash
mo clean
```

#### 4.5 清理结果
| 指标 | 清理前 | 清理后 | 变化 |
|------|--------|--------|------|
| 可用空间 | 27 GB | 74 GB | +47 GB |
| 清理项目 | - | 1,173 个 | - |
| 清理分类 | - | 58 个 | - |

### 5. 清理项目详解

#### 主要清理来源
| 类别 | 释放空间 | 说明 |
|------|---------|------|
| 用户应用缓存 | 24.27 GB | 各应用产生的缓存文件 |
| HuggingFace 缓存 | 6.30 GB | AI 模型缓存 |
| ScreenFlow 缓存 | 2.19 GB | 视频编辑软件缓存 |
| Application Support | 1.35 GB | 应用支持文件中的日志和缓存 |
| VS Code 扩展/缓存 | ~1 GB | 编辑器相关缓存 |
| Xcode DerivedData | 428 MB | iOS 开发编译产物 |
| Homebrew 缓存 | 584 MB | 包管理器下载缓存 |

#### 安全保留的数据
- Playwright 缓存（测试工具）
- Ollama 模型（本地 LLM）
- JetBrains 配置
- iCloud 文档
- 用户自定义白名单项目

### 6. 最佳实践总结
- 首次使用务必先 `--dry-run` 预览
- 根据需求配置白名单保护重要缓存
- 定期清理（建议每月一次）
- 清理前确保重要项目已提交

## 🎬 制作进度

- [x] 内容准备：实际完成磁盘清理操作
- [x] 数据收集：记录清理前后的空间变化
- [x] 安全分析：完成 Mole 工具安全性评估
- [ ] NotebookLM 处理：生成学习指南
- [ ] 视频录制：录制完整的操作演示
- [ ] 后期制作：剪辑、添加字幕、特效
- [ ] 多平台发布：Bilibili、YouTube、抖音、小红书、微信

## 📊 关键数据点（用于视频展示）

### 清理效果对比图
```
清理前: ████████████████████████████████░░░░░░░░ 27GB 可用
清理后: ████████████████░░░░░░░░░░░░░░░░░░░░░░░░ 74GB 可用
                                          ↑ +47GB
```

### 空间占用 TOP 10
1. 用户应用缓存 - 24.27 GB
2. HuggingFace 缓存 - 6.30 GB
3. Simulator dyld 缓存 - 6.36 GB
4. Chrome 缓存 - 4.24 GB
5. ScreenFlow 缓存 - 2.19 GB
6. Application Support - 1.35 GB
7. 沙盒应用缓存 - 996 MB
8. Homebrew 缓存 - 584 MB
9. VS Code 扩展缓存 - 502 MB
10. Xcode DerivedData - 428 MB

## 📝 相关资源

- [Mole GitHub 仓库](https://github.com/tw93/Mole)
- [Mole 安全审计文档](https://github.com/tw93/Mole/blob/main/SECURITY_AUDIT.md)
- [第一期视频 - NotebookLM 完整工作流](../notebooklm/)
- [第二期视频 - Claude Skills 播客下载](../02-podcast-downloader/)

## 🔗 发布平台

待视频制作完成后更新...

---

**创建日期**: 2026-01-21
**最后更新**: 2026-01-21
**状态**: 📝 策划中
