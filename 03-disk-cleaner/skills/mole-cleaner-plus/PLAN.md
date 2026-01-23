# Mole Cleaner Plus - 功能规划

> Mole 的补充功能，专注于**用户文件整理**（Mole 专注系统垃圾清理）

## 设计原则

- **补充而非重复**：不做 Mole 已有的功能
- **用户文件导向**：帮助整理个人文件，Mole 不触碰这些
- **安全优先**：低风险推荐，用户确认后才删除
- **时间维度**：基于"多久没用"而非"文件类型"
- **🆕 高情商设计**：不直接删除，而是帮用户"发现"→"决策"→"行动"
- **🆕 可视化引导**：生成报告并打开关键路径，让用户在 Finder 中自主管理

---

## 设计补充（结合 Mole 思路）

- **复用 Mole 的安全封装**：把 Mole 的安全校验（路径验证/白名单/保护规则）抽象为只读扫描管线，默认只分析不删除，输出“候选清单 + 理由”。  
- **分区清理 → 分区画像**：沿用 Mole 的模块划分，但输出“空间占用/释放潜力/风险等级/推荐动作”，让用户先理解再决策。  
- **`clean-list.txt` 作为沟通层**：对 `--dry-run` 产物做二次解析，聚合同类项、时间分层、解释风险，形成更友好的报告。  
- **可视化引导优先**：仅输出报告与路径引导（打开关键目录/筛选视图），避免默认生成额外产物。  
- **风控分级**：硬规则沿用 Mole 的保护机制，软规则输出绿/黄/红建议，避免默认清理导致误删。  
- **推荐动作优先**：默认输出“打开位置/归档建议”，删除仅在用户显式确认后执行。  
- **扫描策略 × 输出策略**：扫描按时间/大小/类型/位置组合，输出按报告/打开路径区分，新增模块无需改核心逻辑。  
- **实现决策：优先使用 Shell 复用 Mole 框架**：入口与参数解析沿用 Mole 风格（如 `clean-plus.sh`），核心行为改为 `safe_scan`（只读分析）。复杂分析（相似照片/内容哈希/EXIF）再用 Python 作为可选辅助。  
- **Skills 形态的交互优势**：不同于 Mole CLI，本项目以 Skills 形态整合，输入输出可更智能化（上下文理解 + 分步引导），强调更人性化的提示与决策建议。  
- **社交软件清理的超安全模式**：默认仅清理缩略图/临时缓存，并在文案中提示“清理后可能出现图片过期”。  
- **相似照片性能优化**：先用 EXIF/拍摄时间做分组（如 1-2 秒内连拍），再做 pHash 精算，减少全盘计算成本。  
- **iOS 备份信息增强**：解析 `Info.plist` 时展示 iOS 版本号，帮助用户识别旧设备备份。  

---

## 功能对比：Mole vs 补充功能

| 功能 | Mole | 补充 | 说明 |
|------|------|------|------|
| 系统缓存清理 | ✅ `mo clean` | - | 不重复 |
| 应用卸载+残留 | ✅ `mo uninstall` | - | 不重复 |
| 大文件浏览 | ✅ `mo analyze` | - | 不重复 |
| 安装包清理 | ✅ `mo installer` | - | 不重复 |
| 开发构建产物 | ✅ `mo purge` | - | 不重复 |
| 基于访问时间分析 | ❌ | ✅ | **补充** |
| 重复文件检测 | ❌ | ✅ | **补充** |
| 版本系列检测 | ❌ | ✅ | **补充** |
| 用户文件整理 | ❌ | ✅ | **补充** |
| **🥇 大文件安全清理** | ❌ | ✅ | **补充 - 第一优先级** |
| **iOS 备份管理** | ❌ | ✅ | **补充 - 普通人刚需** |
| **微信/QQ 缓存** | ❌ | ✅ | **补充 - 普通人刚需** |
| **相似照片检测** | ❌ | ✅ | **补充 - 普通人刚需** |
| **可视化路径引导** | ❌ | ✅ | **补充 - 高情商设计** |

---

## 核心功能规划

### 🥇 1. 大文件安全清理 `--large-files`（第一优先级）

> **高情商设计**：不直接删除，而是帮用户"发现"→"决策"→"行动"

**设计理念**：
- 🎯 **发现**：找出用户明确用途的大文件（文档/视频/音频）
- 🤔 **决策**：生成报告并打开关键路径，让用户在 Finder 中自主浏览和选择
- ✅ **行动**：用户可以选择备份到外部存储或删除

**为什么是第一优先级**：
- 覆盖面最广：每个人都有大文件
- 最安全：用户自主决策，不是程序替用户删除
- 最直观：在 Finder 中操作，用户熟悉
- 释放空间大：文档/视频/音频往往是最大的用户文件

