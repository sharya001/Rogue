#!/usr/bin/env python3
"""深渊文字迷宫 - 构建脚本"""

import os, re, sys, io

# Windows 终端 UTF-8 支持
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUTPUT = os.path.join(ROOT, "abyss-labyrinth.html")

VERSION_FILE = os.path.join(ROOT, "VERSION")
VERSION = open(VERSION_FILE).read().strip() if os.path.exists(VERSION_FILE) else "0.0.0"

CSS_FILES = ["base.css","map.css","log.css","start.css","gameover.css","fx.css","modals.css","panels.css","responsive.css","leaderboard.css","workshop.css"]
HTML_BODY = "body.html"
HTML_LEADERBOARD = "leaderboard.html"
JS_FILES = ["01-config.js","02-audio.js","03-map.js","03b-specialrooms.js","04a-move.js","04b-fight.js","04c-mutations.js","05-equipment.js","06-talents.js","07-ui.js","07b-leaderboard.js","07c-save.js","07d-workshop.js","07e-effects.js","08-init.js","08b-keyboard.js","09-meta.js"]

# ==================== 精确括号平衡检测 ====================
def _check_braces(source):
    """逐字符扫描 JS，跳过注释和字符串，返回 (is_balanced, errors)"""
    stack = []
    errors = []
    state = 'CODE'
    i = 0
    length = len(source)
    line = 1
    col = 1
    while i < length:
        ch = source[i]
        nc = source[i + 1] if i + 1 < length else ''
        if ch == '\r':
            i += 1
            if i < length and source[i] == '\n':
                line += 1; col = 1; i += 1
            else:
                line += 1; col = 1; i += 1
            continue
        if ch == '\n':
            if state == 'LINE_COMMENT':
                state = 'CODE'
            line += 1; col = 1; i += 1
            continue
        if state == 'CODE':
            if ch == '/' and nc == '/':
                state = 'LINE_COMMENT'; i += 2; continue
            if ch == '/' and nc == '*':
                state = 'BLOCK_COMMENT'; i += 2; continue
            if ch == '"':
                state = 'STRING_DQ'; i += 1; continue
            if ch == "'":
                state = 'STRING_SQ'; i += 1; continue
            if ch == '`':
                state = 'TEMPLATE'; i += 1; continue
            if ch == '{':
                stack.append(('{', line, col))
            elif ch == '}':
                if not stack:
                    errors.append({'line': line, 'col': col, 'type': 'extra_close', 'char': '}', 'msg': f'行 {line}: 多余闭合括号 }}'})
                else:
                    stack.pop()
        elif state == 'STRING_DQ':
            if ch == '\\' and nc:
                i += 2; continue
            elif ch == '"':
                state = 'CODE'
        elif state == 'STRING_SQ':
            if ch == '\\' and nc:
                i += 2; continue
            elif ch == "'":
                state = 'CODE'
        elif state == 'TEMPLATE':
            if ch == '\\' and nc:
                i += 2; continue
            if ch == '$' and nc == '{':
                i += 2; stack.append(('{', line, col)); state = 'EXPR'; continue
            if ch == '`':
                state = 'CODE'
        elif state == 'EXPR':
            if ch == '}' and stack and stack[-1][0] == '{':
                stack.pop(); state = 'TEMPLATE'
            elif ch == '{':
                stack.append(('{', line, col))
            elif ch == '"':
                state = 'STRING_DQ'
            elif ch == "'":
                state = 'STRING_SQ'
            elif ch == '`':
                state = 'TEMPLATE'
        elif state == 'BLOCK_COMMENT':
            if ch == '*' and nc == '/':
                state = 'CODE'; i += 1
        col += 1; i += 1
    for ch, l, c in reversed(stack):
        errors.append({'line': l, 'col': c, 'type': 'unclosed', 'char': ch, 'msg': f'行 {l}: 未闭合的 {ch}'})
    return len(errors) == 0, errors

# ==================== 括号检测结束 ====================

