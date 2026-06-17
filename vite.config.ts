/*
 * @Author: aoaoAi2026 aoaoAi2026@example.com
 * @Date: 2026-06-10 22:08:00
 * @LastEditors: aoaoAi2026 aoaoAi2026@example.com
 * @LastEditTime: 2026-06-11 19:33:30
 * @FilePath: \cisp\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 6776,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true,
    hmr: {
      host: '0.0.0.0',
      port: 6776,
      protocol: 'ws',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
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
    tsconfigPaths()
  ],
})
