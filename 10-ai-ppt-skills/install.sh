#!/usr/bin/env bash
# 绿皮火车 EP10 · AI 做 PPT 全流程 · Skills 一键安装
# 安装到 ~/.claude/skills/ 后在 Claude Code 里直接 /ppt-classify 启动

set -e

SKILLS_DIR="${HOME}/.claude/skills"
mkdir -p "${SKILLS_DIR}"

REPO_BASE="https://raw.githubusercontent.com/crazynomad/tutorial/main/10-ai-ppt-skills/skills"

echo "📦 安装 4 个 PPT Skills 到 ${SKILLS_DIR} ..."

for skill in ppt-classify ppt-research-setup ppt-narrative-review; do
  echo "  → ${skill}"
  mkdir -p "${SKILLS_DIR}/${skill}"
  curl -fsSL "${REPO_BASE}/${skill}/SKILL.md" -o "${SKILLS_DIR}/${skill}/SKILL.md"
done

echo "  → visual-deck (含 templates / pipeline / examples)"
SCRATCH=$(mktemp -d)
trap "rm -rf ${SCRATCH}" EXIT
cd "${SCRATCH}"
curl -fsSL "https://github.com/crazynomad/tutorial/archive/refs/heads/main.tar.gz" | tar xz
rm -rf "${SKILLS_DIR}/visual-deck"
mv tutorial-main/10-ai-ppt-skills/skills/visual-deck "${SKILLS_DIR}/visual-deck"

echo ""
echo "✅ 安装完成。Claude Code 重启后输入以下任一命令即可启动："
echo "   /ppt-classify           — 第一步 · 判定 PPT 类型 + 给章节骨架"
echo "   /ppt-research-setup     — 第二步 · 把骨架填进证据 + 建立论证链"
echo "   /ppt-narrative-review   — 第三步 · 论述审核 + 事实核查标记"
echo "   /visual-deck            — 第三幕 · HTML → PPTX 视觉表达"
echo ""
echo "📺 配套视频：https://youtu.be/{EP10_VIDEO_ID}"
echo "📖 完整教程：https://github.com/crazynomad/tutorial/tree/main/10-ai-ppt-skills"
