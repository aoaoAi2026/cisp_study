#!/usr/bin/env python3
"""Extract quiz, code examples, and resources from markdown files for days 31-168,
and generate a TypeScript supplement file."""

import re
import json
import os

MD_DIR = r"e:\internal_safe\cisp1\cisp\public\contents\cyber-learning\ai"
OUT_FILE = r"e:\internal_safe\cisp1\cisp\src\data\cyberAiSupplement.ts"
START_DAY = 31
END_DAY = 168


def read_md(day):
    path = os.path.join(MD_DIR, f"day-{day}.md")
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def extract_quiz(text):
    """Extract multiple-choice quiz questions (1-3) from AI安全高分突破 section."""
    # Find the quiz section
    section_match = re.search(r"## AI安全高分突破.*?(?=\n## [^#]|\Z)", text, re.DOTALL)
    if not section_match:
        return []
    section = section_match.group(0)

    quiz = []
    # Match 题目1-3 (multiple choice only)
    for i in [1, 2, 3]:
        # Pattern: **题目N**（...） followed by question, options, answer
        pattern = rf"\*\*题目{i}\*\*[^\n]*\n+(.+?)\n+A\.\s*(.+?)\n+B\.\s*(.+?)\n+C\.\s*(.+?)\n+D\.\s*(.+?)\n+"
        mc_match = re.search(pattern, section, re.DOTALL)
        if not mc_match:
            continue
        question = mc_match.group(1).strip()
        options = [mc_match.group(j).strip() for j in range(2, 6)]

        # Find answer
        ans_start = mc_match.end()
        ans_section = section[ans_start : ans_start + 800]
        ans_match = re.search(r"\*\*答案[：:]\s*([A-D])\*\*", ans_section)
        if not ans_match:
            continue
        correct_letter = ans_match.group(1)
        correct_index = {"A": 0, "B": 1, "C": 2, "D": 3}.get(correct_letter, 0)

        # Extract explanation (everything between answer and **考察知识点** or </details>)
        expl_start = ans_match.end()
        expl_rest = ans_section[expl_start:]
        expl_match = re.match(r"[\s\S]*?(?=\*\*考察知识点|\n</details>)", expl_rest)
        explanation = expl_match.group(0).strip() if expl_match else ""
        # Clean up explanation
        explanation = re.sub(r"\n+", " ", explanation).strip()

        quiz.append(
            {
                "question": question,
                "options": [f"{chr(65+i)}. {options[i]}" for i in range(4)],
                "correctIndex": correct_index,
                "explanation": explanation[:300],
            }
        )

    return quiz


def extract_code_example(text, title_hint=""):
    """Extract the first substantial Python code block as a code example."""
    blocks = re.findall(r"```python\n(.*?)```", text, re.DOTALL)
    for block in blocks:
        block = block.strip()
        lines = block.split("\n")
        code_lines = [l for l in lines if l.strip() and not l.strip().startswith("#")]
        if len(code_lines) >= 10 and len(block) > 200:
            # Try to get a meaningful title from comments (skip separator lines like ==== or ----)
            title = ""
            for line in lines:
                stripped = line.strip()
                if stripped.startswith("#"):
                    content = stripped.lstrip("#").strip()
                    # Skip separator lines
                    if re.match(r"^[=\-]{5,}$", content):
                        continue
                    if len(content) > 3:
                        title = content
                        break
            if not title:
                title = title_hint or "代码示例"
            return {
                "title": title[:60],
                "language": "python",
                "code": block[:1500],
                "explanation": "来自本日课程的代码示例",
            }
    return None


def extract_resources(text):
    """Extract resources from the 参考资料 table."""
    section_match = re.search(r"### 参考资料\n+(.*?)(?=\n---|\n>|\Z)", text, re.DOTALL)
    if not section_match:
        return []
    section = section_match.group(1)

    resources = []
    for line in section.split("\n"):
        line = line.strip()
        if not line or not line.startswith("|"):
            continue
        # Parse table row: | name | type | description |
        parts = [p.strip() for p in line.split("|")]
        parts = [p for p in parts if p]  # remove empty from ends
        if len(parts) >= 3 and parts[0] not in ["资源", "------", ":----"]:
            name = parts[0]
            rtype = parts[1] if len(parts) > 1 else "article"
            # Map Chinese types
            type_map = {"文档": "article", "教程": "article", "书籍": "book", "实战": "article",
                        "数据": "article", "论文": "article", "框架": "article", "标准": "article",
                        "视频": "video", "课程": "video"}
            mapped_type = type_map.get(rtype, "article")
            resources.append({"name": name, "url": "", "type": mapped_type})

    return resources[:5]  # limit to 5