#### 功能流程

```
┌─────────────────┐
│  1. 扫描大文件   │ → 文档/视频/音频，按时间分类
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. 生成报告     │ → 分类展示，标注时间和大小
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. 打开路径     │ → 自动打开关键目录
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. 引导用户     │ → 提示：可以拖拽到外部硬盘备份
│                 │    或者右键删除
└─────────────────┘
```

#### 输出示例

```
╔═══════════════════════════════════════════════════════════════╗
║  📂 大文件安全清理助手                                        ║
╠═══════════════════════════════════════════════════════════════╣

🔍 扫描完成！发现以下大文件：

📹 视频文件（共 15.8 GB）
┌─────────────────────────────────────────────────────────────┐
│ 时间段          文件数    大小      建议                     │
├─────────────────────────────────────────────────────────────┤
│ 🔴 1年以上       12个    8.2 GB    考虑备份后删除            │
│ 🟡 6-12个月      8个     4.5 GB    检查是否还需要            │
│ 🟢 3-6个月       15个    3.1 GB    可能还在使用              │
└─────────────────────────────────────────────────────────────┘

📄 文档文件（共 4.2 GB）
┌─────────────────────────────────────────────────────────────┐
│ 🔴 1年以上       45个    2.8 GB    旧项目文档？              │
│ 🟡 6-12个月      23个    1.4 GB    检查是否归档              │
└─────────────────────────────────────────────────────────────┘

🎵 音频文件（共 2.1 GB）
┌─────────────────────────────────────────────────────────────┐
│ 🔴 1年以上       128个   2.1 GB    旧播客/音乐？             │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 接下来，我会打开关键目录，你可以：
   1. 在 Finder 中浏览这些文件
   2. 把重要的拖到外部硬盘备份
   3. 删除不需要的文件

🗂️ 请选择要查看的路径：
   [1] 📹 大视频目录（>1年）
   [2] 📄 大文档目录（>1年）
   [3] 🎵 大音频目录（>1年）
   [4] 📁 全部大文件（>100MB）
   [Q] 退出

>>>
```

#### 文件类型 UTI 参考

| 类型 | UTI 标识符 |
|------|-----------|
| 所有视频 | `public.movie` |
| MP4 | `public.mpeg-4` |
| MOV | `com.apple.quicktime-movie` |
| 所有音频 | `public.audio` |
| MP3 | `public.mp3` |
| 所有文档 | `public.document` |
| PDF | `com.adobe.pdf` |
| Word | `com.microsoft.word.doc` |
| 图片 | `public.image` |

#### 用户引导话术（高情商）

```
📂 我已经为你打开关键目录，正在打开 Finder...

💡 小提示：
   • 这些是你电脑上超过 1 年没动过的大文件
   • 我不会自动删除任何东西，完全由你决定
   • 建议：把重要的先拖到外部硬盘或 iCloud
   • 确认不需要的，可以右键 → 移到废纸篓

🔒 安全提醒：
   • 删除前请确认文件内容
   • 废纸篓清空前还可以恢复
   • 如有疑问，先备份再删除
```

---

### 2. 🕰️ 长期未使用文件分析 `--stale`

**原理**：基于 `mtime`（修改时间）和 `btime`（创建时间）找出长期未使用的文件

> 注意：不使用 `atime`（访问时间），因为 macOS 默认禁用 atime 更新

**输出示例**：
```
📊 长期未使用的大文件（>100MB）

🔴 超过 1 年未修改（建议清理）           8.2 GB
   • backup_old.zip          2.1 GB   创建于 438 天前
   • video_raw.mov           1.8 GB   创建于 392 天前
   • old_project.zip         1.5 GB   创建于 401 天前

🟡 超过 6 个月未修改（可考虑）           3.5 GB
   • course_video.mp4        1.2 GB   创建于 210 天前
   • presentation.key        800 MB   修改于 195 天前

🟢 超过 3 个月未修改（提醒）             2.1 GB
   • design_assets.zip       1.1 GB   创建于 102 天前
```

**配置选项**：
- `--min-size 100MB` - 最小文件大小
- `--min-days 90` - 最少未使用天数
- `--exclude ~/.config,~/.ssh` - 排除目录

---

### 2. 🔄 重复文件检测 `--duplicates`

**原理**：基于文件内容 MD5/SHA256 hash 检测真正的重复文件

