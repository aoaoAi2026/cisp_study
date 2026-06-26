const fs = require('fs');
const path = require('path');

// 读取books.ts文件
const booksFile = path.join(__dirname, '..', 'cisp', 'src', 'data', 'books.ts');
const content = fs.readFileSync(booksFile, 'utf8');

// 创建导出目录
const exportDir = path.join(__dirname, 'books_export');

// 解析书籍数据
function parseBooks(content) {
  const books = [];
  
  // 匹配书籍：id: 'xxx', title: 'xxx', ...
  const bookRegex = /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*author:\s*'([^']*)'[^}]*category:\s*'([^']+)'[^}]*description:\s*'([^']*)'[^}]*pages:\s*(\d+)[^}]*difficulty:\s*'([^']+)'[^}]*publishYear:\s*(\d+)[^}]*tags:\s*\[([^\]]+)\][^}]*rating:\s*([\d.]+)[^}]*readers:\s*(\d+)[^}]*targetAudience:\s*'([^']*)'[^}]*(?:prerequisites:\s*\[([^\]]*)\])?[^}]*(?:highlights:\s*\[([^\]]*)\])?[^}]*chapters:\s*\[([\s\S]*?)\]\s*\}/g;
  
  let match;
  while ((match = bookRegex.exec(content)) !== null) {
    const bookId = match[1];
    const title = match[2];
    const author = match[3];
    const category = match[4];
    const description = match[5];
    const pages = parseInt(match[6]);
    const difficulty = match[7];
    const publishYear = parseInt(match[8]);
    const tags = match[9].split(',').map(t => t.trim().replace(/'/g, ''));
    const rating = parseFloat(match[10]);
    const readers = parseInt(match[11]);
    const targetAudience = match[12];
    const prerequisites = match[13] ? match[13].split(',').map(t => t.trim().replace(/'/g, '')) : [];
    const highlights = match[14] ? match[14].split(',').map(t => t.trim().replace(/'/g, '')) : [];
    
    // 解析章节
    const chaptersContent = match[15];
    const chapters = [];
    const chapterRegex = /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*content:\s*'([\s\S]*?)',\s*pageCount:\s*(\d+)\s*\}/g;
    
    let chapterMatch;
    while ((chapterMatch = chapterRegex.exec(chaptersContent)) !== null) {
      chapters.push({
        id: chapterMatch[1],
        title: chapterMatch[2],
        content: chapterMatch[3].replace(/\\n/g, '\n').replace(/\\t/g, '\t'),
        pageCount: parseInt(chapterMatch[4])
      });
    }
    
    books.push({
      id: bookId,
      title,
      author,
      category,
      description,
      pages,
      difficulty,
      publishYear,
      tags,
      rating,
      readers,
      targetAudience,
      prerequisites,
      highlights,
      chapters
    });
  }
  
  return books;
}

// 导出书籍为markdown
function exportBook(book, exportDir) {
  // 创建书籍文件夹
  const bookDir = path.join(exportDir, book.title.replace(/[<>:"/\\|?*]/g, '_'));
  if (!fs.existsSync(bookDir)) {
    fs.mkdirSync(bookDir, { recursive: true });
  }
  
  // 导出书籍信息
  const bookInfo = `# ${book.title}

> **作者**: ${book.author}
> **分类**: ${book.category}
> **难度**: ${book.difficulty}
> **出版年份**: ${book.publishYear}
> **页数**: ${book.pages}
> **评分**: ${book.rating}
> **阅读人数**: ${book.readers}

## 简介

${book.description}

## 目标读者

${book.targetAudience}

## 标签

${book.tags.map(t => `- ${t}`).join('\n')}

## 先修知识

${book.prerequisites.length > 0 ? book.prerequisites.map(p => `- ${p}`).join('\n') : '无'}

## 内容亮点

${book.highlights.map(h => `- ${h}`).join('\n')}

---

## 目录

${book.chapters.map((ch, i) => `${i + 1}. [${ch.title}](./${ch.id}.md)`).join('\n')}
`;

  fs.writeFileSync(path.join(bookDir, 'README.md'), bookInfo, 'utf8');
  
  // 导出每一章
  book.chapters.forEach((chapter, index) => {
    const chapterContent = `# ${chapter.title}

> 第${index + 1}章 | ${chapter.pageCount}页

${chapter.content}
`;

    fs.writeFileSync(path.join(bookDir, `${chapter.id}.md`), chapterContent, 'utf8');
    console.log(`  ✓ ${chapter.id}.md`);
  });
  
  console.log(`✓ 已导出: ${book.title} (${book.chapters.length}章节)\n`);
}

// 主函数
function main() {
  console.log('📚 开始导出书籍...\n');
  
  const books = parseBooks(content);
  console.log(`找到 ${books.length} 本书籍\n`);
  
  books.forEach(book => {
    try {
      exportBook(book, exportDir);
    } catch (err) {
      console.error(`✗ 导出失败: ${book.title}`);
      console.error(err.message);
    }
  });
  
  console.log('🎉 导出完成！');
  console.log(`📁 导出目录: ${exportDir}`);
}

main();
