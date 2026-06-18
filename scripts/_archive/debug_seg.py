import os, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = r'e:\internal_safe\cisp1\cisp'
fpath = os.path.join(BASE, 'src', 'data', 'cyberBasic.ts')
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

seg = content[1868:6886]
idx = seg.find('resources')
print(f'resources at seg offset {idx}')
if idx >= 0:
    print(repr(seg[max(0,idx-20):idx+30]))
print()
print('Seg[:300]:', seg[:300])
print()
print('Seg[-300]:', seg[-300:])