**输出示例**：
```
🔄 发现 23 组重复文件，可释放 4.7 GB

[组 1] photo.jpg 重复 3 次                 1.5 GB 可释放
    ✓ ~/Pictures/2024/photo.jpg     512MB  (原始，保留)
    ✗ ~/Downloads/photo.jpg         512MB  (删除)
    ✗ ~/Desktop/photo copy.jpg      512MB  (删除)

[组 2] report.pdf 重复 2 次                 200 MB 可释放
    ✓ ~/Documents/report.pdf        200MB  (保留)
    ✗ ~/Downloads/report (1).pdf    200MB  (删除)
```

**智能保留策略**：
1. 保留路径更"正式"的（Documents > Downloads > Desktop）
2. 保留文件名更"干净"的（无 (1), copy 等后缀）
3. 保留修改时间更早的（原始文件）

---

### 3. 📦 版本系列检测 `--versions`

**原理**：识别同一软件的多个版本安装包，只保留最新

**输出示例**：
```
📦 发现 5 个软件有多版本安装包，可释放 2.3 GB

Cursor (3 个版本)                          1.4 GB 可释放
   ✗ Cursor-0.44.0-arm64.dmg    459MB  2024-10-01  (删除)
   ✗ Cursor-0.45.0-arm64.dmg    462MB  2024-11-01  (删除)
   ✓ Cursor-0.46.0-arm64.dmg    465MB  2024-12-01  (保留最新)

Docker Desktop (2 个版本)                  900 MB 可释放
   ✗ Docker-4.25.0.dmg          450MB  2024-09-15  (删除)
   ✓ Docker-4.26.0.dmg          450MB  2024-12-01  (保留最新)

VS Code (2 个版本)                         400 MB 可释放
   ...
```

**版本识别模式**：
- `AppName-X.Y.Z.dmg`
- `AppName_vX.Y.Z.pkg`
- `AppName (X.Y.Z).zip`
- 语义化版本号解析

---

### 4. 📸 截图/录屏管理 `--screenshots`

**原理**：专门管理 macOS 截图和录屏文件

**输出示例**：
```
📸 截图管理

发现 847 个截图，占用 3.2 GB

按年份分布：
├── 2024年    234个    890 MB   (最近，保留)
├── 2023年    412个    1.8 GB   (可归档)
└── 2022年    201个    520 MB   (建议清理)

按类型分布：
├── 截图 (Screenshot)     723个    2.1 GB
├── 录屏 (Screen Recording) 89个   980 MB
└── CleanShot             35个    120 MB

操作建议：
[1] 删除 2022 年及更早截图 (520 MB)
[2] 归档 2023 年截图到外部存储
[3] 查看大于 10MB 的录屏文件
```

---

### 5. 📥 下载文件夹整理 `--downloads`

**原理**：分析 Downloads 文件夹，找出可清理项

**输出示例**：
```
📥 下载文件夹分析 (~/Downloads)

总计: 156 个文件, 12.8 GB

📦 已解压的压缩包 (源文件可删除)          2.1 GB
   • project.zip → project/ 已存在
   • assets.tar.gz → assets/ 已存在

⏰ 超过 90 天未访问                        4.5 GB
   • old_installer.dmg    1.2 GB   120天
   • tutorial.mp4         800 MB   95天

🔄 重复下载                               1.2 GB
   • file.pdf, file (1).pdf, file (2).pdf

📁 建议整理 (按类型)
   • 文档类: 45个 → ~/Documents
   • 图片类: 23个 → ~/Pictures
```

---

## 普通人刚需功能（高优先级）

> 这些功能对普通用户释放空间最有效，优先实现

### 6. 📱 iOS 备份管理 `--ios-backups`

**原理**：扫描 ~/Library/Application Support/MobileSync/Backup 目录

**为什么重要**：99% 的人不知道这个目录存在，但经常占用 20-100GB

**输出示例**：
```
📱 iOS 设备备份分析

发现 3 个备份，共占用 67.5 GB

设备名称                 备份日期        大小      状态
─────────────────────────────────────────────────────────
iPhone 12 Pro           2022-03-15    32.1 GB   ⚠️ 已换手机
iPhone 12 Pro           2023-01-20    28.4 GB   ⚠️ 旧备份
iPhone 14 Pro           2024-12-01     7.0 GB   ✅ 当前设备

💡 建议：
  🔴 删除 "iPhone 12 Pro" 的 2 个备份 → 释放 60.5 GB
  🟢 保留 "iPhone 14 Pro" 最新备份

⚠️  删除前请确认：
  • 旧设备的数据是否已迁移到新设备
  • 是否有重要照片/信息仅存在于备份中
```

**检测逻辑**：
1. 解析 Info.plist 获取设备名称、备份日期
2. 尽量提取 iOS 版本号并展示，帮助用户区分旧设备备份
2. 对比当前连接的设备
3. 识别"已换手机"的旧备份
4. 识别同一设备的多个备份（只需保留最新）

