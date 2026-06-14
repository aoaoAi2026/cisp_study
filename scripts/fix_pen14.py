import json, re

fpath = r'e:\internal_safe\cisp1\cisp\src\data\cyberPenetration.ts'
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

resources = [
    {"name": "缓冲区溢出基础教程", "url": "https://www.corelan.be/index.php/2009/07/19/exploit-writing-tutorial-part-1-stack-based-overflows/", "type": "article"},
    {"name": "x86汇编入门", "url": "https://www.cs.virginia.edu/~evans/cs216/guides/x86.html", "type": "article"},
    {"name": "GDB调试完全指南", "url": "https://www.freebuf.com/articles/system/298023.html", "type": "article"},
    {"name": "二进制安全入门", "url": "https://www.anquanke.com/post/id/278901", "type": "article"}
]
res_str = ',\n      resources: ' + json.dumps(resources, ensure_ascii=False)

# Find pen-14
idx = content.find("id: 'pen-14'")
# Find the closing of pen-14's codeExamples or last module before quiz/index going
# pen-14 has quiz: [...] then expertNotes: [...] then environmentSetup: {...}
# I need to find the closing } of pen-14's day object

# Strategy: find the closing brace that's followed by the next day or end of array
# Look for '  },'  or '  }\n' after the day
env_idx = content.find('environmentSetup: {', idx)
if env_idx > 0:
    # From env, find the closing } of environmentSetup
    depth = 0
    in_str = False
    esc = False
    for i in range(env_idx, len(content)):
        c = content[i]
        if esc:
            esc = False
            continue
        if c == '\\':
            esc = True
            continue
        if c in '\'"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                env_end = i
                break
    
    # Now find the day's closing } after env
    # it should be '\n      },' or '\n    },'
    # Look from env_end for the next } at same indentation
    rest = content[env_end:]
    # Find the next } that's at indentation level (either '  }' or '    }')
    m = re.search(r'\n  \}', rest[:200])  # pen days start with 2-space indent
    if not m:
        # Maybe } at different indent
        m = re.search(r'\n    \}', rest[:300])
    if not m:
        # Last resort: find any }
        m = re.search(r'\n\}', rest[:300])
    
    if m:
        insert_pos = env_end + m.start()
        new_text = content[:insert_pos] + res_str + content[insert_pos:]
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_text)
        print(f'pen-14: +resources (4条) 修复成功')
    else:
        print(f'pen-14: 找不到day结束位置')
else:
    # Fallback: find quiz and insert after it
    quiz_idx = content.find('quiz: [', idx)
    if quiz_idx > 0:
        # Find the last ] in quiz array then insert
        bracket_depth = 0
        for i in range(quiz_idx, len(content)):
            c = content[i]
            if c == '[':
                bracket_depth += 1
            elif c == ']':
                bracket_depth -= 1
                if bracket_depth == 0:
                    insert_pos = i + 1
                    new_text = content[:insert_pos] + res_str + content[insert_pos:]
                    with open(fpath, 'w', encoding='utf-8') as f:
                        f.write(new_text)
                    print(f'pen-14: +resources (4条) 备选方案成功')
                    break
        else:
            print('pen-14: 备选方案失败')
    else:
        print('pen-14: 找不到quiz')

import re
