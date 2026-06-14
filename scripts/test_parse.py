"""Test if Python can parse various unicode patterns"""
import ast, sys

# Test 1: full-width comma inside string
code = 'x = "hello\uff0cworld"'
try:
    ast.parse(code)
    print("Test 1 PASS: full-width comma inside string")
except SyntaxError as e:
    print(f"Test 1 FAIL: {e}")

# Test 2: curly quotes inside string
code2 = 'x = "hello\u201cworld\u201d"'
try:
    ast.parse(code2)
    print("Test 2 PASS: curly quotes inside string")
except SyntaxError as e:
    print(f"Test 2 FAIL: {e}")

# Test 3: full-width comma OUTSIDE string
code3 = 'x\uff0cy = 1'
try:
    ast.parse(code3)
    print("Test 3 PASS: full-width comma outside string")
except SyntaxError as e:
    print(f"Test 3 FAIL: {e}")

# Test 4: Try to read and parse the actual file
try:
    with open('scripts/gen_cyberAi_part2.py', 'r', encoding='utf-8') as f:
        content = f.read()
    ast.parse(content)
    print("Test 4 PASS: gen_cyberAi_part2.py parses correctly!")
except SyntaxError as e:
    print(f"Test 4 FAIL: {e}")
    # Show context
    lines = content.split('\n')
    if e.lineno:
        ln = e.lineno
        print(f"\nLines around error (line {ln}):")
        for offset in range(-3, 4):
            l = ln + offset
            if 1 <= l <= len(lines):
                marker = '>>>' if l == ln else '   '
                print(f'{marker} {l}: {lines[l-1][:120]}')

print("\nDone")