---

### 7. 💬 微信/QQ 缓存清理 `--wechat` / `--qq`

**原理**：扫描微信/QQ 的缓存目录

**缓存位置**：
- 微信：`~/Library/Containers/com.tencent.xinWeChat/Data/Library/Application Support/`
- QQ：`~/Library/Containers/com.tencent.qq/Data/Library/Application Support/`

**输出示例**：
```
💬 微信缓存分析

总缓存: 18.5 GB

按类型分布：
├── 📷 聊天图片      8.2 GB   (12,847 个文件)
├── 🎬 聊天视频      5.1 GB   (234 个文件)
├── 📄 聊天文件      3.8 GB   (1,203 个文件)
├── 😀 表情包        1.4 GB   (安全清理)
└── 🔧 其他缓存      0.5 GB   (安全清理)

按时间分布：
├── 最近 3 个月     4.2 GB   (保留)
├── 3-6 个月前      5.1 GB   (可考虑清理)
├── 6-12 个月前     6.8 GB   (建议清理)
└── 1 年以上        2.4 GB   (强烈建议清理)

💡 建议清理方案：
  [1] 安全清理：表情包 + 其他缓存 → 释放 1.9 GB
  [2] 推荐清理：+ 6个月前的图片视频 → 释放 11.1 GB
  [3] 深度清理：+ 3个月前的所有媒体 → 释放 16.2 GB

⚠️  注意：清理后聊天记录中的图片/视频/文件需重新下载
```

**超安全模式建议**：
- 默认仅清理缩略图/临时缓存
- 文案明确提示“清理后可能出现图片过期”

**QQ 类似分析**：
```
💬 QQ 缓存分析

总缓存: 8.2 GB
...
```

---

### 8. 📸 相似照片检测 `--similar-photos`

**原理**：使用感知哈希（pHash）检测视觉相似的图片，不仅仅是完全重复

**与重复检测的区别**：
- `--duplicates`：文件内容 100% 相同（MD5 hash）
- `--similar-photos`：视觉上相似（连拍、截图系列、编辑前后）

**输出示例**：
```
📸 相似照片检测

扫描: ~/Pictures, ~/Desktop, ~/Downloads
发现 156 组相似照片，可释放约 4.2 GB

[连拍系列] 2024-01-15 晚餐聚会 (8 张相似，相似度 >95%)
   ✓ IMG_4521.HEIC    2.8 MB   最清晰，保留
   ✗ IMG_4522.HEIC    2.7 MB
   ✗ IMG_4523.HEIC    2.9 MB
   ✗ IMG_4524.HEIC    2.6 MB   闭眼
   ✗ IMG_4525.HEIC    2.8 MB
   ✗ IMG_4526.HEIC    2.7 MB   模糊
   ✗ IMG_4527.HEIC    2.8 MB
   ✗ IMG_4528.HEIC    2.9 MB
   → 删除 7 张，释放 19.4 MB

[截图系列] 2024-02-20 网页截图 (5 张几乎一样，相似度 >98%)
   ✓ Screenshot_001.png   1.2 MB   保留
   ✗ Screenshot_002.png   1.2 MB
   ✗ Screenshot_003.png   1.1 MB
   ✗ Screenshot_004.png   1.2 MB
   ✗ Screenshot_005.png   1.2 MB
   → 删除 4 张，释放 4.7 MB

[编辑版本] 2024-03-10 风景照 (3 张，原图+滤镜)
   ✓ IMG_5001.HEIC        4.2 MB   原图，保留
   ? IMG_5001_edited.HEIC 4.1 MB   编辑版，用户选择
   ✗ IMG_5001 (1).HEIC    4.2 MB   重复，删除

💡 智能保留策略：
  • 连拍：保留最清晰的一张（基于清晰度评分）
  • 截图系列：保留第一张
  • 编辑版本：保留原图，编辑版让用户选择

📊 汇总：
  • 发现相似组：156 组
  • 可删除照片：423 张
  • 预计释放：4.2 GB
```

**技术实现**：
- 使用 `imagehash` 库计算感知哈希
- 相似度阈值可配置（默认 90%）
- 清晰度评分基于拉普拉斯方差
- 支持 HEIC/JPG/PNG 格式
- 性能优化：先用 EXIF/拍摄时间分组（如 1-2 秒内连拍），再做 pHash 精算

---

## 其他潜在功能（待评估）

> 以下功能可以后续考虑添加

### 9. 💬 iMessage 附件清理 `--imessage`
- 位置：~/Library/Messages/Attachments
- 清理多年积累的聊天图片视频

