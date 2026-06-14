import re, os

base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(base, 'src', 'data')
files = ['cyberBasic.ts', 'cyberDefense.ts', 'cyberPenetration.ts']

for fname in files:
    fpath = os.path.join(data_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    days = re.findall(r"id:\s*'([^']+)'", content)
    print(f'\n=== {fname} ({len(days)} days) ===')
    
    props = ['resources', 'codeExamples', 'recommendedTools', 'labEnvironment', 'expertNotes', 'quiz']
    for prop in props:
        has = 0
        for d in days:
            idx = content.find(f"id: '{d}'")
            next_idx = content.find("id: '", idx + len(d) + 10)
            if next_idx == -1:
                next_idx = len(content)
            chunk = content[idx:next_idx]
            if prop + ': [' in chunk:
                m = re.search(prop + r':\s*\[', chunk)
                if m:
                    # Check if [] is empty
                    pos = m.end()
                    rest = chunk[pos:].strip()
                    if rest and rest[0] != ']':
                        has += 1

        missing = len(days) - has
        if missing > 0:
            print(f'  {prop}: {missing} days MISSING ({has} have)')
        else:
            print(f'  {prop}: ALL OK ({has}/{len(days)})')

    # Check codeExamples duplication
    code_hashes = []
    for d in days:
        idx = content.find(f"id: '{d}'")
        next_idx = content.find("id: '", idx + len(d) + 10)
        if next_idx == -1:
            next_idx = len(content)
        chunk = content[idx:next_idx]
        m = re.search(r'codeExamples:\s*\[\s*(.*?)\s*\]', chunk, re.DOTALL)
        if m:
            inner = m.group(1).strip()
            if inner:
                code_hashes.append(hash(inner))
    unique = len(set(code_hashes))
    if unique < len(code_hashes) and code_hashes:
        print(f'  [DUP] codeExamples: {unique} unique / {len(code_hashes)} total')

    # Check expertNotes duplication
    notes_hashes = []
    for d in days:
        idx = content.find(f"id: '{d}'")
        next_idx = content.find("id: '", idx + len(d) + 10)
        if next_idx == -1:
            next_idx = len(content)
        chunk = content[idx:next_idx]
        m = re.search(r'expertNotes:\s*\[\s*(.*?)\s*\]', chunk, re.DOTALL)
        if m:
            inner = m.group(1).strip()
            if inner:
                notes_hashes.append(hash(inner))
    unique_n = len(set(notes_hashes))
    if unique_n < len(notes_hashes) and notes_hashes:
        print(f'  [DUP] expertNotes: {unique_n} unique / {len(notes_hashes)} total')

print('\n=== DONE ===')
