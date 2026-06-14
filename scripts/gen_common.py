#!/usr/bin/env python3
"""Shared functions for article generation."""
import os

BASE = r'E:\internal_safe\cisp1\cisp\public\contents\cyber-learning'
for d in ['basic','defense','penetration']:
    os.makedirs(os.path.join(BASE, d), exist_ok=True)

total_lines = 0

def make_day(cat, num, title, diff, mins, desc, sections, exam_points, mnemonics, traps, advices, quote):
    global total_lines
    nav = '\n'.join(f'- [{s[0]}](#{s[1]})' for s in sections)
    nav += '\n- [十、高分考点与知识巧记](#十高分考点与知识巧记)'
    body = '\n'.join(s[2] for s in sections)
    ep_rows = '\n'.join(f'| {i+1} | {ep[0]} | {ep[1]} | {ep[2]} | {ep[3]} |' for i,ep in enumerate(exam_points))
    mn_rows = '\n\n'.join(
        f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}\n>\n> {m[3]}' if len(m)>=4 else
        f'#### {i+1}. {m[0]}\n> **"{m[1]}"** — {m[2]}'
        for i,m in enumerate(mnemonics))
    trap_rows = '\n'.join(f'| {t[0]} | {t[1]} |' for t in traps)
    adv_rows = '\n'.join(f'{i+1}. {a}' for i,a in enumerate(advices))
    content = f'''# Day {num}：{title}

> **📘 文档定位**：CISP 考试核心基础 | 难度：{diff} | 预计阅读：{mins} 分钟
>
> {desc}

---

## 导航目录

{nav}

---

{body}

---

## 十、高分考点与知识巧记

### 📌 高分考点速查表

| 序号 | 考点 | 考试频率 | 难度 | 关键答案 |
|:---:|:---|:---:|:---:|:---|
{ep_rows}

### 💡 知识巧记口诀

{mn_rows}

### 🎯 考试陷阱提醒

| 陷阱 | 正确理解 |
|:---|:---|
{trap_rows}

---

## 学习建议

{adv_rows}

---

> {quote}
'''
    path = os.path.join(BASE, cat, f'day-{num}.md')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    lines = content.count('\n') + 1
    total_lines += lines
    return lines

def S(title, anchor, body):
    return (title, anchor, body)
