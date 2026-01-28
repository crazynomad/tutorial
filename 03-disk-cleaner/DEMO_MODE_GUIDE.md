# Disk Cleaner 演示模式使用指南

## 快速开始

### 方法 1: 演示模式（推荐，最简单）

```bash
cd /Users/burn.wang/Github/skills/disk-cleaner

# 预览震撼效果 (~50GB)
python scripts/mole_cleaner.py --preview --demo impressive

# 预览真实效果 (~25GB)
python scripts/mole_cleaner.py --preview --demo realistic

# 预览保守效果 (~10GB)
python scripts/mole_cleaner.py --preview --demo conservative
```

### 演示清理流程（不会真实清理）

```bash
# 完整演示流程 - 震撼效果
python scripts/mole_cleaner.py --clean --confirm --demo impressive

# 这会：
# 1. 显示预览报告（使用演示数据）
# 2. 模拟清理执行
# 3. 打开成就页面（震撼数字）
# 4. 不会真实清理任何文件
```

---

## 三种演示场景对比

### 1. Impressive（震撼效果）- 推荐视频使用

```
总空间: 50.0 GB
省钱: ¥146.48 ($20.93)

分类详情:
  用户应用缓存: 18.00 GB (2847 items)
  浏览器缓存: 12.00 GB (15234 items)
  AI 模型缓存: 8.00 GB (15 items)
  iOS 模拟器缓存: 5.00 GB (342 items)
  包管理器缓存: 3.50 GB (1876 items)
  开发工具缓存: 2.20 GB (543 items)
  系统日志: 1.30 GB (8934 items)

清理前: 26.62 GB
清理后: 76.85 GB
```

**适合场景**:
- 视频开头震撼效果
- 展示最大清理潜力
- 吸引观众注意力

### 2. Realistic（真实效果）

```
总空间: 25.2 GB
省钱: ¥73.83 ($10.55)

分类详情:
  用户应用缓存: 9.50 GB (1423 items)
  浏览器缓存: 6.20 GB (7621 items)
  AI 模型缓存: 4.10 GB (8 items)
  包管理器缓存: 2.80 GB (934 items)
  iOS 模拟器缓存: 1.90 GB (156 items)
  系统日志: 0.70 GB (4532 items)

清理前: 26.62 GB
清理后: 51.82 GB
```

**适合场景**:
- 展示典型用户清理效果
- 技术细节讲解部分
- 更可信的数据

### 3. Conservative（保守效果）

```
总空间: 10.0 GB
省钱: ¥29.30 ($4.19)

分类详情:
  用户应用缓存: 4.20 GB (567 items)
  浏览器缓存: 2.80 GB (3421 items)
  包管理器缓存: 1.90 GB (456 items)
  系统日志: 1.10 GB (2134 items)

清理前: 26.62 GB
清理后: 36.62 GB
```

**适合场景**:
- 展示最低收益
- 强调安全性
- 对比效果

---

## 视频录制流程建议

### 场景 1: 开场震撼（使用 impressive）

```bash
# 1. 录制扫描过程
python scripts/mole_cleaner.py --preview --demo impressive

# 2. 录制完整清理流程
python scripts/mole_cleaner.py --clean --confirm --demo impressive

# 预期效果：
# - 总空间 50GB
# - 省钱 $20.93
# - 成就页面显示 12,500 张照片等价物
```

**旁白参考**:
> "看这个数字...50GB！相当于省下了 $21，够买好几杯咖啡了！"

### 场景 2: 技术讲解（使用 realistic）

```bash
# 展示真实场景的分类逻辑
python scripts/mole_cleaner.py --preview --demo realistic --json

# 预期效果：
# - 更可信的数字（25GB）
# - 分类更细致
# - 省钱约 $10
```

**旁白参考**:
> "在真实场景中，一般用户可以清理 20-30GB，省下 $10-15 的 SSD 升级费用"

### 场景 3: 对比展示（三种模式对比）

```bash
# 快速对比三种模式
for mode in conservative realistic impressive; do
    echo "=== $mode ==="
    python scripts/demo_mode.py $mode
    echo ""
done
```

---

## 成就页面效果预览

### 测试成就页面

```bash
# 直接显示成就页面（不执行清理）
python scripts/mole_cleaner.py --show-achievement

# 会自动打开 HTML 成就页，显示示例数据 (15GB)
```

### 多语言测试

成就页面会自动检测浏览器语言：

1. **简体中文**: `zh-CN`, `zh-Hans`, `zh-SG`
2. **繁体中文**: `zh-TW`, `zh-HK`, `zh-Hant`
3. **英文**: 其他所有语言

测试方法：
```bash
# 修改浏览器语言设置
# Chrome: Settings → Languages
# Safari: Preferences → General → Preferred Languages

# 或者直接修改系统语言再打开 HTML
```

---

## 录制检查清单

### 录制前准备

- [ ] 测试演示模式是否正常工作
  ```bash
  python scripts/demo_mode.py impressive
  ```

