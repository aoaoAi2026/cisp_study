import re, sys

with open('scripts/gen_all_remaining.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check for potential r-string issues: """ inside another r"""
for i, line in enumerate(lines, 1):
    # Look for r""" start
    stripped = line.strip()
    if 'r"""' in stripped and not stripped.startswith('#'):
        # Check following lines for inner """
        for j in range(i, min(i+200, len(lines))):
            if '"""' in lines[j] and not lines[j].strip().startswith('#'):
                # Check if it's an inner """ and not the closing one
                indent = len(lines[j]) - len(lines[j].lstrip())
                inner = lines[j].strip()
                if inner.count('"""') > 0 and j > i:
                    if inner.strip() != '"""' and inner.strip() != '"""),':
                        # Possible inner triple quotes in a code block/docstring
                        if 'def ' not in lines[j-1] and 'class ' not in lines[j-1]:
                            print(f"  Line {j}: {inner.strip()[:80]}")

print("Check complete.")
# Now try compiling
try:
    compile(open('scripts/gen_all_remaining.py','r',encoding='utf-8').read(), 'gen_all_remaining.py', 'exec')
    print("Syntax OK!")
except SyntaxError as e:
    print(f"SyntaxError at line {e.lineno}: {e.msg}")
    if e.lineno:
        for offset in range(-3, 4):
            ln = e.lineno + offset
            if 1 <= ln <= len(lines):
                marker = '>>' if offset == 0 else '  '
                print(f"{marker} {ln}: {lines[ln-1].rstrip()}")
