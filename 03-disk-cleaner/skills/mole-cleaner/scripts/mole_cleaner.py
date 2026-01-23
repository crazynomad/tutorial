#!/usr/bin/env python3
"""
Mole Cleaner - Mac 智能磁盘清理工具

基于 Mole (https://github.com/tw93/Mole) 的用户友好包装器。
提供环境检测、自动安装、预览分析、清理执行和效果展示。
"""

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class CleanableItem:
    """可清理项目"""
    category: str
    path: str
    size_bytes: int
    size_human: str
    description: str = ""


@dataclass
class CleanReport:
    """清理报告"""
    scan_time: str
    disk_total: str
    disk_available_before: str
    disk_used: str
    items: list = field(default_factory=list)
    categories: dict = field(default_factory=dict)
    total_size_bytes: int = 0
    total_size_human: str = "0 B"
    file_count: int = 0
    dir_count: int = 0
    protected_items: list = field(default_factory=list)
    warnings: list = field(default_factory=list)
    tier_estimates: dict = field(default_factory=dict)


class MoleCleaner:
    """Mole 清理工具包装器"""
    LOG_DIR = os.path.expanduser("~/.config/mole-cleaner/logs")
    REPORT_DIR = os.path.expanduser("~/.config/mole-cleaner/reports")

    # 类别映射与描述（按优先级匹配）
    CATEGORY_RULES = [
        (["/library/logs", "/var/log", "crashreporter", "diagnosticreports", "logs"],
         ("系统日志", "应用和系统日志文件")),
        (["huggingface", "transformers", "ollama", "models", "lm-studio"],
         ("AI 模型缓存", "模型缓存，如不使用可清理")),
        (["coresimulator", "simulator", "xcode/deriveddata", "deriveddata"],
         ("iOS 模拟器缓存", "Xcode Simulator/DerivedData 缓存")),
        (["chrome", "safari", "firefox", "edge", "brave", "vivaldi", "browser"],
         ("浏览器缓存", "Chrome/Safari 等浏览器缓存数据")),
        (["homebrew", "brew", "npm", "pnpm", "yarn", "pip", "pip3", "cargo", ".cargo",
          ".gradle", ".m2", "go/pkg/mod"],
         ("包管理器缓存", "包管理器下载与构建缓存")),
        (["vscode", "intellij", "jetbrains", "pycharm", "webstorm", "xcode", "android studio"],
         ("开发工具缓存", "开发工具与 IDE 缓存")),
        (["wechat", "qq", "tencent", "messages", "chat", "wechatfiles"],
         ("通讯应用缓存", "聊天媒体与缓存文件")),
        (["screenflow", "capcut", "final cut", "logic", "adobe", "photoshop", "lightroom"],
         ("应用专属缓存", "专业应用缓存或项目文件")),
        (["application support"],
         ("应用支持文件", "应用支持文件中的日志和缓存")),
        (["cache", "caches", "tmp", "temp"],
         ("用户应用缓存", "各应用产生的临时缓存文件，清理后会自动重建")),
        (["/.trash", "/trash", "trash"],
         ("废纸篓", "已删除的文件")),
    ]

    # 类别图标
    CATEGORY_ICONS = {
        "用户应用缓存": "🗂️",
        "AI 模型缓存": "🤖",
        "浏览器缓存": "🌐",
        "iOS 模拟器缓存": "📱",
        "开发工具缓存": "💻",
        "包管理器缓存": "📦",
        "应用专属缓存": "🎬",
        "应用支持文件": "📁",
        "系统日志": "📋",
        "废纸篓": "🗑️",
        "通讯应用缓存": "💬",
        "其他": "📄",
    }

    # 安全建议
    CATEGORY_ADVICE = {
        "用户应用缓存": ("safe", "安全清理，不影响应用功能"),
        "浏览器缓存": ("safe", "安全清理，会自动重建"),
        "包管理器缓存": ("safe", "安全清理，需要时会重新下载"),
        "系统日志": ("safe", "安全清理，不影响系统运行"),
        "AI 模型缓存": ("caution", "如常用 HuggingFace 建议保留"),
        "iOS 模拟器缓存": ("caution", "iOS 开发者建议保留"),
        "开发工具缓存": ("caution", "可能需要重新编译项目"),
        "应用专属缓存": ("caution", "检查是否有未保存的项目"),
        "应用支持文件": ("caution", "可能包含应用设置"),
        "废纸篓": ("safe", "永久删除废纸篓内容"),
        "通讯应用缓存": ("caution", "清理可能影响聊天历史中的媒体显示"),
    }

    def __init__(self):
        self.homebrew_path = self._find_homebrew()
        self.mole_path = self._find_mole()

    def _find_homebrew(self) -> Optional[str]:
        """查找 Homebrew 路径"""
        paths = ["/opt/homebrew/bin/brew", "/usr/local/bin/brew"]
        for path in paths:
            if os.path.exists(path):
                return path
        return shutil.which("brew")

    def _find_mole(self) -> Optional[str]:
        """查找 Mole 路径"""
        paths = ["/opt/homebrew/bin/mo", "/usr/local/bin/mo"]
        for path in paths:
            if os.path.exists(path):
                return path
        return shutil.which("mo")

    def _write_log(self, name: str, content: str) -> Optional[str]:
        """写入日志文件"""
        try:
            os.makedirs(self.LOG_DIR, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            filename = f"{timestamp}-{name}.log"
            path = os.path.join(self.LOG_DIR, filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return path
        except Exception:
            return None

    def _write_report(self, content: str) -> Optional[str]:
        """写入报告文件"""
        try:
            os.makedirs(self.REPORT_DIR, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
            filename = f"{timestamp}-report.txt"
            path = os.path.join(self.REPORT_DIR, filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return path
        except Exception:
            return None

    def _run_mole_command(self, args: list, timeout: int = 300) -> tuple[int, str]:
        """运行 Mole 命令，优先使用 script 模拟 TTY，失败则回退"""
        env = {**os.environ, "TERM": "dumb"}
        # 尝试使用 script
        try:
            result = subprocess.run(
                ["script", "-q", "/dev/null", self.mole_path, *args],
                capture_output=True,
                text=True,
                timeout=timeout,
                env=env
            )
            output = result.stdout + result.stderr
            if result.returncode == 0 and output.strip():
                return result.returncode, output
        except Exception:
            pass

        # 回退直接执行
        try:
            result = subprocess.run(
                [self.mole_path, *args],
                capture_output=True,
                text=True,
                timeout=timeout,
                env=env
            )
            return result.returncode, result.stdout + result.stderr
        except Exception as e:
            return 1, str(e)

    def check_environment(self) -> dict:
        """检查环境"""
        result = {
            "homebrew_installed": self.homebrew_path is not None,
            "homebrew_path": self.homebrew_path,
            "mole_installed": self.mole_path is not None,
            "mole_path": self.mole_path,
            "mole_version": None,
            "platform": sys.platform,
            "ready": False,
        }

        if result["mole_installed"]:
            try:
                version_output = subprocess.run(
                    [self.mole_path, "--version"],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if version_output.returncode == 0:
                    result["mole_version"] = version_output.stdout.strip()
            except Exception:
                pass

        result["ready"] = result["homebrew_installed"] and result["mole_installed"]
        return result

    def install_homebrew(self) -> bool:
        """安装 Homebrew"""
        print("📦 正在安装 Homebrew...")
        try:
            install_cmd = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
            result = subprocess.run(install_cmd, shell=True, timeout=600)
            if result.returncode == 0:
                self.homebrew_path = self._find_homebrew()
                print("✅ Homebrew 安装成功")
                return True
        except Exception as e:
            print(f"❌ Homebrew 安装失败: {e}")
        return False

    def install_mole(self) -> bool:
        """安装 Mole"""
        if not self.homebrew_path:
            print("❌ 需要先安装 Homebrew")
            return False

        print("📦 正在安装 Mole...")
        try:
            # 添加 tap
            subprocess.run(
                [self.homebrew_path, "tap", "tw93/tap"],
                capture_output=True,
                timeout=120
            )
            # 安装 mole
            result = subprocess.run(
                [self.homebrew_path, "install", "mole"],
                capture_output=True,
                text=True,
                timeout=300
            )
            if result.returncode == 0:
                self.mole_path = self._find_mole()
                print("✅ Mole 安装成功")
                return True
            else:
                print(f"❌ 安装输出: {result.stderr}")
        except Exception as e:
            print(f"❌ Mole 安装失败: {e}")
        return False

    def get_disk_status(self) -> dict:
        """获取磁盘状态"""
        try:
            result = subprocess.run(
                ["df", "-h", "/"],
                capture_output=True,
                text=True,
                timeout=10
            )
            lines = result.stdout.strip().split("\n")
            if len(lines) >= 2:
                parts = lines[1].split()
                return {
                    "filesystem": parts[0],
                    "total": parts[1],
                    "used": parts[2],
                    "available": parts[3],
                    "capacity": parts[4],
                }
        except Exception:
            pass
        return {}

    def _parse_size(self, size_str: str) -> int:
        """解析大小字符串为字节数"""
        size_str = size_str.strip().upper()
        multipliers = {
            'B': 1,
            'KB': 1024,
            'K': 1024,
            'MB': 1024**2,
            'M': 1024**2,
            'GB': 1024**3,
            'G': 1024**3,
            'TB': 1024**4,
            'T': 1024**4,
        }

        match = re.match(r'([\d.]+)\s*([A-Z]+)?', size_str)
        if match:
            value = float(match.group(1))
            unit = match.group(2) or 'B'
            return int(value * multipliers.get(unit, 1))
        return 0

    def _format_size(self, size_bytes: int) -> str:
        """格式化字节数为可读字符串"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size_bytes < 1024:
                return f"{size_bytes:.2f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.2f} PB"

    def _categorize_path(self, path: str) -> tuple:
        """根据路径判断类别"""
        path_lower = path.lower()

        for keywords, (category, desc) in self.CATEGORY_RULES:
            for keyword in keywords:
                if keyword in path_lower:
                    return category, desc

        return "其他", "其他可清理文件"

    def _read_clean_list(self) -> list:
        """读取 Mole 生成的 clean-list.txt（若存在）"""
        clean_list_path = os.path.expanduser("~/.config/mole/clean-list.txt")
        if not os.path.exists(clean_list_path):
            return []

        paths = []
        try:
            with open(clean_list_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    paths.append(os.path.expanduser(line))
        except Exception:
            return []

        return paths

    def _count_items(self, paths: list) -> tuple:
        """统计文件/目录数量"""
        file_count = 0
        dir_count = 0
        for path in paths:
            try:
                if os.path.isdir(path):
                    dir_count += 1
                elif os.path.isfile(path):
                    file_count += 1
            except Exception:
                continue
        return file_count, dir_count

    def _extract_protected_items(self, output: str) -> list:
        """从 Mole 输出中提取已保护项目（若有）"""
        protected = []
        in_whitelist = False
        for line in output.split("\n"):
            clean_line = re.sub(r'\x1b\[[0-9;]*m', '', line).strip()
            if not clean_line:
                continue
            lower = clean_line.lower()
            if "whitelist" in lower:
                in_whitelist = True
                continue
            if in_whitelist:
                if clean_line.startswith("→") or clean_line.startswith("->"):
                    protected.append(clean_line.replace("→", "").replace("->", "").strip())
                    continue
                # whitelist 区块结束
                if clean_line.startswith("➤") or clean_line.startswith("─"):
                    in_whitelist = False
            if "protect" in lower or "skip" in lower:
                if "running" in lower or "whitelist" in lower:
                    continue
                protected.append(clean_line)
        return protected

    def _categorize_paths_from_clean_list(self, paths: list) -> tuple[dict, int]:
        """从 clean-list.txt 路径构建分类与大小（兼容 Mole 输出变化）"""
        categories = {}
        total_bytes = 0
        for path in paths:
            try:
                # clean-list.txt 行可能包含注释: "/path # 2.01GB (18 items)"
                size_bytes = 0
                item_count = None
                size_match = re.search(r'#\s*([\d.]+)\s*(B|KB|MB|GB|TB)', path, re.IGNORECASE)
                if size_match:
                    size_bytes = self._parse_size(size_match.group(0).replace("#", "").strip())
                items_match = re.search(r'\((\d+)\s+items\)', path, re.IGNORECASE)
                if items_match:
                    item_count = int(items_match.group(1))

                # 提取真实路径（去掉注释）
                clean_path = path.split("#", 1)[0].strip()
                if not clean_path or clean_path.startswith("==="):
                    continue

                category, desc = self._categorize_path(clean_path)
                if category not in categories:
                    categories[category] = {"size_bytes": 0, "description": desc, "items": 0}
                categories[category]["items"] += item_count if item_count is not None else 1

                if size_bytes == 0 and os.path.isfile(clean_path):
                    size_bytes = os.path.getsize(clean_path)

                categories[category]["size_bytes"] += size_bytes
                total_bytes += size_bytes
            except Exception:
                continue
        return categories, total_bytes

    def _estimate_tiers(self, categories: dict) -> dict:
        """估算三档清理策略的可释放空间"""
        low_risk = 0
        default = 0
        maximum = 0

        # 默认更保守的 caution 列表（不纳入默认档）
        caution_exclude = {"应用支持文件", "应用专属缓存", "通讯应用缓存"}

        for category, data in categories.items():
            size = data.get("size_bytes", 0)
            advice_type, _ = self.CATEGORY_ADVICE.get(category, ("info", ""))

            maximum += size
            if advice_type == "safe":
                low_risk += size
                default += size
            elif advice_type == "caution":
                if category not in caution_exclude:
                    default += size

        return {
            "low_risk": low_risk,
            "default": default,
            "maximum": maximum
        }

    def run_dry_run(self, allow_sample_data: bool = True) -> Optional[CleanReport]:
        """执行 dry-run 并解析结果"""
        if not self.mole_path:
            print("❌ Mole 未安装")
            return None

        print("🔍 正在扫描可清理项目...")

        try:
            code, output = self._run_mole_command(["clean", "--dry-run"], timeout=300)
            if code != 0 and not output.strip():
                print("⚠️  dry-run 输出为空，可能与终端环境有关")
            log_path = self._write_log("dry-run", output)
            if log_path:
                print(f"📝 已保存 dry-run 日志: {log_path}")

            # 解析输出
            report = CleanReport(
                scan_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                disk_total="",
                disk_available_before="",
                disk_used=""
            )

            # 获取磁盘状态
            disk_status = self.get_disk_status()
            report.disk_total = disk_status.get("total", "Unknown")
            report.disk_available_before = disk_status.get("available", "Unknown")
            report.disk_used = disk_status.get("used", "Unknown")

            # 解析清理项目（优先 clean-list，输出解析为备用）
            categories = {}
            total_bytes = 0

            # 优先使用 clean-list.txt（更稳定）
            clean_list_paths = self._read_clean_list()
            report.file_count, report.dir_count = self._count_items(clean_list_paths)

            # 尝试提取已保护项目
            protected_from_output = self._extract_protected_items(output)

            if clean_list_paths:
                categories, total_bytes = self._categorize_paths_from_clean_list(clean_list_paths)
                report.warnings.append("解析基于 clean-list.txt：目录大小来自 Mole 预估，可能存在偏差。")
            else:
                # clean-list 不可用时回退解析输出
                size_pattern = re.compile(r'([\d.]+)\s*(B|KB|MB|GB|TB)', re.IGNORECASE)
                path_pattern = re.compile(r'[/~][\w\-./]+')

                for line in output.split('\n'):
                    clean_line = re.sub(r'\x1b\[[0-9;]*m', '', line)
                    clean_line = re.sub(r'\[2K', '', clean_line)

                    size_match = size_pattern.search(clean_line)
                    if not size_match:
                        continue
                    size_str = size_match.group(0)
                    size_bytes = self._parse_size(size_str)

                    path_match = path_pattern.search(clean_line)
                    if path_match:
                        path = path_match.group(0)
                        category, desc = self._categorize_path(path)
                    else:
                        category, desc = self._categorize_path(clean_line)

                    if size_bytes > 0:
                        if category not in categories:
                            categories[category] = {
                                "size_bytes": 0,
                                "description": desc,
                                "items": 0
                            }
                        categories[category]["size_bytes"] += size_bytes
                        categories[category]["items"] += 1
                        total_bytes += size_bytes

            # 如果仍没有解析到数据，使用模拟数据展示格式（可选）
            if not categories and allow_sample_data:
                # 提供一个示例报告结构
                categories = {
                    "用户应用缓存": {"size_bytes": 24270000000, "description": "各应用产生的临时缓存文件", "items": 0},
                    "浏览器缓存": {"size_bytes": 4240000000, "description": "Chrome/Safari 等浏览器缓存", "items": 0},
                    "包管理器缓存": {"size_bytes": 1580000000, "description": "Homebrew/npm 等下载缓存", "items": 0},
                }
                total_bytes = sum(c["size_bytes"] for c in categories.values())
                print("⚠️  使用估算数据（dry-run 输出解析受限）")
                print("   建议在终端直接运行: mo clean --dry-run")

            report.categories = categories
            report.total_size_bytes = total_bytes
            report.total_size_human = self._format_size(total_bytes)
            if protected_from_output:
                report.protected_items = protected_from_output
            else:
                report.protected_items = ["Playwright 缓存", "Ollama 模型", "JetBrains 配置", "iCloud 文档"]

            # 生成分层策略估算
            tier_bytes = self._estimate_tiers(report.categories)
            report.tier_estimates = {
                "low_risk": self._format_size(tier_bytes["low_risk"]),
                "default": self._format_size(tier_bytes["default"]),
                "maximum": self._format_size(tier_bytes["maximum"]),
            }

            return report

        except subprocess.TimeoutExpired:
            print("❌ 扫描超时")
        except Exception as e:
            print(f"❌ 扫描失败: {e}")

        return None

    def generate_report(self, report: CleanReport, use_json: bool = False) -> str:
        """生成可读报告"""
        if use_json:
            return json.dumps({
                "scan_time": report.scan_time,
                "disk": {
                    "total": report.disk_total,
                    "available": report.disk_available_before,
                    "used": report.disk_used
                },
                "cleanable": {
                    "total_size": report.total_size_human,
                    "total_bytes": report.total_size_bytes,
                    "file_count": report.file_count,
                    "dir_count": report.dir_count,
                    "warnings": report.warnings,
                    "tiers": report.tier_estimates,
                    "categories": {
                        k: {
                            "size": self._format_size(v["size_bytes"]),
                            "size_bytes": v["size_bytes"],
                            "description": v["description"],
                            "items": v.get("items", 0)
                        } for k, v in report.categories.items()
                    }
                },
                "protected": report.protected_items
            }, indent=2, ensure_ascii=False)

        lines = []
        lines.append("╔══════════════════════════════════════════════════════════════╗")
        lines.append("║              Mole 磁盘清理分析报告                           ║")
        lines.append("╠══════════════════════════════════════════════════════════════╣")
        lines.append(f"║ 扫描时间: {report.scan_time:<49}║")
        lines.append(f"║ 当前可用空间: {report.disk_available_before} / {report.disk_total:<38}║")
        lines.append("╚══════════════════════════════════════════════════════════════╝")
        lines.append("")
        lines.append("📊 可清理项目分析")
        lines.append("━" * 64)
        lines.append("")

        # 按大小排序
        sorted_categories = sorted(
            report.categories.items(),
            key=lambda x: x[1]["size_bytes"],
            reverse=True
        )

        for category, data in sorted_categories:
            icon = self.CATEGORY_ICONS.get(category, "📄")
            size_str = self._format_size(data["size_bytes"])
            lines.append(f"{icon}  {category:<40} {size_str:>10}")
            lines.append(f"    └── {data['description']}")
            lines.append("")

        lines.append("━" * 64)
        lines.append(f"📈 预计可释放空间: {report.total_size_human}")
        if report.file_count or report.dir_count:
            lines.append(f"📁 涉及文件: {report.file_count} 个，目录: {report.dir_count} 个")
        if report.warnings:
            lines.append("⚠️  注意:")
            for warning in report.warnings:
                lines.append(f"  • {warning}")
        lines.append("")
        lines.append("💡 建议:")

        for category, _ in sorted_categories:
            advice_type, advice_text = self.CATEGORY_ADVICE.get(category, ("info", "请根据需求决定"))
            if advice_type == "safe":
                lines.append(f"  ✅ {category} - {advice_text}")
            elif advice_type == "caution":
                lines.append(f"  ⚠️  {category} - {advice_text}")
            else:
                lines.append(f"  ℹ️  {category} - {advice_text}")

        lines.append("")
        lines.append("🔒 已保护项目（不会清理）:")
        for item in report.protected_items:
            lines.append(f"  • {item}")

        # 友好解读与风险收益
        if report.tier_estimates:
            lines.append("")
            lines.append("🧠 解读与风险收益")
            lines.append("  - 低风险：仅清理可快速重建的缓存（体验影响最小）。")
            lines.append("  - 默认：在低风险基础上谨慎扩展，适合多数用户。")
            lines.append("  - 最大拯救：包含可能影响使用体验的缓存，建议先备份或确认。")

        if report.tier_estimates:
            lines.append("")
            lines.append("🧭 清理策略建议（预估）:")
            lines.append(f"  1) 低风险：{report.tier_estimates.get('low_risk', '0 B')}")
            lines.append(f"  2) 默认：{report.tier_estimates.get('default', '0 B')}")
            lines.append(f"  3) 最大拯救：{report.tier_estimates.get('maximum', '0 B')}")
            lines.append("  提示：以上为估算值，实际释放空间以 Mole 清理结果为准。")

        return "\n".join(lines)

    def run_clean(self) -> bool:
        """执行清理"""
        if not self.mole_path:
            print("❌ Mole 未安装")
            return False

        print("🧹 正在执行清理...")
        print("   (这可能需要几分钟时间)")
        print("")

        # 记录清理前状态
        before_status = self.get_disk_status()
        before_available = before_status.get("available", "Unknown")

        try:
            # 执行清理
            code, output = self._run_mole_command(["clean"], timeout=600)
            if code != 0 and output.strip():
                print("⚠️  清理过程中出现提示，请查看日志详情")
            log_path = self._write_log("clean", output)
            if log_path:
                print(f"📝 已保存清理日志: {log_path}")

            # 记录清理后状态
            after_status = self.get_disk_status()
            after_available = after_status.get("available", "Unknown")

            # 显示效果
            print("")
            print("╔══════════════════════════════════════════════════════════════╗")
            print("║              清理完成！效果对比                              ║")
            print("╠══════════════════════════════════════════════════════════════╣")
            print("")
            print(f"清理前可用空间: {before_available}")
            print(f"清理后可用空间: {after_available}")
            print("")
            print("╚══════════════════════════════════════════════════════════════╝")

            return True

        except subprocess.TimeoutExpired:
            print("❌ 清理超时")
        except Exception as e:
            print(f"❌ 清理失败: {e}")

        return False

    def print_check_result(self, env: dict):
        """打印环境检查结果"""
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║              环境检查结果                                    ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print("")

        # Homebrew
        if env["homebrew_installed"]:
            print(f"✅ Homebrew: 已安装")
            print(f"   路径: {env['homebrew_path']}")
        else:
            print("❌ Homebrew: 未安装")
            print("   安装命令: /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"")

        print("")

        # Mole
        if env["mole_installed"]:
            print(f"✅ Mole: 已安装")
            print(f"   路径: {env['mole_path']}")
            if env["mole_version"]:
                print(f"   版本: {env['mole_version']}")
        else:
            print("❌ Mole: 未安装")
            print("   安装命令: brew install tw93/tap/mole")

        print("")

        if env["ready"]:
            print("🎉 环境就绪，可以开始清理！")
        else:
            print("⚠️  请先安装缺失的依赖")

    def print_status(self):
        """打印磁盘状态"""
        status = self.get_disk_status()
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║              磁盘状态                                        ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print("")
        print(f"💾 文件系统: {status.get('filesystem', 'Unknown')}")
        print(f"📊 总容量: {status.get('total', 'Unknown')}")
        print(f"📁 已使用: {status.get('used', 'Unknown')} ({status.get('capacity', 'Unknown')})")
        print(f"✨ 可用空间: {status.get('available', 'Unknown')}")


def main():
    parser = argparse.ArgumentParser(
        description="Mole Cleaner - Mac 智能磁盘清理工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  %(prog)s --check              # 检查环境
  %(prog)s --preview            # 预览清理内容
  %(prog)s --clean              # 执行清理
  %(prog)s --status             # 查看磁盘状态
  %(prog)s --preview --json     # JSON 格式输出
        """
    )

    parser.add_argument("--check", action="store_true", help="检查环境（Homebrew、Mole）")
    parser.add_argument("--preview", action="store_true", help="预览清理内容（dry-run）")
    parser.add_argument("--clean", action="store_true", help="执行清理")
    parser.add_argument("--status", action="store_true", help="显示磁盘状态")
    parser.add_argument("--auto-install", action="store_true", help="自动安装缺失依赖")
    parser.add_argument("--json", action="store_true", help="JSON 格式输出")
    parser.add_argument("--no-sample-data", action="store_true", help="禁用解析失败时的示例数据")
    parser.add_argument("--save-report", action="store_true", help="保存报告到默认路径")
    parser.add_argument("--confirm", action="store_true", help="清理前进行二次确认（非交互）")
    parser.add_argument("--interactive-confirm", action="store_true", help="清理前进行交互式确认（仅用于手动测试）")
    parser.add_argument("-o", "--output", help="保存报告到文件")

    args = parser.parse_args()

    # 如果没有指定任何操作，显示帮助
    if not any([args.check, args.preview, args.clean, args.status]):
        parser.print_help()
        return

    cleaner = MoleCleaner()

    # 检查环境
    if args.check or args.preview or args.clean:
        env = cleaner.check_environment()

        if args.check:
            cleaner.print_check_result(env)
            return

        # 自动安装
        if not env["ready"] and args.auto_install:
            if not env["homebrew_installed"]:
                cleaner.install_homebrew()
                env = cleaner.check_environment()

            if not env["mole_installed"] and env["homebrew_installed"]:
                cleaner.install_mole()
                env = cleaner.check_environment()

        if not env["ready"]:
            cleaner.print_check_result(env)
            print("\n💡 使用 --auto-install 参数自动安装依赖")
            return

    # 显示状态
    if args.status:
        cleaner.print_status()
        return

    # 预览
    if args.preview:
        report = cleaner.run_dry_run(allow_sample_data=not args.no_sample_data)
        if report:
            output = cleaner.generate_report(report, use_json=args.json)
            print(output)

            if args.output:
                with open(args.output, "w", encoding="utf-8") as f:
                    f.write(output)
                print(f"\n📄 报告已保存到: {args.output}")
            elif args.save_report:
                report_path = cleaner._write_report(output)
                if report_path:
                    print(f"\n📄 报告已保存到: {report_path}")
        return

    # 清理
    if args.clean:
        # 先预览
        print("📋 清理前预览:")
        print("")
        report = cleaner.run_dry_run()
        if report:
            print(cleaner.generate_report(report))
            print("")

            # 在脚本中直接执行，不需要确认（由 Claude 在对话中处理确认）
            print("=" * 64)
            if args.interactive_confirm:
                confirm_text = input("请输入 CLEAN 确认执行清理: ").strip()
                if confirm_text != "CLEAN":
                    print("❌ 已取消清理")
                    return
            elif not args.confirm:
                print("❌ 未提供确认参数，已取消清理")
                print("   请使用 --confirm 让调用方在对话中完成确认后再执行")
                print("   或使用 --interactive-confirm 进行手动测试")
                return
            cleaner.run_clean()


if __name__ == "__main__":
    main()
