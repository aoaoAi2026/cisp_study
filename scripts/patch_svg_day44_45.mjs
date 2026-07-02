// Patch script: append SVG cards to day44 (need +1) and day45 (need +2)
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE_DIR = String.raw`e:\internal_safe\cisp1\cisp\public\contents\cyber-learning\shoot-range`;

function svgCard(title, color, items) {
  const id = Math.random().toString(36).slice(2, 10);
  const cols = items.length <= 3 ? items.length : 3;
  const rows = Math.ceil(items.length / cols);
  const H = 90 + rows * 73;
  const W = 800;
  const bw = 220, bh = 55, gx = 20, gy = 18;
  const sx = 40 + ((740 - (cols * bw + (cols - 1) * gx)) / 2);
  const pal = ['#eff6ff', '#f0fdf4', '#fef3c7', '#fce7f3', '#f5f3ff', '#ecfeff', '#fef2f2', '#f0f9ff', '#faf5ff'];
  let o = `\n<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">\n`;
  o += `  <defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eff6ff"/><stop offset="100%" stop-color="#dbeafe"/></linearGradient></defs>\n`;
  o += `  <rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="url(#g${id})"/>\n`;
  o += `  <rect x="12" y="12" width="${W - 24}" height="44" rx="8" fill="${color}" opacity="0.88"/>\n`;
  o += `  <text x="${W / 2}" y="40" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="18">${title}</text>\n`;
  let y = 90;
  for (let r = 0; r < rows; r++) {
    let x = sx;
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i >= items.length) break;
      const itm = String(items[i]).replace(/[<>&]/g, s => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[s]));
      const f = pal[i % pal.length];
      o += `  <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="10" fill="${f}" stroke="#64748b" stroke-width="2"/>\n`;
      o += `  <text x="${x + bw / 2}" y="${y + bh / 2 + 5}" text-anchor="middle" fill="#334155" font-weight="600" font-size="12">${itm}</text>\n`;
      x += bw + gx;
    }
    y += bh + gy;
  }
  o += '</svg>\n';
  return o;
}

// Day44 extra cards (补1张 → 达20)
const day44Extras = [
  ['🧩 常见漏洞组合利用图','#991b1b',['SQLi → 读配置 → 数据库账号 → UDF提权','XXE Blind → OOB带外 → 读源码 → 新SQLi','SSRF → 内网Redis → 写SSH公钥 → 登录','文件上传 → 解析漏洞 → Webshell → 提权','Fastjson → 内存马 → CS上线 → Mimikatz抓Hash','Log4Shell 不出网 → 信息泄露 → 其他漏洞组合']],
];
const f44 = join(BASE_DIR, 'day-44.md');
for (const t of day44Extras) appendFileSync(f44, svgCard(t[0], t[1], t[2]), 'utf8');
console.log(`[OK] day-44.md patched +${day44Extras.length} SVG`);

// Day45 extra cards (补2张 → 达20)
const day45Extras = [
  ['📅 每日3小时 学习打卡模板','#166534',['⏰ 09:00-10:00 理论：阅读漏洞原理/技术文章1篇','🧪 10:00-12:00 靶场：2个漏洞 手工+工具 复现','📝 12:00-12:30 复盘：写今日所学3点 + 所踩2坑','☕ 14:00-16:00 进阶：CTF题1道 / EXP脚本开发 / 工具使用','🔬 16:00-17:00 资讯：FreeBuf/先知 浏览最新技术动态','🧠 21:00-21:30 睡前回顾：Anki闪卡 复习本日知识点']],
  ['🎯 安全行业证书备考时间轴','#be123c',['第1~3月: CISP 准备 → 国内企业准入门槛（必拿）','第4~6月: eJPT / Security+ → 入门国际证书 第一份','第7~12月: CEH / OSCP 备考 → 报名前靶场100台','第13~18月: OSCP 24小时打靶 纯手工 → 目标一次性通过','第19~24月: CISSP / CRTP / OSWE → 选对应发展方向','持续: CVE / CNVD 证书 → 实战能力证明 加分项']],
];
const f45 = join(BASE_DIR, 'day-45.md');
for (const t of day45Extras) appendFileSync(f45, svgCard(t[0], t[1], t[2]), 'utf8');
console.log(`[OK] day-45.md patched +${day45Extras.length} SVG`);

console.log('\n✅ 全部SVG≥20补齐完成！');
