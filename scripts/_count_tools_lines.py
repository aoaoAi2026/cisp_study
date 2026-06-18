import os

tools_dir = "public/contents/tools"
for f in sorted(os.listdir(tools_dir)):
    if f.endswith('.md'):
        lines = sum(1 for _ in open(os.path.join(tools_dir, f), encoding='utf-8'))
        print(f"{f}: {lines} lines")
