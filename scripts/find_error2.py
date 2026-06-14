"""Incremental parse: add lines one by one until syntax error"""
import ast, sys

with open('scripts/gen_cyberAi_part2.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Try adding lines incrementally
good_upto = 0
for i in range(len(lines)):
    partial = ''.join(lines[:i+1])
    try:
        ast.parse(partial)
        good_upto = i + 1
    except SyntaxError as e:
        print(f"First syntax error at line {i+1}: {e}")
        ctx_start = max(0, i-3)
        for j in range(ctx_start, min(len(lines), i+2)):
            marker = '>>>' if j == i else '   '
            print(f'{marker} L{j+1}: {lines[j].rstrip()[:120]}')
        print(f'\nLast good line: {good_upto}')
        break
else:
    print(f'All {len(lines)} lines parse OK')
