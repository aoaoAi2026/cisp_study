import sys

with open('scripts/gen_cyberAi_part2.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines, 1):
    for j, ch in enumerate(line):
        if ch in '([{':
            stack.append((ch, i, j+1, line.strip()[:80]))
        elif ch in ')]}':
            expected = {')': '(', ']': '[', '}': '{'}
            if not stack:
                print(f'Line {i},col {j+1}: Extra closing {ch!r}')
                print(f'  Context: {line.strip()[:100]}')
                sys.exit(1)
            if stack[-1][0] != expected[ch]:
                print(f'Line {i},col {j+1}: Mismatch: expected closing for {stack[-1][0]!r}, got {ch!r}')
                print(f'  Opened at line {stack[-1][1]}: {stack[-1][3]}')
                sys.exit(1)
            stack.pop()

print(f'Total unmatched opens: {len(stack)}')
for item in stack[-10:]:
    print(f'  {item[0]!r} at line {item[1]}, col {item[2]}: {item[3]}')
