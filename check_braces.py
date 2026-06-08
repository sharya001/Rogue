#!/usr/bin/env python3
"""JS 括号平衡精确检测器

逐字符扫描 JS 源码，跳过注释和字符串，精确检测 { } 是否平衡。
不平衡时输出精确到行/列的错误信息。
"""

def check_braces(source):
    """
    精确检测括号平衡。
    
    返回: (is_balanced, errors)
    errors 格式: [
        {"line": 10, "col": 5, "type": "extra_close", "char": "}", "msg": "..."},
        {"line": 50, "col": 3, "type": "unclosed", "char": "{", "msg": "..."},
    ]
    """
    stack = []  # [(char, line, col)]
    errors = []
    state = 'CODE'  # CODE | STRING_DQ | STRING_SQ | TEMPLATE | EXPR | LINE_COMMENT | BLOCK_COMMENT
    i = 0
    length = len(source)
    line = 1
    col = 1
    
    while i < length:
        ch = source[i]
        next_ch = source[i + 1] if i + 1 < length else ''
        
        # 换行符必须在所有状态处理之前检查，因为 LINE_COMMENT 需要在这里回到 CODE
        if ch == '\n':
            if state == 'LINE_COMMENT':
                state = 'CODE'
            line += 1
            col = 1
            i += 1
            continue
        if ch == '\r':  # Windows 换行
            i += 1
            if i < length and source[i] == '\n':
                line += 1
                col = 1
                i += 1
            else:
                line += 1
                col = 1
                i += 1
            continue
        
        # ===================== CODE 状态 =====================
        if state == 'CODE':
            # 注释
            if ch == '/' and next_ch == '/':
                state = 'LINE_COMMENT'
                i += 2
                continue
            elif ch == '/' and next_ch == '*':
                state = 'BLOCK_COMMENT'
                i += 2
                continue
            # 字符串
            elif ch == '"':
                state = 'STRING_DQ'
                i += 1
                continue
            elif ch == "'":
                state = 'STRING_SQ'
                i += 1
                continue
            elif ch == '`':
                state = 'TEMPLATE'
                i += 1
                continue
            # 真正的括号
            elif ch == '{':
                stack.append(('{', line, col))
            elif ch == '}':
                if not stack:
                    errors.append({
                        'line': line, 'col': col,
                        'type': 'extra_close',
                        'char': '}',
                        'msg': f"行 {line}: 多余闭合括号 '}}'",
                    })
                else:
                    stack.pop()
        
        # ===================== 双引号字符串 =====================
        elif state == 'STRING_DQ':
            if ch == '\\' and next_ch:
                i += 2
                continue
            elif ch == '"':
                state = 'CODE'
        
        # ===================== 单引号字符串 =====================
        elif state == 'STRING_SQ':
            if ch == '\\' and next_ch:
                i += 2
                continue
            elif ch == "'":
                state = 'CODE'
        
        # ===================== 模板字符串 =====================
        elif state == 'TEMPLATE':
            if ch == '\\' and next_ch:
                i += 2
                continue
            elif ch == '$' and next_ch == '{':
                i += 2
                stack.append(('{', line, col))
                state = 'EXPR'
                continue
            elif ch == '`':
                state = 'CODE'
        
        # ===================== ${} 表达式内部 =====================
        elif state == 'EXPR':
            if ch == '}' and stack and stack[-1][0] == '{':
                stack.pop()
                state = 'TEMPLATE'
            elif ch == '{':
                stack.append(('{', line, col))
            elif ch == '"':
                state = 'STRING_DQ'
            elif ch == "'":
                state = 'STRING_SQ'
            elif ch == '`':
                state = 'TEMPLATE'
        
        # ===================== 多行注释 =====================
        elif state == 'BLOCK_COMMENT':
            if ch == '*' and next_ch == '/':
                state = 'CODE'
                i += 1  # 跳过 '/'
        
        col += 1
        i += 1
    
    # 未闭合的括号
    for ch, l, c in reversed(stack):
        errors.append({
            'line': l, 'col': c,
            'type': 'unclosed',
            'char': ch,
            'msg': f"行 {l}: 未闭合的 '{ch}'",
        })
    
    return len(errors) == 0, errors


def check_file(filepath):
    """检查单个文件，返回 (ok, errors)"""
    with open(filepath, 'r', encoding='utf-8') as f:
        source = f.read()
    # DEBUG
    if '09-meta-test' in filepath:
        import sys; sys.stdout.write('DEBUG: source len=%d, opens=%d, closes=%d\n' % (len(source), source.count('{'), source.count('}')))
    return check_braces(source)


if __name__ == '__main__':
    import sys
    import os
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    
    if len(sys.argv) < 2:
        print(f"用法: python check_braces.py <file_or_dir> [file2 ...]")
        sys.exit(1)
    
    all_ok = True
    for target in sys.argv[1:]:
        if os.path.isdir(target):
            files = [os.path.join(target, f) for f in os.listdir(target) if f.endswith('.js')]
        else:
            files = [target]
        
        for fp in files:
            if not os.path.exists(fp):
                print(f"  SKIP: {fp} not found")
                continue
            ok, errors = check_file(fp)
            if not ok:
                all_ok = False
                print(f"\n  [ERROR] {os.path.basename(fp)} ({len(errors)} error{'s' if len(errors) > 1 else ''}):")
                for err in errors:
                    print(f"    {err['msg']}")
            else:
                print(f"  [OK] {os.path.basename(fp)}")
    
    sys.exit(0 if all_ok else 1)
