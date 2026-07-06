# Minimal example · visual-deck

最小可跑的 2 页 demo，用来验证 pipeline 通畅。不依赖 Nano Banana 图像 —— 第 2 页用 CSS 渐变模拟图位。

## 跑起来

```bash
cd examples/minimal
npm install          # 装 playwright / pptxgenjs / sharp
node build.js        # 产出 deck.pptx
```

第一次跑 `playwright` 会下 chromium，大约 1~2 分钟。产物在当前目录的 `deck.pptx`。

## 目录

```
minimal/
├── build.js          # 构建脚本
├── html2pptx.js      # pipeline（从 skill 的 pipeline/ 复制）
├── notes-map.js      # 空 notes（示例无溢出）
├── package.json
├── slides/
│   ├── slide01.html  # HF 封面
│   └── slide02.html  # R34 内容页
└── images/           # 本例没用图，留空
```

## 下一步

1. 把你自己的主题色换进 slide01.html / slide02.html（搜索 `#FF6B47` 改 accent，`#0A0A0A` 改底色）
2. 按 `references/image-prompts-v2.md` 生成 Nano Banana 图，放 `images/slideNN.png`
3. 在 HTML 里把 `background: #0A0A0A` 或 `linear-gradient(...)` 换成 `url('../images/slideNN.png')`
