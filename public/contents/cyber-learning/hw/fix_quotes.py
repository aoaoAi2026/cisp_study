# -*- coding: utf-8 -*-
with open('generate_days.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace smart quotes that cause issues in Python string parsing
content = content.replace('\u201c', "'")
content = content.replace('\u201d', "'")
content = content.replace('\u2018', "'")
content = content.replace('\u2019', "'")

with open('generate_days.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed smart quotes')
