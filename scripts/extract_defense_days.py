"""提取 Defense 所有天的标题信息"""
import re, os
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fpath = os.path.join(BASE, 'src/data/cyberDefense.ts')

with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

# 提取 id + title + subtitle
pattern = r"id:\s*'([^']+)',\s*day:\s*\d+,\s*title:\s*'([^']+)',\s*subtitle:\s*'([^']*)'"
matches = re.findall(pattern, text)
print(f"Found {len(matches)} days:\n")
for m in matches:
    print(f"  {m[0]}: {m[1]} | {m[2]}")
