"""恢复 securityScripts 中被误删的逗号"""
import os, re, glob

base = 'e:/internal_safe/cisp1/cisp/src/data/securityScripts'

for f in glob.glob(os.path.join(base, '*.ts')):
    with open(f, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    original = content
    
    # Pattern: a closing } that starts a line (possibly with whitespace), 
    # followed by blank lines, then a { that starts a new item
    # These should have a comma after the }
    # We need to add comma after } at line end when followed by { at start of a line
    
    lines = content.split('\n')
    result = []
    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        result.append(lines[i])
        
        # If current line is just "}" (stripped) and next non-empty line starts with "{"
        if stripped == '}':
            # Look ahead for the next non-empty line
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines) and lines[j].strip().startswith('{'):
                # This } is between array items, needs a comma
                result[-1] = lines[i].rstrip() + ','
        i += 1
    
    restored = '\n'.join(result)
    if restored != original:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(restored)
        print(f"Restored: {os.path.basename(f)}")
