"""Fix ALL triple-quote patterns inside gen() string literals.
Handles:
1. Single-line: """text""" -> # text  
2. Standalone opening: """ -> ''' (use single quotes for docstrings)
3. Standalone closing: """ -> '''
"""
import re, os

path = r'e:\internal_safe\cisp1\cisp\scripts\gen_penetration.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

original = content
fix_count = 0

# First pass: single-line """text""" -> # text (already done, but be safe)
# This should only match indented lines (inside code blocks)
# Wait - I need to be very careful about what lines to touch.
# The gen() calls use pattern: gen('day-X.md', """...content...""")
# The content part contains markdown code blocks with python code that has """ docstrings

# Let me look at the actual content causing issues.
# Strategy: find all lines that are JUST """ with optional whitespace prefix,
# that appear to be inside code blocks (they'll have significant indentation)

lines = content.split('\n')
new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Only modify lines that are:
    # 1. Just whitespace + """ (standalone triple quote)
    # 2. Have at least 4 spaces indentation (inside code blocks)
    stripped = line.strip()
    
    if stripped in ('"""', '"""') and len(line) - len(line.lstrip()) >= 4:
        # This is likely a standalone docstring delimiter inside a code block
        # Replace with same-indentation '''
        indent = line[:len(line) - len(line.lstrip())]
        new_lines.append(indent + "'''")
        fix_count += 1
    else:
        new_lines.append(line)
    i += 1

new_content = '\n'.join(new_lines)
if new_content != original:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Fixed {fix_count} standalone """ lines')
else:
    print('No changes needed')