### 10. 📧 邮件附件清理 `--mail`
- 位置：~/Library/Mail
- 清理下载的邮件附件

### 11. ⏰ Time Machine 本地快照 `--timemachine`
- 命令：`tmutil listlocalsnapshots /`
- 需要 sudo 权限

### 12. 🐳 Docker 清理 `--docker`（开发者）
- 未使用的镜像、停止的容器、悬空的 volumes

---

## 技术实现

### 命令行接口设计

```bash
# 🥇 核心功能（第一优先级）
python smart_cleaner.py --large-files     # 大文件安全清理 + 路径引导
python smart_cleaner.py --large-files --type video    # 仅视频
python smart_cleaner.py --large-files --type document # 仅文档
python smart_cleaner.py --large-files --type audio    # 仅音频
python smart_cleaner.py --large-files --older-than 180  # 超过180天

# 普通人刚需
python smart_cleaner.py --ios-backups     # iOS 备份管理
python smart_cleaner.py --wechat          # 微信缓存清理
python smart_cleaner.py --qq              # QQ 缓存清理
python smart_cleaner.py --similar-photos  # 相似照片检测

# 通用文件整理
python smart_cleaner.py --stale           # 长期未使用文件
python smart_cleaner.py --duplicates      # 重复文件检测
python smart_cleaner.py --versions        # 版本系列检测
python smart_cleaner.py --screenshots     # 截图管理
python smart_cleaner.py --downloads       # 下载文件夹整理

# 组合使用
python smart_cleaner.py --all             # 运行所有分析
python smart_cleaner.py --quick           # 快速分析（大文件 + iOS备份）
python smart_cleaner.py --report          # 生成完整报告

# Finder 相关
--open-finder      # 自动打开 Finder 显示关键目录（默认开启）
--no-open-finder   # 不自动打开 Finder

# 通用选项
--dry-run          # 预览模式，不实际删除
--json             # JSON 格式输出
--min-size 100MB   # 最小文件大小（默认 100MB）
--interactive      # 交互式确认
-o report.txt      # 保存报告
```

### 文件结构

```
skills/
├── mole-cleaner/             # 现有：Mole 系统清理包装
│   ├── SKILL.md
│   └── scripts/mole_cleaner.py
└── mole-cleaner-plus/        # 本项目：补充功能
    ├── SKILL.md              # Skill 定义
    ├── PLAN.md               # 本文件：功能规划
    └── scripts/
        └── smart_cleaner.py  # 待开发：补充功能脚本
```

### 安全机制

1. **默认 dry-run**：所有操作默认只预览，不删除
2. **风险分级**：绿/黄/红 三级风险标识
3. **保护清单**：绝对不扫描/删除的路径和文件类型（见下方详细清单）
4. **二次确认**：删除前显示完整列表并要求确认
5. **回收站优先**：删除时先移到废纸篓而非直接删除

### 🛡️ 保护清单（绝对不删除）

> **核心原则**：宁可漏删，不可误删。影响用户日常运行的文件绝对不能碰。

#### 1. 受保护路径（不扫描这些目录）

```python
PROTECTED_PATHS = [
    # ===== 系统关键目录 =====
    "/System",                          # 系统文件
    "/Library",                         # 系统库
    "/usr",                             # Unix 系统文件
    "/bin",                             # 系统命令
    "/sbin",                            # 系统管理命令
    "/private",                         # 系统私有目录
    "/cores",                           # 系统核心转储

    # ===== 用户关键目录 =====
    "~/.ssh",                           # SSH 密钥！！
    "~/.gnupg",                         # GPG 密钥
    "~/.aws",                           # AWS 凭证
    "~/.kube",                          # Kubernetes 配置
    "~/.docker",                        # Docker 配置
    "~/.config",                        # 应用配置（通用）
    "~/.local/share",                   # 应用数据（通用）

    # ===== 开发环境 =====
    "~/.pyenv",                         # Python 版本管理
    "~/.nvm",                           # Node 版本管理
    "~/.rbenv",                         # Ruby 版本管理
    "~/.rustup",                        # Rust 工具链
    "~/.cargo",                         # Rust 包
    "~/.gem",                           # Ruby gems
    "~/.gradle",                        # Gradle（可能有重要缓存）
    "~/.m2",                            # Maven

    # ===== 应用关键数据 =====
    "~/Library/Keychains",              # 钥匙串！！
    "~/Library/Preferences",            # 应用偏好设置
    "~/Library/Application Support/MobileSync",  # iOS 备份（单独处理）
    "~/Library/Containers",             # 沙盒应用数据（需谨慎）
    "~/Library/Group Containers",       # 应用组数据
    "~/Library/Mail",                   # 邮件数据（单独处理）
    "~/Library/Messages",               # iMessage 数据（单独处理）
    "~/Library/Calendars",              # 日历数据
    "~/Library/Reminders",              # 提醒事项
    "~/Library/Notes",                  # 备忘录
    "~/Library/Safari",                 # Safari 书签等

    # ===== 云同步目录 =====
    "~/Library/Mobile Documents",       # iCloud Drive
    "~/Library/CloudStorage",           # 第三方云存储
    "~/Dropbox",                        # Dropbox
    "~/OneDrive",                       # OneDrive
    "~/Google Drive",                   # Google Drive

    # ===== 虚拟机和容器 =====
    "~/.docker",                        # Docker 配置
    "~/Virtual Machines",               # 虚拟机目录
    "~/.vagrant.d",                     # Vagrant

    # ===== 数据库文件所在目录 =====
    "~/Library/Application Support/Postgres",
    "~/Library/Application Support/MySQL",
    "/usr/local/var",                   # Homebrew 服务数据
    "/opt/homebrew/var",                # Homebrew 服务数据 (Apple Silicon)
]
```

