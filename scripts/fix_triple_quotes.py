"""Fix r-string triple-quote conflicts in gen scripts.
Inside r\"\"\"...\"\"\", any \"\"\" will prematurely close the r-string.
Fix: replace Python docstrings \"\"\"...\"\"\" with # comments or '...' in code blocks.
"""
import os, re

base = r'e:\internal_safe\cisp1\cisp\scripts'

for fn in ['gen_defense.py', 'gen_penetration.py']:
    path = os.path.join(base, fn)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    fixes = 0
    
    # Fix 1: Single-line docstrings """text""" -> # text
    # Only lines that are indented (inside code blocks), start with spaces+""", and end with """
    def fix_single_line_docstring(m):
        indent = m.group(1) or ''
        doc = m.group(2)
        fixes = 1
        return f'{indent}# {doc}'
    
    new_content = re.sub(
        r'^([ \t]+)"""(.+?)"""\s*$',
        lambda m: f'{m.group(1)}# {m.group(2)}',
        content,
        flags=re.MULTILINE
    )
    
    if new_content != content:
        # Count fixes
        old_lines = content.split('\n')
        new_lines = new_content.split('\n')
        fixed_count = sum(1 for o, n in zip(old_lines, new_lines) if o != n)
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'{fn}: Fixed {fixed_count} docstring lines')
    else:
        print(f'{fn}: No changes needed')
