require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db');

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const labsRoutes = require('./routes/labs');
const executeRoutes = require('./routes/execute');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CISP 后端服务运行中', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/execute', executeRoutes);

const distDir = path.join(__dirname, '..', 'dist');
app.use(express.static(distDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: '服务器错误', detail: err.message });
});

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  CISP 服务已启动（前端+后端一体化）`);
  console.log(`  本地访问: http://localhost:${PORT}`);
  console.log(`  健康检查: http://localhost:${PORT}/api/health`);
  console.log(`  前端目录: ${distDir}`);
  console.log(`========================================\n`);
});
