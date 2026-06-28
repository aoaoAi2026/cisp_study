/*
 * @Author: aoaoAi2026 aoaoAi2026@example.com
 * @Date: 2026-06-10 22:08:00
 * @LastEditors: aoaoAi2026 aoaoAi2026@example.com
 * @LastEditTime: 2026-06-28 07:00:00
 * @FilePath: \cisp\vite.config.ts
 * @Description: 默认配置 + 书籍目录自动扫描插件（新增 md 自动收录）
 */
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { spawn, ChildProcess } from 'node:child_process';
import path from 'node:path';

/**
 * 书籍目录自动扫描插件
 * - buildStart（build / dev 首次）：运行 scripts/generate-books-manifest.mjs
 * - dev 模式：监听 public/books_export/books_export/** 下的 md 文件增删改，
 *   变化时重跑生成脚本，客户端通过 HMR + 时间戳 query 重新拉 manifest。
 */
function booksManifestPlugin(): Plugin {
  const SCRIPT = path.resolve(__dirname, 'scripts', 'generate-books-manifest.mjs');
  const WATCH_GLOB = /public[\\/]books_export[\\/]books_export[\\/].*\.md$/i;
  let running: ChildProcess | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const run = () => {
    // 去抖：1s 内连续变化只跑最后一次
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      try {
        if (running && running.exitCode == null) {
          try { running.kill(); } catch {}
        }
        running = spawn(process.execPath, [SCRIPT], {
          cwd: __dirname,
          stdio: 'inherit',
          shell: false,
        });
      } catch (e) {
        console.error('[booksManifest] 启动扫描脚本失败:', e);
      }
    }, 800);
  };

  return {
    name: 'books-manifest',
    buildStart() {
      run();
    },
    configureServer(server) {
      // dev 模式下监听 md 变化
      server.watcher.on('all', (eventName, fullPath) => {
        if (!WATCH_GLOB.test(fullPath.replace(/\\/g, '/')) &&
            !WATCH_GLOB.test(fullPath)) return;
        if (['add', 'unlink', 'change', 'addDir', 'unlinkDir'].includes(eventName)) {
          console.log(`[booksManifest] 检测到笔记变化 (${eventName}): ${path.basename(fullPath)} → 重新扫描目录`);
          run();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 6776,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true,
    hmr: {
      protocol: 'ws',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/api-bili': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-bili/, ''),
        headers: {
          Referer: 'https://www.bilibili.com',
        },
      },
    },
  },
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths(),
    booksManifestPlugin(),
  ],
})
