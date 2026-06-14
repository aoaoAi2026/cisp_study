#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate days 5-9 articles."""
import os
DIR = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning\basic'
os.makedirs(DIR, exist_ok=True)

def sec(t, a, b): return (t, a, b)

def make(day, title, diff, mins, desc, sections, exams, mnems, traps, advices, quote):
    nav = '\n'.join(f'- [{s[0]}](#{s[1]})' for s in sections)
    body = '\n\n---\n\n'.join(s[2] for s in sections)
    ep = '\n'.join(f'| {i+1} | {e[0]} | {e[1]} | {e[2]} | {e[3]} |' for i,e in enumerate(exams))
    mn = '\n\n'.join(f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}\n>\n> {m[3]}' for i,m in enumerate(mnems))
    tr = '\n'.join(f'| {t[0]} | {t[1]} |' for t in traps)
    ad = '\n'.join(f'{i+1}. {a}' for i,a in enumerate(advices))
    content = f'''# Day {day}：{title}

> **📘 文档定位**：CISP 考试核心基础 | 难度：{diff} | 预计阅读：{mins} 分钟
>
> {desc}

---

## 导航目录

{nav}
- [十、高分考点与知识巧记](#十高分考点与知识巧记)

---

{body}

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
{ep}

### 💡 知识巧记口诀

{mn}

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
{tr}

---

## 学习建议

{ad}

---

> {quote}
'''
    path = os.path.join(DIR, f'day-{day}.md')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    print(f'  day-{day}.md: {lines} lines')
    return lines

total = 0
