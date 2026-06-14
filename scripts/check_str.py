"""Check for string-level issues in the Python file"""
import re

with open('scripts/gen_cyberAi_part2.py', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# Find all non-ASCII characters that might be problematic
for i, line in enumerate(lines, 1):
    # Check for characters that Python 3 might reject
    for j, ch in enumerate(line):
        if ord(ch) > 127:
            # Check if it's a character Python might not handle well
            cat = 'ok'
            if ch in '\u201c\u201d\u2018\u2019':  # curly quotes
                cat = 'CURLY_QUOTE'
            elif ch in '\uff0c':  # full-width comma
                cat = 'FW_COMMA'
            elif ch in '\uff08\uff09':  # full-width parens
                cat = 'FW_PAREN'
            elif ch in '\u3001\u3002':  # ideographic comma/stop
                cat = 'IDEO_PUNCT'
            if cat != 'ok':
                ctx = line[max(0,j-10):j+10]
                # Only report suspicious cases
                pass

# Check Q function calls specifically - look for unescaped double quotes
idx = 0
while True:
    idx = content.find('Q({', idx)
    if idx == -1:
        break
    # Find the matching closing
    depth = 0
    end = idx + 1
    in_str = False
    str_char = None
    for k in range(idx+1, min(idx+2000, len(content))):
        c = content[k]
        if in_str:
            if c == '\\':
                pass  # escape next char
            elif c == str_char:
                in_str = False
                str_char = None
        else:
            if c in '"\'':
                in_str = True
                str_char = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = k + 2  # include })
                    break
    
    q_text = content[idx:end]
    # Check for common issues
    if q_text.count('"') % 2 != 0:
        line_num = content[:idx].count('\n') + 1
        print(f'Q call at line {line_num}: ODD number of double quotes!')
        print(f'  Context: {q_text[:200]}...')
    
    idx = end

print('String check complete')