def extract_tools(text):
    """Extract recommended tools from 关键技术与工具平台 table."""
    section_match = re.search(r"## 关键技术与工具平台\n+(.*?)(?=\n##|\n---\n##|\Z)", text, re.DOTALL)
    if not section_match:
        return []
    section = section_match.group(1)

    tools = []
    for line in section.split("\n"):
        line = line.strip()
        if not line or not line.startswith("|"):
            continue
        parts = [p.strip() for p in line.split("|")]
        parts = [p for p in parts if p]
        if len(parts) >= 2 and parts[0] not in ["------", ":----", ""]:
            name = parts[0]
            if name in ["Streamlit基础", "数据流集成", "筛选与联动", "自动刷新", "部署分享", "安全数据看板案例"]:
                continue  # skip sub-items
            desc = parts[1] if len(parts) > 1 else ""
            if not desc or desc in ["组件/布局", "实时/批量更新", "下拉/滑块/日期", "定时刷新机制", "云端部署", "SOC看板模板"]:
                continue
            tools.append({"name": name, "description": desc, "url": "", "type": "local"})

    return tools[:4]


def extract_objectives(text, title):
    """Generate objectives from the title and content."""
    # Extract from markdown headers as objectives
    headers = re.findall(r"^### (.+?)$", text, re.MULTILINE)
    # Pick 3 meaningful headers
    meaningful = [h for h in headers if len(h) > 5 and h not in
                  ["背景与概述", "核心概念体系", "技术原理剖析",
                   "关键技术与工具平台", "安全威胁场景与攻防对抗",
                   "AI安全高分突破", "实战演练与能力检验",
                   "前沿趋势与展望", "知识回顾", "参考资料"]]
    if len(meaningful) >= 3:
        return meaningful[:3]
    return [f"掌握{title}核心技术", f"理解{title}安全应用场景", f"完成{title}实践练习"]


def extract_keypoints(text, title):
    """Extract key points from markdown."""
    # Try to get from core concepts or overview sections
    points = []
    # Look for list items in background section
    bg = re.search(r"## 背景与概述\n+(.*?)(?=\n##|\Z)", text, re.DOTALL)
    if bg:
        list_items = re.findall(r"^- (.+?)$", bg.group(1), re.MULTILINE)
        points.extend(list_items[:3])

    if len(points) < 3:
        points = [f"{title}核心技术", f"{title}安全应用", f"{title}最佳实践"]

    return points[:5]


def main():
    supplement = {}

    for day in range(START_DAY, END_DAY + 1):
        text = read_md(day)
        if not text:
            print(f"  SKIP day-{day}: file not found")
            continue

        # Get title from first line for code example fallback
        title_match = re.search(r"^# Day \d+[：:] (.+)$", text, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else f"Day {day}"

        quiz = extract_quiz(text)
        code_example = extract_code_example(text, title)
        resources = extract_resources(text)
        tools = extract_tools(text)

        supplement[day] = {}

        if quiz:
            supplement[day]["quiz"] = quiz
            print(f"  day-{day}: {len(quiz)} quiz questions")
        else:
            print(f"  day-{day}: NO quiz found")

        if code_example:
            supplement[day]["codeExamples"] = [code_example]
            print(f"          code example: {code_example['title'][:40]}")
        else:
            print(f"          NO code example")

        if resources:
            supplement[day]["resources"] = resources
            print(f"          {len(resources)} resources")

        if tools:
            supplement[day]["recommendedTools"] = tools
            print(f"          {len(tools)} tools")

    # Write TypeScript output
    ts_lines = [
        "// Auto-generated supplement data for CyberAi days 31-168",
        "// Extracted from markdown files by extract_supplement.py",
        "// DO NOT EDIT MANUALLY",
        "",
        "export interface SupplementDay {",
        "  quiz?: {",
        "    question: string;",
        "    options: string[];",
        "    correctIndex: number;",
        "    explanation: string;",
        "  }[];",
        "  codeExamples?: {",
        "    title: string;",
        "    language: string;",
        "    code: string;",
        "    explanation: string;",
        "  }[];",
        "  resources?: {",
        "    name: string;",
        "    url: string;",
        "    type: string;",
        "  }[];",
        "  recommendedTools?: {",
        "    name: string;",
        "    description: string;",
        "    url: string;",
        "    type: string;",
        "  }[];",
        "}",
        "",
        "const supplement: Record<number, SupplementDay> = ",
    ]

    # Format as JSON-like TS
    ts_lines.append(json.dumps(supplement, ensure_ascii=False, indent=2))
    ts_lines.append(";\n\nexport default supplement;\n")

    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(ts_lines))

    total = len(supplement)
    with_quiz = sum(1 for v in supplement.values() if v.get("quiz"))
    with_code = sum(1 for v in supplement.values() if v.get("codeExamples"))
    with_res = sum(1 for v in supplement.values() if v.get("resources"))
    with_tools = sum(1 for v in supplement.values() if v.get("recommendedTools"))

    print(f"\n{'='*60}")
    print(f"Total days processed: {total}")
    print(f"  With quiz:    {with_quiz}/{total}")
    print(f"  With code:    {with_code}/{total}")
    print(f"  With resources: {with_res}/{total}")
    print(f"  With tools:   {with_tools}/{total}")
    print(f"Output: {OUT_FILE}")


if __name__ == "__main__":
    main()
