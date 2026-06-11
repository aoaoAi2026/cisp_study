const { exec } = require('child_process');
const path = require('path');

const labContainers = [
  {
    id: 'juice-shop',
    name: 'OWASP Juice Shop',
    description: '最流行的Web安全练习平台，包含SQL注入、XSS、CSRF、安全配置错误等常见漏洞',
    port: 3000,
    url: 'http://localhost:3000',
    dockerImage: 'bkimminich/juice-shop:latest',
    difficulty: '简单',
    category: 'Web安全',
    defaultLogin: 'admin@juice-sh.op / admin123',
    features: ['SQL注入', 'XSS跨站脚本', 'CSRF', '文件上传漏洞', '认证绕过', 'API安全'],
  },
  {
    id: 'webgoat',
    name: 'OWASP WebGoat',
    description: 'OWASP官方的Web安全教学平台，分章节讲解各类Web漏洞和防御方法',
    port: 8080,
    url: 'http://localhost:8080/WebGoat',
    dockerImage: 'webgoat/webgoat:latest',
    difficulty: '中等',
    category: 'Web安全',
    defaultLogin: 'guest / guest',
    features: ['认证漏洞', '会话管理', '访问控制', '输入验证', '密码学', 'JWT安全'],
  },
  {
    id: 'dvwa',
    name: 'DVWA (Damn Vulnerable Web App)',
    description: 'PHP编写的故意存在漏洞的Web应用，用于学习常见的Web安全问题',
    port: 8081,
    url: 'http://localhost:8081',
    dockerImage: 'vulnerables/web-dvwa:latest',
    difficulty: '简单',
    category: 'Web安全',
    defaultLogin: 'admin / password',
    features: ['暴力破解', '命令注入', 'CSRF', '文件包含', 'SQL注入', 'XSS反射/存储'],
  },
  {
    id: 'bwapp',
    name: 'bWAPP (Buggy Web App)',
    description: '包含超过100种Web漏洞的综合练习平台，覆盖OWASP Top 10全部类别',
    port: 8082,
    url: 'http://localhost:8082',
    dockerImage: 'raesene/bwapp:latest',
    difficulty: '中等',
    category: 'Web安全',
    defaultLogin: 'bee / bug',
    features: ['A1注入', 'A2认证', 'A3敏感数据', 'A4XXE', 'A5访问控制', 'A6安全配置'],
  },
];

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error && !cmd.includes('ps')) {
        resolve({ error: error.message, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function getContainerStatus(containerId) {
  try {
    const result = await execPromise(`docker ps -a --filter "name=cisp-${containerId}" --format "{{.Status}}"`);
    if (!result.stdout || result.stdout.trim() === '') {
      return { running: false, status: 'not_created' };
    }
    const status = result.stdout.trim();
    return {
      running: status.startsWith('Up'),
      status: status,
    };
  } catch (e) {
    return { running: false, status: 'unknown', error: e.message };
  }
}

async function startContainer(containerId) {
  const container = labContainers.find((c) => c.id === containerId);
  if (!container) {
    return { success: false, message: '容器不存在' };
  }

  try {
    const composeDir = __dirname.includes('\\')
      ? path.dirname(path.dirname(__dirname))
      : path.resolve(__dirname, '..', '..');
    const result = await execPromise(`powershell -Command "Set-Location '${composeDir}'; docker-compose up -d ${containerId}"`);
    return {
      success: !result.error,
      message: result.error ? `启动失败: ${result.error}` : '启动成功，请等待30秒后访问',
      detail: result.stdout,
    };
  } catch (e) {
    return { success: false, message: `启动异常: ${e.message}` };
  }
}

async function stopContainer(containerId) {
  try {
    const composeDir = __dirname.includes('\\')
      ? path.dirname(path.dirname(__dirname))
      : path.resolve(__dirname, '..', '..');
    const result = await execPromise(`powershell -Command "Set-Location '${composeDir}'; docker-compose stop ${containerId}"`);
    return {
      success: !result.error,
      message: result.error ? `停止失败: ${result.error}` : '停止成功',
      detail: result.stdout,
    };
  } catch (e) {
    return { success: false, message: `停止异常: ${e.message}` };
  }
}

async function getAllStatuses() {
  const statuses = [];
  for (const container of labContainers) {
    const status = await getContainerStatus(container.id);
    statuses.push({
      ...container,
      ...status,
    });
  }
  return statuses;
}

module.exports = {
  labContainers,
  startContainer,
  stopContainer,
  getAllStatuses,
  getContainerStatus,
};
