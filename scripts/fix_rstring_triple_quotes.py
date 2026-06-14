"""Fix r-string triple-quote conflicts in gen_defense.py and gen_penetration.py.

Problem: r"""...""" can't contain """ inside. When markdown content has Python code
blocks with docstrings (e.g. def foo(): \"\"\"doc\"\"\"), the r-string terminates early.

Solution: Within r-strings that contain markdown/code, find lines with Python docstrings
and replace \"\"\" with # comments.
"""
import os, re

base = r'e:\internal_safe\cisp1\cisp\scripts'

for fn in ['gen_defense.py', 'gen_penetration.py']:
    path = os.path.join(base, fn)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Strategy: find all r""" delimited strings and replace \"\"\" inside them
    # But that's complex. Simpler: globally replace \"\"\" inside code blocks
    # Pattern: lines that are """text""" (Python docstring) at the start
    # Replace with: # text
    
    # Replace triple-quoted docstrings that appear as standalone lines
    # Pattern:      """some text"""  ->  # some text
    # We need to be careful not to replace the actual r""" boundaries
    
    # More targeted: find lines that look like Python docstrings
    # These are lines inside markdown code blocks that have """..."""
    
    content = re.sub(
        r'^(\s*)"""(.+?)"""\s*$',
        r'\1# \2',
        content,
        flags=re.MULTILINE
    )
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        diff = len(original) - len(content)
        print(f'{fn}: Fixed triple quotes. Size change: {diff} bytes')
    else:
        print(f'{fn}: No changes needed')
