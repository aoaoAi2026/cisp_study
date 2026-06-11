const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'pastPapers.ts');
let content = fs.readFileSync(filePath, 'utf8');

const environments = {
  'cisp-2024-hubei': [
    {
      id: 'juice-shop-2024',
      name: 'OWASP Juice Shop',
      description: '包含 OWASP Top 10 漏洞的Web应用靶场，用于练习各类Web攻击',
      url: 'https://owasp.org/www-project-juice-shop/'
    },
    {
      id: 'dvwa-2024',
      name: 'DVWA',
      description: 'Damn Vulnerable Web App - 用于练习常见Web漏洞',
      url: 'http://www.dvwa.co.uk/'
    },
    {
      id: 'bwapp-2024',
      name: 'bWAPP',
      description: '含100+漏洞的Web应用靶场，涵盖各类漏洞类型',
      url: 'http://www.itsecgames.com/'
    }
  ],
  'cisp-2024-national': [
    {
      id: 'webgoat-2024',
      name: 'WebGoat',
      description: 'OWASP官方Web安全教学应用，包含多个教学场景',
      url: 'https://owasp.org/www-project-webgoat/'
    },
    {
      id: 'hackthebox-2024',
      name: 'Hack The Box',
      description: '在线网络安全实验平台，提供真实攻击场景',
      url: 'https://www.hackthebox.com/'
    },
    {
      id: 'sqli-labs-2024',
      name: 'SQLi-Labs',
      description: 'SQL注入漏洞练习靶场',
      url: 'https://github.com/Audi-1/sqli-labs'
    }
  ],
  'cisp-2023-national': [
    {
      id: 'cisp-mock-2023',
      name: 'CISP 模拟考试系统',
      description: 'CISP考试官方模拟练习环境',
      url: 'https://www.cisp.com.cn/'
    },
    {
      id: 'xss-game-2023',
      name: 'XSS Game',
      description: 'Google官方跨站脚本攻击练习平台',
      url: 'https://xss-game.appspot.com/'
    }
  ],
  'cisp-2022-national': [
    {
      id: 'tryhackme-2022',
      name: 'TryHackMe',
      description: '交互式网络安全学习平台',
      url: 'https://tryhackme.com/'
    },
    {
      id: 'picoctf-2022',
      name: 'PicoCTF',
      description: '免费CTF练习平台',
      url: 'https://picoctf.org/'
    }
  ]
};

function formatEnvs(envs) {
  if (!envs || envs.length === 0) return '';
  const items = envs.map(e =>
    `    {\n      id: '${e.id}',\n      name: '${e.name}',\n      description: '${e.description}',\n      url: '${e.url}'\n    }`
  ).join(',\n');
  return `[\n${items}\n  ]`;
}

let outputLines = [];
const lines = content.split('\n');
let i = 0;

while (i < lines.length) {
  const line = lines[i];
  const paperMatch = line.match(/id:\s*'(cisp-\d{4}-[\w-]+)'/);

  if (paperMatch) {
    const paperId = paperMatch[1];
    outputLines.push(line);
    i++;

    let objectLines = [];
    let foundClosing = false;
    let foundPracticeEnv = false;

    while (i < lines.length && !foundClosing) {
      const innerLine = lines[i];

      // Check if this paper already has practiceEnvironment
      if (innerLine.includes('practiceEnvironment')) {
        foundPracticeEnv = true;
      }

      // Match only top-level paper close: `  },` or `  }` (last paper)
      if (innerLine === '  },' || innerLine === '  }') {
        // Add practiceEnvironment before closing
        const envs = environments[paperId];
        if (envs && !foundPracticeEnv) {
          const envsStr = formatEnvs(envs);
          objectLines.push(`    practiceEnvironment: ${envsStr}`);
        }
        objectLines.push(innerLine);
        foundClosing = true;
      } else {
        objectLines.push(innerLine);
      }
      i++;
    }

    outputLines.push(...objectLines);
  } else {
    outputLines.push(line);
    i++;
  }
}

const result = outputLines.join('\n');
fs.writeFileSync(filePath, result, 'utf8');
console.log('Successfully updated pastPapers.ts with practice environments');
