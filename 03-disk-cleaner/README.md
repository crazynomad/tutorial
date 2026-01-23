# 第三期：Mac 磁盘空间拯救指南 - Mole 多合一优化实战

## 📺 视频主题

通过实战演示如何使用 Mole 这款多合一 macOS 优化工具。Mole 将 CleanMyMac、AppCleaner、DaisyDisk、iStat Menus 的功能整合到一个命令行工具中，涵盖深度清理、应用卸载、磁盘分析、系统监控等全方位功能。

## 🎯 学习目标

- 了解 Mac 磁盘空间被占用的常见原因
- 掌握评估开源清理工具安全性的方法
- 学会使用 Mole 进行安全的磁盘清理（`mo clean`）
- 掌握彻底卸载应用及残留清理（`mo uninstall`）
- 学会可视化分析磁盘占用（`mo analyze`）
- 了解开发者专属的构建产物清理（`mo purge`）
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
  - 定位：CleanMyMac + AppCleaner + DaisyDisk + iStat Menus 多合一
- **完整命令列表**
  | 命令 | 功能 | 替代工具 |
  |------|------|----------|
  | `mo` | 交互式主菜单 | - |
  | `mo clean` | 深度系统清理 | CleanMyMac |
  | `mo uninstall` | 彻底卸载应用 | AppCleaner |
  | `mo analyze` | 可视化磁盘分析 | DaisyDisk |
  | `mo status` | 实时系统监控 | iStat Menus |
  | `mo purge` | 清理构建产物 | - |
  | `mo installer` | 清理安装包 | - |
  | `mo optimize` | 系统优化 | - |
  | `mo touchid` | 配置 Touch ID sudo | - |
- **安全机制**
  - 多层路径验证
  - 系统目录保护（/System, /bin, /usr 等）
  - 符号链接攻击防护
  - 原子操作和超时保护
  - `--dry-run` 预览模式

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

### 6. 应用彻底卸载：`mo uninstall`

**功能定位**：替代 AppCleaner，彻底删除应用及所有残留文件

#### 6.1 基本用法
```bash
mo uninstall
```

#### 6.2 交互界面
- 复选框选择要卸载的应用
- 显示应用大小和新旧标签（Old/Recent）
- 确认前预览清理详情

#### 6.3 清理范围（12+ 个位置）
| 位置 | 说明 |
|------|------|
| Application Bundle | 主程序 (.app) |
| Application Support | 应用支持文件 |
| Caches | 缓存文件 |
| Preferences | 偏好设置 (.plist) |
| Logs | 日志文件 |
| WebKit Storage | 网页存储数据 |
| Cookies | Cookie 文件 |
| Extensions | 扩展插件 |
| Plugins | 插件文件 |
| Launch Agents | 用户启动项 |
| Launch Daemons | 系统启动项 |
| Saved Application State | 应用状态 |

#### 6.4 示例效果
```
卸载 Photoshop 2024:
- 清理相关文件: 52 个
- 涉及位置: 12 处
- 释放空间: 12.8 GB
```

### 7. 磁盘可视化分析：`mo analyze`

**功能定位**：替代 DaisyDisk，可视化探索磁盘占用

#### 7.1 基本用法
```bash
mo analyze
```

#### 7.2 交互操作
| 按键 | 功能 |
|------|------|
| ↑↓←→ | 导航浏览 |
| O | 打开文件/文件夹 |
| F | 在 Finder 中显示 |
| ⌫ | 删除选中项 |
| L | 查看大文件列表 |
| Q | 退出 |

#### 7.3 显示信息
- 按占用百分比排序
- 显示文件夹/文件大小
- 支持按大小和时间排序

### 8. 开发者工具：`mo purge`

**功能定位**：专为开发者设计，清理项目构建产物

#### 8.1 基本用法
```bash
mo purge
```

#### 8.2 清理目标
- `node_modules` - Node.js 依赖
- `target` - Rust/Java 构建产物
- `build` - 通用构建目录
- `dist` - 打包输出
- `venv` - Python 虚拟环境
- `.next` - Next.js 构建缓存
- `__pycache__` - Python 字节码

#### 8.3 配置扫描路径
```bash
# 设置自定义扫描目录
mo purge --paths

# 或直接编辑配置文件
vim ~/.config/mole/purge_paths
```

默认扫描：`~/Projects`, `~/GitHub`, `~/dev`

#### 8.4 安全机制
- 最近 7 天内修改的项目默认不选中
- 交互式确认，避免误删活跃项目

### 9. 其他实用功能

#### 9.1 安装包清理：`mo installer`
```bash
mo installer
```
搜索位置：Downloads、Desktop、Homebrew 缓存、iCloud、邮件附件

#### 9.2 系统优化：`mo optimize`
```bash
mo optimize
```
执行操作：
- 重建系统数据库
- 清理诊断/崩溃日志
- 刷新 Finder 和 Dock
- 重建 Spotlight 索引
- 重置网络服务

#### 9.3 实时监控：`mo status`
```bash
mo status
```
显示内容：
- 系统健康评分（0-100）
- CPU 负载和各核心使用率
- 内存使用情况
- 磁盘 I/O 读写速度
- 电池状态和温度
- 网络带宽

#### 9.4 Touch ID 配置：`mo touchid`
```bash
mo touchid
```
为 sudo 命令配置指纹验证，提升终端使用体验

### 10. 最佳实践总结

#### 通用建议
- 首次使用任何清理命令，务必先 `--dry-run` 预览
- 根据需求配置白名单保护重要缓存
- 定期清理（建议每月一次）
- 清理前确保重要项目已提交

#### 各功能使用建议
| 功能 | 使用频率 | 注意事项 |
|------|---------|----------|
| `mo clean` | 每月 | 配置好白名单后再执行 |
| `mo uninstall` | 按需 | 确认应用确实不再使用 |
| `mo analyze` | 按需 | 用于排查大文件占用 |
| `mo purge` | 每周 | 开发者清理旧项目依赖 |
| `mo optimize` | 每月 | 系统变慢时使用 |
| `mo status` | 随时 | 监控系统健康状态 |

## 🎬 制作进度

- [x] 内容准备：实际完成磁盘清理操作
- [x] 数据收集：记录清理前后的空间变化
- [x] 安全分析：完成 Mole 工具安全性评估
- [x] 功能研究：完成 Mole 全部功能梳理（clean/uninstall/analyze/purge 等）
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
**状态**: 📝 内容完善中