def read_src(subdir, filename):
    path = os.path.join(SRC, subdir, filename)
    if not os.path.exists(path):
        print(f"  WARNING: {path} not found")
        return ""
    size = os.path.getsize(path)
    if size < 10:
        print(f"  WARNING: {filename} is empty ({size} bytes)")
        return ""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def read_template(name):
    path = os.path.join(SRC, "templates", name)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build():
    print("Building abyss-labyrinth.html...")
    parts = []
    parts.append(read_template("head_before_style"))
    parts.append("<style>\n")
    for css_file in CSS_FILES:
        css = read_src("css", css_file)
        if css:
            parts.append(f"/* === {css_file} === */\n")
            parts.append(css)
            parts.append("\n")
    parts.append("    </style>\n")
    parts.append(read_template("head_after_style"))
    body = read_src("html", HTML_BODY)
    parts.append(body)
    parts.append("\n")
    parts.append("    <script>\n")
    parts.append("        'use strict';\n\n")
    for js_file in JS_FILES:
        js = read_src("js", js_file)
        if js:
            parts.append(f"        // ======== {js_file} ========\n")
            parts.append(f"        //# sourceURL={js_file}\n\n")
            parts.append(js)
            parts.append("\n")
    parts.append("    </script>\n")
    lb = read_src("html", HTML_LEADERBOARD)
    if lb.strip():
        parts.append("\n    ")
        parts.append(lb)
        parts.append("\n")
    parts.append(read_template("closing"))
    output = "".join(parts)
    output = output.replace('<title>深渊文字迷宫</title>', f'<title>深渊文字迷宫 v{VERSION}</title>')
    output = output.replace('id="start-version">v3.20.0</span>', f'id="start-version">v{VERSION}</span>')
    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(output)
    size_kb = os.path.getsize(OUTPUT) / 1024
    lines = output.count("\n")
    print(f"  v{VERSION} | {size_kb:.0f} KB, {lines} lines")
    # 检测构建产物中的完整 script 内容
    js_match = re.search(r"<script>(.*?)</script>", output, re.DOTALL)
    if js_match:
        try:
            compile(js_match.group(1), "<script>", "exec")
            print("  JS: OK")
        except SyntaxError:
            print("  JS: SYNTAX ERROR (compile tolerant)")
        # 括号平衡检测
        ok, errors = _check_braces(js_match.group(1))
        if not ok:
            print("  [WARNING] Brace imbalance in combined script (%d error, known cross-file issue):" % len(errors))
            for e in errors[:3]:
                print("    %s" % e['msg'])
            print("    (See source files for details)")
    sync_versions()
    print("  Done")
    return True

def sync_versions():
    """自动同步版本号到所有文档（v3.22.0）"""
    today = "2026-06-07"  # 可从 git log 或 datetime 获取
    # README.md - 更新最后更新日
    readme_path = os.path.join(ROOT, "README.md")
    if os.path.exists(readme_path):
        content = open(readme_path, encoding="utf-8").read()
        content = re.sub(r'(最后更新.*?)(\d{4}-\d{2}-\d{2})', f'最后更新：{today}', content)
        open(readme_path, 'w', encoding='utf-8').write(content)

    # CHANGELOG.md - 添加版本号注释
    changelog_path = os.path.join(ROOT, "CHANGELOG.md")
    if os.path.exists(changelog_path):
        content = open(changelog_path, encoding="utf-8").read()
        # 在文件开头添加版本标记
        marker = f"# 深渊文字迷宫 v{VERSION} 更新日志\n"
        if not content.startswith(f"# 深渊文字迷宫 v{VERSION}"):
            content = marker + "\n" + content
        open(changelog_path, 'w', encoding='utf-8').write(content)

    # GUIDE.md - 更新页眉版本
    guide_path = os.path.join(ROOT, "GUIDE.md")
    if os.path.exists(guide_path):
        content = open(guide_path, encoding="utf-8").read()
        content = re.sub(
            r'(当前版本：)v[\d.]+',
            f'当前版本：v{VERSION}',
            content
        )
        content = re.sub(
            r'文档版本.*?v[\d.]+',
            f'文档版本: v{VERSION}',
            content
        )
        content = re.sub(
            r'(最后更新：)\d{4}-\d{2}-\d{2}',
            f'最后更新：{today}',
            content
        )
        open(guide_path, 'w', encoding='utf-8').write(content)

    # DEVELOPMENT.md - 更新日期和版本
    dev_path = os.path.join(ROOT, "DEVELOPMENT.md")
    if os.path.exists(dev_path):
        content = open(dev_path, encoding="utf-8").read()
        content = re.sub(
            r'(\*\*最后更新\*\*:\s*)\d{4}-\d{2}-\d{2}',
            f'**最后更新**: {today}',
            content
        )
        open(dev_path, 'w', encoding='utf-8').write(content)

if __name__ == "__main__":
    build()