#### 2. 受保护扩展名（绝对不删除）

```python
PROTECTED_EXTENSIONS = [
    # ===== 密钥和证书 =====
    ".pem",                             # SSL/TLS 证书
    ".key",                             # 私钥
    ".crt",                             # 证书
    ".cer",                             # 证书
    ".p12",                             # PKCS#12 证书
    ".pfx",                             # 证书
    ".pub",                             # 公钥
    ".gpg",                             # GPG 加密文件
    ".asc",                             # ASCII 装甲加密

    # ===== 钥匙串和密码 =====
    ".keychain",                        # macOS 钥匙串
    ".keychain-db",                     # macOS 钥匙串数据库
    ".1password",                       # 1Password 数据
    ".kdbx",                            # KeePass 数据库

    # ===== 系统关键文件 =====
    ".plist",                           # 属性列表（应用配置）
    ".entitlements",                    # 应用权限
    ".mobileprovision",                 # iOS 配置文件
    ".provisionprofile",                # 配置文件

    # ===== 数据库文件 =====
    ".db",                              # SQLite 数据库
    ".sqlite",                          # SQLite 数据库
    ".sqlite3",                         # SQLite 数据库
    ".realm",                           # Realm 数据库
    ".coredata",                        # Core Data

    # ===== 虚拟机镜像 =====
    ".vmdk",                            # VMware 磁盘
    ".vdi",                             # VirtualBox 磁盘
    ".qcow2",                           # QEMU 磁盘
    ".vmem",                            # 虚拟机内存
    ".nvram",                           # 虚拟机 NVRAM

    # ===== 项目文件（可能包含重要配置）=====
    ".xcodeproj",                       # Xcode 项目
    ".xcworkspace",                     # Xcode 工作区
    ".pbxproj",                         # Xcode 项目文件

    # ===== Git 相关 =====
    ".git",                             # Git 仓库（目录）
    ".gitconfig",                       # Git 配置
    ".gitignore",                       # Git 忽略规则
]
```

#### 3. 受保护文件名（精确匹配）

```python
PROTECTED_FILENAMES = [
    # ===== Shell 配置 =====
    ".zshrc",
    ".bashrc",
    ".bash_profile",
    ".profile",
    ".zprofile",
    ".zshenv",

    # ===== 环境变量 =====
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",

    # ===== SSH 配置 =====
    "id_rsa",
    "id_rsa.pub",
    "id_ed25519",
    "id_ed25519.pub",
    "known_hosts",
    "authorized_keys",
    "config",                           # SSH config

    # ===== 包管理器锁文件 =====
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "Gemfile.lock",
    "Cargo.lock",
    "poetry.lock",

    # ===== 项目配置 =====
    "Makefile",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    ".dockerignore",
]
```

#### 4. 扫描范围限制（只扫描这些目录的大文件）

```python
# 大文件扫描只在这些"安全"目录进行
SAFE_SCAN_PATHS = [
    "~/Downloads",                      # 下载目录 - 最安全
    "~/Desktop",                        # 桌面
    "~/Documents",                      # 文档（谨慎）
    "~/Movies",                         # 影片
    "~/Music",                          # 音乐
    "~/Pictures",                       # 图片

    # 用户可以手动添加其他目录
]

# 默认不扫描用户主目录的隐藏文件夹
SKIP_HIDDEN = True
```

#### 5. 保护清单配置文件

用户可以自定义保护清单：

