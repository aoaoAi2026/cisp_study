"""Find the exact error in gen_cyberAi_part2.py"""
import ast, sys, re

with open('scripts/gen_cyberAi_part2.py', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = content.split('\n')

# First, check if import json works
try:
    ast.parse('import json\n')
    print("import json: OK")
except SyntaxError as e:
    print(f"import json: FAIL: {e}")

# Try parsing the helper functions only (up to line 35, before data)
end_of_helpers = 35
helper_code = '\n'.join(lines[:end_of_helpers])
try:
    ast.parse(helper_code)
    print(f"Helpers (lines 1-{end_of_helpers}): OK")
except SyntaxError as e:
    print(f"Helpers (lines 1-{end_of_helpers}): FAIL at line {e.lineno}: {e.msg}")
    print(f"  Text: {e.text}")

# Try with ALL lines (should fail at line 401)
try:
    ast.parse(content)
    print("Full file: OK")
except SyntaxError as e:
    print(f"\nFull file FAIL at line {e.lineno}: {e.msg}")
    print(f"  Text: {e.text}")
    
    # Show context
    ln = e.lineno
    print(f"\nContext around line {ln}:")
    for offset in range(-5, 3):
        l = ln + offset
        if 1 <= l <= len(lines):
            marker = '>>>' if l == ln else '   '
            truncated = lines[l-1][:150]
            print(f'{marker} {l}: {truncated}')
    
    # Check stack/indentation
    # Look backwards from the error to see if there's an extra or missing bracket
    # Check for unmatched [ ] ( ) { } in the file
    stack = []
    in_str = False
    str_char = None
    escape = False
    for i, ch in enumerate(content[:content.index('\n', sum(len(l)+1 for l in lines[:ln-1]))]):
        if escape:
            escape = False
            continue
        if in_str:
            if ch == '\\':
                escape = True
            elif ch == str_char:
                in_str = False
        else:
            if ch in '"\'':
                in_str = True
                str_char = ch
            elif ch in '([{':
                stack.append((ch, content[:i].count('\n')+1))
            elif ch in ')]}':
                expected = {'(':')', '[':']', '{':'}'}
                if not stack:
                    print(f'\nExtra closing {ch!r} at line {content[:i].count("\n")+1}')
                elif stack[-1][0] not in expected or expected[stack[-1][0]] != ch:
                    print(f'\nMismatch: expected {expected.get(stack[-1][0],"?")} got {ch!r} at line {content[:i].count("\n")+1}')
                    print(f'  Opened at line {stack[-1][1]}')
                else:
                    stack.pop()
    
    if stack:
        print(f'\nUnmatched opens ({len(stack)}):')
        for ch, line_num in stack[-10:]:
            print(f'  {ch!r} at line {line_num}')
