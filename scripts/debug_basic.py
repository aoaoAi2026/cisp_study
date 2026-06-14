"""调试 basic 文件的 day 边界查找"""
import re, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(BASE, 'src', 'data', 'cyberBasic.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# 找到所有 day id
for m in re.finditer(r"id:\s*'([^']+)'", content):
    did = m.group(1)
    if not did.startswith('basic-'):
        continue
    obj_start = content.rfind('{', 0, m.start())
    if obj_start < 0:
        print(f'{did}: rfind 找不到 {{，跳过')
        continue
    
    # 括号计数
    depth = 0
    in_single = False
    in_double = False
    in_backtick = False
    i = obj_start
    closed = False
    
    while i < len(content) and i < obj_start + 50000:  # 限制范围
        c = content[i]
        
        # 简单处理：优先检查字符串
        if c == "'" and not in_double and not in_backtick:
            in_single = not in_single
        elif c == '"' and not in_single and not in_backtick:
            in_double = not in_double
        elif c == '`' and not in_single and not in_double:
            in_backtick = not in_backtick
        elif not in_single and not in_double and not in_backtick:
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    offset = i - obj_start
                    snippet = content[i-30:i+30]
                    print(f'{did}: obj_start={obj_start}, day_end={i}, depth_offset={offset}, near: ...{repr(snippet)}...')
                    closed = True
                    break
        i += 1
    
    if not closed:
        print(f'{did}: obj_start={obj_start}, 未找到匹配的 }} (depth={depth})')
        # 显示 obj_start 附近内容
        snippet = content[obj_start:obj_start+200]
        print(f'  obj_start 附近: {repr(snippet[:200])}')
    break  # 只看第一个