```bash
# 配置文件位置
~/.config/mole-cleaner/protected.yaml
```

```yaml
# protected.yaml 示例

# 额外保护的路径
protected_paths:
  - ~/my-important-project
  - ~/work/confidential

# 额外保护的扩展名
protected_extensions:
  - .sketch
  - .figma

# 额外保护的文件名
protected_filenames:
  - my-secret-file.txt

# 强制扫描的路径（覆盖默认保护）
# ⚠️ 谨慎使用！
force_scan_paths: []
```

#### 6. 保护检查流程

```python
def is_protected(file_path: str) -> tuple[bool, str]:
    """
    检查文件是否受保护

    Returns:
        (是否受保护, 保护原因)
    """
    path = Path(file_path).expanduser().resolve()

    # 1. 检查路径是否在受保护目录内
    for protected_path in PROTECTED_PATHS:
        protected = Path(protected_path).expanduser().resolve()
        if path.is_relative_to(protected):
            return True, f"受保护目录: {protected_path}"

    # 2. 检查扩展名
    if path.suffix.lower() in PROTECTED_EXTENSIONS:
        return True, f"受保护扩展名: {path.suffix}"

    # 3. 检查文件名
    if path.name in PROTECTED_FILENAMES:
        return True, f"受保护文件名: {path.name}"

    # 4. 检查是否是隐藏文件（以 . 开头）
    if SKIP_HIDDEN and path.name.startswith('.'):
        return True, "隐藏文件"

    # 5. 检查是否在安全扫描范围内
    in_safe_path = False
    for safe_path in SAFE_SCAN_PATHS:
        safe = Path(safe_path).expanduser().resolve()
        if path.is_relative_to(safe):
            in_safe_path = True
            break

    if not in_safe_path:
        return True, "不在安全扫描范围内"

    return False, ""
```

#### 7. 危险操作警告

对于以下情况，即使用户确认也要再次警告：

```python
DANGEROUS_PATTERNS = [
    # 大于 10GB 的单个文件
    {"condition": "size > 10GB", "warning": "这是一个超大文件，确定删除？"},

    # 在 Documents 目录下的文件
    {"condition": "path contains ~/Documents", "warning": "这是文档目录的文件，建议先备份"},

    # 最近 7 天内修改过的文件
    {"condition": "mtime < 7 days", "warning": "这个文件最近修改过，确定不需要了？"},

    # 文件名包含 backup、重要、important 等关键词
    {"condition": "name contains backup|important|重要", "warning": "文件名暗示这可能是重要文件"},
]
```

### 文件时间戳处理

#### macOS 文件时间戳类型

| 时间戳 | 英文 | 含义 | Python 获取 |
|--------|------|------|-------------|
| **atime** | Access Time | 最后访问时间 | `os.stat().st_atime` |
| **mtime** | Modify Time | 最后修改时间 | `os.stat().st_mtime` |
| **ctime** | Change Time | 状态改变时间 | `os.stat().st_ctime` |
| **Btime** | Birth Time | 创建时间 | `os.stat().st_birthtime` |

#### ⚠️ atime 不可靠的原因

**问题**：每次读文件都要写磁盘更新 atime，影响性能和 SSD 寿命

**macOS 的处理**：
- 很多分区使用 `noatime` 挂载选项（完全禁用）
- 部分使用 `relatime`（仅当 atime < mtime 时更新）
- 结果：**atime 基本不会更新，不可靠**

**实测验证**：
```bash
# 创建文件后读取，atime 不变
创建后 atime: Jan 23 21:30:21
读取后 atime: Jan 23 21:30:21  ← 没有更新！
```

#### 推荐的时间判断策略

```python
import os
from datetime import datetime

def get_file_age_days(file_path: str) -> dict:
    """获取文件的各种时间信息"""
    stats = os.stat(file_path)
    now = datetime.now().timestamp()

    return {
        # ✅ 可靠：最后修改时间
        "未修改天数": (now - stats.st_mtime) / 86400,

        # ✅ 可靠：创建时间（macOS 特有）
        "创建天数": (now - stats.st_birthtime) / 86400,

        # ❌ 不可靠：最后访问时间
        # "未访问天数": (now - stats.st_atime) / 86400,
    }

def 文件未使用天数(file_path: str) -> float:
    """判断文件多久没用（综合策略）"""
    info = get_file_age_days(file_path)
    # 取修改时间和创建时间的较大值
    return max(info["未修改天数"], info["创建天数"])
```

#### 不同场景的时间戳选择

