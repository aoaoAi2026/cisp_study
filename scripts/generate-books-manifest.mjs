/**
 * 扫描 public/books_export/books_export/ 下所有书籍目录，生成 books_manifest.json
 * - 每个子目录 = 一本书（包含 .md 文件才注册）
 * - 每个 .md 文件 = 一章（标题智能从：首行 # 标题 > 文件名 提取）
 * - 输出到 public/books_export/books_manifest.json
 *
 * 运行： node scripts/generate-books-manifest.mjs
 * 此脚本由 vite.config.ts 插件在 build 与 dev 监听 md 变化时自动调用。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BOOKS_DIR = path.join(PROJECT_ROOT, 'public', 'books_export', 'books_export');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'public', 'books_export', 'books_manifest.json');

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = [];
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === '__pycache__') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      result.push(...walkDir(full));
    } else if (e.isFile()) {
      result.push(full);
    }
  }
  return result;
}

function extractTitleFromMd(filePath) {
  try {
    const buf = fs.readFileSync(filePath, { encoding: 'utf8' });
    const lines = buf.split(/\r?\n/);
    for (const raw of lines.slice(0, 40)) {
      const line = raw.trim();
      const m = line.match(/^#\s+(.+?)\s*$/);
      if (m) {
        // 去除首尾 Markdown 粗体符号和多余空格
        return m[1].replace(/^\*+/, '').replace(/\*+$/, '').trim();
      }
    }
  } catch {}
  return null;
}

function estimatePageCount(filePath) {
  try {
    const stat = fs.statSync(filePath);
    const chars = stat.size;
    // 粗略估算：1 页 ≈ 1500 汉字/字符
    return Math.max(3, Math.round(chars / 1500));
  } catch {
    return 10;
  }
}

function mdCompare(a, b) {
  // 排序：ch01 < ch02 < ch10... 然后按拼音/Unicode 排序
  const numRe = /(\d+)/g;
  const ta = path.basename(a);
  const tb = path.basename(b);
  const na = ta.match(numRe);
  const nb = tb.match(numRe);
  if (na && nb) {
    for (let i = 0; i < Math.min(na.length, nb.length); i++) {
      const ia = parseInt(na[i], 10);
      const ib = parseInt(nb[i], 10);
      if (ia !== ib) return ia - ib;
    }
  }
  return ta.localeCompare(tb, 'zh-CN');
}

function scanBooks() {
  if (!fs.existsSync(BOOKS_DIR)) {
    console.warn('[manifest] books dir not found:', BOOKS_DIR);
    return { books: [], scannedAt: new Date().toISOString() };
  }
  const topDirs = fs
    .readdirSync(BOOKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name);

  const books = [];
  for (const dirName of topDirs) {
    const dirPath = path.join(BOOKS_DIR, dirName);
    const allFiles = walkDir(dirPath);
    const mdFiles = allFiles
      .filter((f) => f.toLowerCase().endsWith('.md'))
      .sort(mdCompare);

    if (mdFiles.length === 0) continue;

    const chapters = mdFiles.map((absPath, idx) => {
      const fileName = path.relative(dirPath, absPath);
      const title = extractTitleFromMd(absPath) || fileName.replace(/\.md$/i, '');
      return {
        id: `ch${idx + 1}`,
        title,
        fileName: normalizeSep(fileName),
        pageCount: estimatePageCount(absPath),
      };
    });

    const totalPages = chapters.reduce((s, c) => s + c.pageCount, 0);
    books.push({
      folder: dirName,
      title: dirName,
      chapters,
      pages: totalPages,
      chapterCount: chapters.length,
    });
    console.log(
      `[manifest] 发现书籍: "${dirName}"  共 ${chapters.length} 章 / ~${totalPages} 页`
    );
  }

  return { books, scannedAt: new Date().toISOString() };
}

function normalizeSep(p) {
  return p.split(path.sep).join('/');
}

function main() {
  const data = scanBooks();
  ensureDir(OUTPUT_FILE);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(`[manifest] 已写入 ${OUTPUT_FILE}（共 ${data.books.length} 本书）`);
}

main();
