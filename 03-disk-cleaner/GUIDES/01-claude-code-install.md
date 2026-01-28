# Guide 01: Claude Code 安装指南

> 对应 STORYBOARD.md Scene 03
> 预计录制时长: 2.5 分钟

---

## 前置条件

### 观众需要准备

| 项目 | 要求 | 说明 |
|------|------|------|
| 操作系统 | macOS / Linux / Windows (WSL) | 本教程以 macOS 为例 |
| Claude 账号 | Pro / Max / Teams / Enterprise 订阅 | 或 Claude Console 账号 |
| 网络 | 能访问 claude.ai | 安装和登录都需要 |

### 录制前确认

- [ ] 终端字体足够大 (建议 16pt+)
- [ ] 终端背景简洁 (纯色或轻微透明)
- [ ] 已退出现有 Claude Code (演示全新安装)
- [ ] 浏览器已登录 Claude 账号 (加快授权流程)

---

## 操作步骤

### Step 1: 打开终端

**操作**:
1. 按 `⌘ + Space` 打开 Spotlight
2. 输入 `Terminal` 或 `终端`
3. 按回车打开

**录制要点**:
- 放慢动作，让观众看清快捷键
- 可以念出 "Command 加 空格"

**旁白参考**:
> "首先我们打开终端。按住 Command 键，再按空格键，输入 Terminal，回车。"

---

### Step 2: 终端入门演示 (可选)

**目的**: 降低非程序员对"黑框框"的恐惧

**操作**:
```bash
echo "Hello, World!"
```

**预期输出**:
```
Hello, World!
```

**旁白参考**:
> "别怕这个黑色窗口，它只是另一种和电脑对话的方式。
> 你输入命令，电脑回复你，就像发微信一样。
> 比如输入 echo Hello World，电脑就会回复你 Hello World。"

---

### Step 3: 安装 Claude Code

**操作**:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**命令解释** (可作为画外音或字幕补充):
- `curl`: 从网上下载文件的工具
- `-fsSL`: 静默模式，遇到错误会提示
- `https://claude.ai/install.sh`: 官方安装脚本
- `| bash`: 下载后直接运行

**预期输出**:
```
Downloading Claude Code...
Installing to /usr/local/bin/claude...
Installation complete!

Run 'claude' to get started.
```

**录制要点**:
- 命令较长，可以分步骤展示：先展示完整命令，再回车
- 安装过程可加速播放 (1.5x-2x)
- 看到 "Installation complete" 时恢复正常速度

**旁白参考**:
> "现在复制这行命令。
> 这是 Claude 官方提供的一键安装脚本，安全可靠。
> 回车，等它自动下载和配置...
> 看到 Installation complete 就说明装好了！"

---

### Step 4: 首次启动 & 登录

**操作**:
```bash
claude
```

**预期行为**:
1. 终端显示 "Opening browser to authenticate..."
2. 浏览器自动打开 Claude 授权页面
3. 页面显示 "Authorize Claude Code"
4. 点击 "Authorize" 按钮
5. 浏览器显示 "You can close this window"
6. 回到终端，Claude Code 界面已就绪

**录制要点**:
- 浏览器跳转时，画面可以分屏显示 (终端 + 浏览器)
- 授权按钮点击要清晰可见
- 返回终端时稍作停顿，展示界面

**旁白参考**:
> "输入 claude，回车。
> 第一次使用会要求登录，浏览器会自动打开。
> 点击 Authorize 授权...
> 好，回到终端，Claude Code 已经准备就绪了！
> 欢迎来到 AI 时代。"

---

## 界面介绍 (可选扩展)

首次进入 Claude Code 后，可以简单介绍界面：

```
╭─────────────────────────────────────────────╮
│  Claude Code                                │
│                                             │
│  > 在这里输入你的需求...                      │
│                                             │
│  Tips: 用自然语言描述你想做的事              │
╰─────────────────────────────────────────────╯
```

**可提及的功能**:
- 直接用中文/英文输入需求
- 按 `Ctrl+C` 可以中断当前操作
- 输入 `/help` 查看帮助
- 输入 `/exit` 或 `Ctrl+D` 退出

---

## 常见问题 & 应对

### Q1: curl 命令找不到

**现象**: `command not found: curl`

**解决**: macOS 自带 curl，如果没有：
```bash
brew install curl
```

**录制建议**: 这种情况极少见，可以不录，但准备好应对话术

---

### Q2: 权限错误

**现象**: `Permission denied`

**解决**:
```bash
curl -fsSL https://claude.ai/install.sh | sudo bash
```

**旁白**: "如果遇到权限问题，在命令前加 sudo，然后输入你的电脑密码"

---

### Q3: 浏览器没有自动打开

**解决**: 手动复制终端显示的 URL 到浏览器

**旁白**: "如果浏览器没有自动打开，可以手动复制这个链接"

---

### Q4: 没有 Claude 订阅

**说明**: Claude Code 需要付费订阅 (Pro $20/月 起)

**旁白参考**:
> "注意，Claude Code 需要 Pro 或更高级的订阅。
> 如果你还没有，可以先去 claude.ai 注册。
> 后面我也会介绍一些免费的替代方案。"

---

## 备选安装方式

### Homebrew 安装 (macOS)

如果观众熟悉 Homebrew：

```bash
brew install --cask claude-code
```

**注意**: Homebrew 安装不会自动更新，需要手动 `brew upgrade claude-code`

---

## 录制检查清单

完成录制后，确认以下镜头都有：

- [ ] Spotlight 打开 Terminal
- [ ] (可选) echo 命令演示
- [ ] 安装命令输入
- [ ] 安装进度 (可加速)
- [ ] 安装成功提示
- [ ] `claude` 命令启动
- [ ] 浏览器授权页面
- [ ] 点击 Authorize
- [ ] 返回终端，界面就绪

---

## 下一步

安装完成后，继续 [02-skills-install.md](./02-skills-install.md) 安装 Skills。