| 文件类型 | 推荐时间戳 | 原因 |
|----------|-----------|------|
| 安装包 (.dmg, .pkg) | `btime` | 下载后一般不修改 |
| 文档 (.docx, .pdf) | `mtime` | 编辑会更新 mtime |
| 照片 (.jpg, .heic) | `btime` 或 EXIF | 照片不会被修改 |
| 视频 (.mp4, .mov) | `btime` | 视频不会被修改 |
| 压缩包 (.zip) | `btime` | 下载后不修改 |
| 代码文件 | `mtime` | 编辑会更新 |

#### 照片的特殊处理

对于照片，优先使用 EXIF 拍摄时间：

```python
from PIL import Image
from PIL.ExifTags import TAGS

def get_photo_date(file_path: str):
    """获取照片拍摄时间"""
    try:
        img = Image.open(file_path)
        exif = img._getexif()
        if exif:
            for tag_id, value in exif.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "DateTimeOriginal":
                    return value  # "2024:01:15 18:30:45"
    except:
        pass

    # EXIF 不可用时，使用 btime
    return os.stat(file_path).st_birthtime
```

---

## 交互设计

### 综合报告界面

```
╔═══════════════════════════════════════════════════════════════╗
║  🧹 智能磁盘优化助手 - 分析报告                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  📊 分析结果总览                        可优化: 98.5 GB       ║
║                                                               ║
║  ━━━━━━━━━━ 🥇 大文件安全清理 ━━━━━━━━━━                      ║
║  📹 旧视频文件 (>1年, 12个)                      8.2 GB  📂   ║
║  📄 旧文档文件 (>1年, 45个)                      2.8 GB  📂   ║
║  🎵 旧音频文件 (>1年, 128个)                     2.1 GB  📂   ║
║                                         [点击📂打开路径]         ║
║                                                               ║
║  ━━━━━━━━━━ 普通人刚需 ━━━━━━━━━━                             ║
║  📱 iOS 旧备份 (2个旧设备)                       60.5 GB      ║
║  💬 微信缓存 (>6个月)                            11.1 GB      ║
║  📸 相似照片 (156组)                              4.2 GB      ║
║                                                               ║
║  ━━━━━━━━━━ 文件整理 ━━━━━━━━━━                               ║
║  🕰️  长期未使用文件 (>6个月)                      5.2 GB      ║
║  🔄 重复文件 (23组)                               2.7 GB      ║
║  📦 多版本安装包 (5个软件)                        1.8 GB      ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  [1] 打开大文件路径  [2] 查看详情  [3] 导出  [Q] 退出 ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 开发计划

### 🥇 P0：核心功能（最高优先级）
- [ ] P0.1: **大文件安全清理** (`--large-files`)
  - 扫描大文件（文档/视频/音频）
  - 按时间分类（>1年、6-12月、3-6月）
  - 打开关键目录进行路径引导
  - 自动打开 Finder，引导用户自主决策
  - 高情商话术引导备份/删除

### P1：普通人刚需
- [ ] P1.1: iOS 备份管理 (`--ios-backups`) - 释放潜力最大
- [ ] P1.2: 相似照片检测 (`--similar-photos`) - 智能去重

### P2：社交软件缓存（国内用户刚需）
- [ ] P2.1: 微信缓存清理 (`--wechat`)
- [ ] P2.2: QQ 缓存清理 (`--qq`)

### P3：通用文件整理
- [ ] P3.1: 长期未使用文件分析 (`--stale`)
- [ ] P3.2: 重复文件检测 (`--duplicates`)
- [ ] P3.3: 版本系列检测 (`--versions`)
- [ ] P3.4: 截图管理 (`--screenshots`)
- [ ] P3.5: 下载文件夹整理 (`--downloads`)

### P4：增强功能
- [ ] P4.1: iMessage 附件清理 (`--imessage`)
- [ ] P4.2: 邮件附件清理 (`--mail`)
- [ ] P4.3: 综合报告和交互界面

### P5：高级功能（可选）
- [ ] P5.1: Time Machine 本地快照 (`--timemachine`)
- [ ] P5.2: Docker 清理 (`--docker`)

---

## 目标用户画像

### 普通人（主要目标）
```
磁盘占用来源：
📱 iOS 备份          30%  ← 不知道有这个
📸 照片/视频         25%  ← 舍不得删
💬 微信/QQ          15%  ← 从没清理过
📥 下载文件夹        10%  ← 乱七八糟
📧 邮件附件          8%
🗑️ 废纸篓            5%
💬 iMessage          5%
🔧 其他              2%
```

### 开发者（次要目标）
- Mole 已覆盖大部分需求（purge, clean）
- 补充：Docker 清理、Git 仓库优化

---

**创建日期**: 2026-01-23
**最后更新**: 2026-01-23
**状态**: 📝 规划中
