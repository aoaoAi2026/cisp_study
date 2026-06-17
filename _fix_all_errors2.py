import sys, os, glob, re

BASE = os.path.dirname(__file__)
fixes = []

def read_file(path):
    """Read file, trying UTF-8 first, then UTF-16"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        with open(path, 'r', encoding='utf-16') as f:
            return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

# ============================================================
# 1. basic day files: remove trailing ]; (should be };)
# ============================================================
for bf in glob.glob(os.path.join(BASE, 'src/data/plans/basic/days/basic-*.ts')):
    content = read_file(bf)
    # Files end with: }]\n;\n  or  }];\n\n
    # Should end with: };\n  (single object CyberDay)
    while content.rstrip().endswith(']'):
        content = content.rstrip()[:-1]
    # remove trailing ; after cleanup
    content = content.rstrip()
    while content.endswith(';'):
        content = content[:-1].rstrip()
    if not content.rstrip().endswith('}'):
        content = content.rstrip() + '\n}'
    content = content.rstrip() + ';\n'
    write_file(bf, content)
    fixes.append(f'{os.path.basename(bf)}: cleaned')

# ============================================================
# 2. penetration day files: remove trailing garbage
# ============================================================
for pf in glob.glob(os.path.join(BASE, 'src/data/plans/penetration/days/pen-*.ts')):
    content = read_file(pf)
    # Remove trailing ] and ]; and ; noise
    lines = content.split('\n')
    # Find last meaningful line (the one ending with } for the object)
    last_good = 0
    for i, line in enumerate(lines):
        s = line.strip()
        if s and not s in [']', '];', ';']:
            last_good = i
    
    # Keep lines up to last_good inclusive, ensure it ends with };
    lines = lines[:last_good+1]
    content = '\n'.join(lines)
    
    # Clean up trailing }} patterns - replace with };
    content = content.rstrip()
    while content.endswith(';'):
        content = content[:-1].rstrip()
    while content.endswith(']'):
        content = content[:-1].rstrip()
    while content.endswith('}'):
        # Keep one }
        break
    if not content.rstrip().endswith('}'):
        content = content.rstrip() + '\n}'
    content = content.rstrip() + ';\n'
    write_file(pf, content)
    fixes.append(f'{os.path.basename(pf)}: cleaned')

# ============================================================
# 3. toolSitesData files: fix closing },, and };
# ============================================================
for tf in glob.glob(os.path.join(BASE, 'src/data/toolSitesData/*.ts')):
    content = read_file(tf)
    # Pattern:  },\n}; at end → };\n
    # The file ends with:
    #     }
    #   },,
    # };
    # Fix: remove trailing garbage, ensure proper closing
    
    # Find pattern: whitespace },, newline whitespace };
    # Replace with just };
    content = re.sub(r'\}\s*,,\s*\n\s*\};', '};\n', content)
    # Also handle },\n}; 
    content = re.sub(r'\}\s*,\s*\n\s*\};', '};\n', content)
    
    write_file(tf, content)
    fixes.append(f'{os.path.basename(tf)}: fixed closing')

# ============================================================
# 4. defense weeks: extract week1/week2 from original
# ============================================================
orig = read_file(os.path.join(BASE, '_temp_cyber_defense.ts'))

# Find week boundaries
# Week 1: "const week1: CyberDay[] = [" to "]"
# Week 2: "const week2: CyberDay[] = [" to "]"

def extract_week(content, start_pattern, end_before=None):
    """Extract content between start_pattern and ];"""
    idx = content.find(start_pattern)
    if idx == -1:
        return None
    # Find the matching ]; 
    # The array content starts at idx + len(start_pattern)
    start = idx + len(start_pattern)
    
    # Find ]; that closes the array
    depth = 1  # one [ opened
    i = start
    while i < len(content) and depth > 0:
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
        i += 1
    # Now find the ; after ]
    if i < len(content) and content[i] == ';':
        return content[idx:i+1]  # include the ];
    return content[idx:i]

week1_data = extract_week(orig, 'const week1: CyberDay[] = [')
week2_data = extract_week(orig, 'const week2: CyberDay[] = [')

if week1_data:
    # week1.ts should be: import + export default
    w1 = f"""import type {{ CyberDay }} from '../../types';

export default {week1_data[:-2]} as CyberDay[];
"""
    write_file(os.path.join(BASE, 'src/data/plans/defense/weeks/week1.ts'), w1)
    fixes.append('defense/weeks/week1.ts: rebuilt from original')

if week2_data:
    w2 = f"""import type {{ CyberDay }} from '../../types';

export default {week2_data[:-2]} as CyberDay[];
"""
    write_file(os.path.join(BASE, 'src/data/plans/defense/weeks/week2.ts'), w2)
    fixes.append('defense/weeks/week2.ts: rebuilt from original')

# ============================================================
# Summary
# ============================================================
print(f"Fixed: {len(fixes)} files")
for f in fixes:
    print(f"  OK {f}")
