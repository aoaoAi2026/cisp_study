import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

interface ResourceMeta {
  id: string;
  category: string;
  title: string;
  summary: string;
  tags: string[];
  difficulty: '入门' | '进阶' | '精通';
  readMinutes: number;
  updatedAt: string;
  contentPath: string;
  author: string;
}

interface Snippet {
  id: string;
  title: string;
  tool: string;
  category: string;
  command: string;
  description: string;
  tags: string[];
}

interface ToolNav {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string;
  country: string;
  tags: string[];
  free: boolean;
  isOnlineTool: boolean;
}

const RESOURCES_DIR = path.join(__dirname, 'resources');
const CONTENTS_DIR = path.join(__dirname, 'contents');

function readJSON<T>(file: string): T {
  const raw = fs.readFileSync(file, 'utf-8');
  return JSON.parse(raw);
}

function readMarkdown(relPath: string): string {
  const p = path.join(__dirname, relPath);
  return fs.readFileSync(p, 'utf-8');
}

function loadAllResources(): ResourceMeta[] {
  const all: ResourceMeta[] = [];
  if (!fs.existsSync(RESOURCES_DIR)) return all;
  const files = fs.readdirSync(RESOURCES_DIR).filter((f) => f.endsWith('.json') && f !== 'snippets.json' && f !== 'tools.json');
  files.forEach((file) => {
    try {
      const list = readJSON<ResourceMeta[]>(path.join(RESOURCES_DIR, file));
      all.push(...list);
    } catch (e) {
      console.warn('Failed to load', file);
    }
  });
  return all;
}

app.get('/api/stats', (_req, res) => {
  const all = loadAllResources();
  const byCategory: Record<string, number> = {};
  all.forEach((r) => {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  });
  let snippetsCount = 0;
  let toolsCount = 0;
  try {
    snippetsCount = readJSON<Snippet[]>(path.join(RESOURCES_DIR, 'snippets.json')).length;
  } catch (e) {}
  try {
    toolsCount = readJSON<ToolNav[]>(path.join(RESOURCES_DIR, 'tools.json')).length;
  } catch (e) {}
  res.json({
    total: all.length,
    byCategory,
    snippets: snippetsCount,
    tools: toolsCount,
    tags: [...new Set(all.flatMap((r) => r.tags))].length,
  });
});

app.get('/api/resources', (req, res) => {
  const { category, tag, difficulty, q } = req.query;
  let list = loadAllResources();
  if (category && category !== 'all') list = list.filter((r) => r.category === category);
  if (tag) list = list.filter((r) => r.tags.includes(String(tag)));
  if (difficulty && difficulty !== 'all') list = list.filter((r) => r.difficulty === difficulty);
  if (q) {
    const query = String(q).toLowerCase();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        r.tags.some((t) => t.toLowerCase().includes(query))
    );
  }
  res.json({ data: list, total: list.length });
});

app.get('/api/resources/:id', (req, res) => {
  const all = loadAllResources();
  const item = all.find((r) => r.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }
  try {
    const content = readMarkdown(item.contentPath);
    res.json({ data: item, content });
  } catch (e) {
    res.json({ data: item, content: '> （正文加载失败，请检查资源文件）' });
  }
});

app.get('/api/snippets', (_req, res) => {
  try {
    const list = readJSON<Snippet[]>(path.join(RESOURCES_DIR, 'snippets.json'));
    res.json({ data: list });
  } catch (e) {
    res.json({ data: [] });
  }
});

app.get('/api/tools', (_req, res) => {
  try {
    const list = readJSON<ToolNav[]>(path.join(RESOURCES_DIR, 'tools.json'));
    res.json({ data: list });
  } catch (e) {
    res.json({ data: [] });
  }
});

app.get('/api/roadmap', (_req, res) => {
  try {
    const content = readMarkdown('contents/roadmap.md');
    res.json({ content });
  } catch (e) {
    res.json({ content: '' });
  }
});

app.listen(PORT, () => {
  console.log(`[wangan-baibaoxiang] API server on http://localhost:${PORT}`);
});