- [ ] 检查成就页面是否正常打开
  ```bash
  python scripts/mole_cleaner.py --show-achievement
  ```

- [ ] 确认多语言切换正常
  - 简体中文显示 ¥ 符号
  - 英文显示 $ 符号

- [ ] 准备录屏软件
  - QuickTime / OBS 设置为 1080p 60fps
  - 音频测试

### 录制中要点

**镜头 1: 扫描过程**
```bash
python scripts/mole_cleaner.py --preview --demo impressive
```
- [ ] 录制终端输出
- [ ] 突出显示总空间数字
- [ ] 特写分类列表

**镜头 2: 清理执行**
```bash
python scripts/mole_cleaner.py --clean --confirm --demo impressive
```
- [ ] 录制确认流程
- [ ] 录制清理进度
- [ ] 录制成就页面打开

**镜头 3: 成就页面特写**
- [ ] 省钱数字特写
- [ ] 等价物统计
- [ ] tw93 夸夸语录
- [ ] GitHub Star 按钮点击

**镜头 4: 代码解析**
```bash
code /Users/burn.wang/Github/skills/disk-cleaner
```
- [ ] SKILL.md 结构
- [ ] demo_mode.py 数据定义
- [ ] 分类逻辑代码片段
- [ ] 省钱计算逻辑

### 录制后检查

- [ ] 音频清晰无杂音
- [ ] 画面流畅无卡顿
- [ ] 数字清晰可见
- [ ] 成就页面完整展示
- [ ] 多语言切换正常（如果录制）

---

## 常见问题

### Q: 演示模式会真实删除文件吗？
**A**: 不会！演示模式只是显示模拟数据，不会执行任何清理操作。

### Q: 如何恢复真实数据？
**A**: 去掉 `--demo` 参数即可：
```bash
python scripts/mole_cleaner.py --preview
```

### Q: 可以自定义演示数据吗？
**A**: 可以！编辑 `demo_mode.py`，修改 `scenarios` 字典：
```python
scenarios = {
    "my_custom": {
        "categories": {
            "浏览器缓存": {
                "size_bytes": 100 * 1024**3,  # 100 GB
                # ...
            }
        }
    }
}
```

### Q: 成就页面的省钱计算准确吗？
**A**: 基于真实价格（1TB SSD ≈ $400），自动折算。不同 Mac 型号价格可能略有差异。

### Q: 为什么我的成就页面没有鼹鼠图片？
**A**: 确保 `assets/mole_cleaner.jpg` 存在。如果缺失，会自动使用 🦔 emoji。

---

## 视频脚本建议

### 开场（使用 impressive 模式）

```
[屏幕录制: Mac 存储警告]

"又来了...存储空间不足。看看 Apple 升级价格..."

[屏幕录制: Apple 官网]

"512GB → 1TB，要加 $200。一个 1TB SSD 要 $400..."

[屏幕录制: Claude Code]

"今天我要展示一个 Skill，帮我省下了 $21"

[执行演示命令]
$ python scripts/mole_cleaner.py --clean --confirm --demo impressive

[成就页面弹出]

"看！释放了 50GB，省下 $21，相当于 12,500 张照片的空间！"
```

### 技术讲解（使用 realistic 模式）

```
[屏幕录制: VS Code]

"这就是 Skill 的魔法...它不是盲目清理"

[展示分类逻辑代码]

"根据路径关键词，自动分类..."

[执行真实数据预览]
$ python scripts/mole_cleaner.py --preview --demo realistic

"在真实场景中，一般可以清理 25GB 左右"
```

---

## 技术细节

### 演示数据结构

```python
{
    "categories": {
        "分类名": {
            "size_bytes": 字节数,
            "description": "描述",
            "items": 项目数量
        }
    },
    "file_count": 总文件数,
    "dir_count": 总目录数,
    "disk_before": "清理前可用空间",
    "disk_after": "清理后可用空间",
    "protected": ["保护项列表"]
}
```

### 省钱计算公式

```python
# SSD 升级价格（基于 Apple 官方）
SSD_PRICE_PER_GB = 3000 / 1024  # ≈ 2.93 RMB/GB

# 计算省下的钱
freed_gb = freed_bytes / (1024 ** 3)
money_saved_rmb = freed_gb * SSD_PRICE_PER_GB
money_saved_usd = money_saved_rmb / 7  # 汇率约 7:1
```

### 等价物计算

```python
# 照片：4MB/张
photos_equivalent = freed_gb * 250

# 歌曲：5MB/首
songs_equivalent = freed_gb * 200
```

---

## 下一步

录制完成后，可以：

1. **分享素材**: 将录制的视频片段分类整理
2. **后期剪辑**: 使用 Final Cut Pro / Premiere
3. **添加特效**: 数字滚动、高光提示
4. **配音优化**: 后期配音或降噪处理
5. **字幕制作**: 中英文双语字幕

需要帮助？查看主教程：`VIDEO_PLAN.md`
