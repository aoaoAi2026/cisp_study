const USERS_KEY = 'cisp_users';
const PROGRESS_KEY = 'cisp_progress_';
const TOKEN_KEY = 'cisp_token';
const USER_KEY = 'cisp_user';

export interface LocalUser {
  id: number;
  username: string;
  password: string;
  email?: string;
  createdAt: string;
}

export interface UserProgress {
  userId: number;
  currentDay: number;
  completedDays: { dayId: string; completedAt: string; quizScore?: number }[];
  streak: number;
  lastStudyDate: string;
  mode: 'full' | 'intensive';
  completedLabs: string[];
  quizResults: Record<string, { score: number; date: string }>;
}

export interface ContainerInfo {
  id: string;
  name: string;
  description: string;
  port: number;
  url: string;
  dockerImage: string;
  difficulty: string;
  category: string;
  defaultLogin: string;
  features: string[];
  running: boolean;
  status: string;
}

export interface LabTool {
  id: string;
  name: string;
  description: string;
  commands: { name: string; cmd: string; description: string }[];
  officialSite: string;
}

function getStoredUsers(): LocalUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: LocalUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getProgressKey(userId: number): string {
  return `${PROGRESS_KEY}${userId}`;
}

export const LocalDB = {
  users: {
    getAll(): LocalUser[] {
      return getStoredUsers();
    },

    getById(id: number): LocalUser | undefined {
      return getStoredUsers().find((u) => u.id === id);
    },

    getByUsername(username: string): LocalUser | undefined {
      return getStoredUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
    },

    create(user: Omit<LocalUser, 'id' | 'createdAt'>): LocalUser {
      const users = getStoredUsers();
      const newUser: LocalUser = {
        ...user,
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveUsers(users);
      return newUser;
    },

    exists(username: string): boolean {
      return getStoredUsers().some((u) => u.username.toLowerCase() === username.toLowerCase());
    },
  },

  progress: {
    get(userId: number): UserProgress {
      const raw = localStorage.getItem(getProgressKey(userId));
      if (raw) {
        return JSON.parse(raw);
      }
      return this.create(userId);
    },

    create(userId: number): UserProgress {
      const defaultProgress: UserProgress = {
        userId,
        currentDay: 1,
        completedDays: [],
        streak: 0,
        lastStudyDate: '',
        mode: 'full',
        completedLabs: [],
        quizResults: {},
      };
      localStorage.setItem(getProgressKey(userId), JSON.stringify(defaultProgress));
      return defaultProgress;
    },

    save(userId: number, progress: UserProgress): void {
      localStorage.setItem(getProgressKey(userId), JSON.stringify(progress));
    },

    update(userId: number, updates: Partial<UserProgress>): UserProgress {
      const current = this.get(userId);
      const updated = { ...current, ...updates };
      this.save(userId, updated);
      return updated;
    },

    reset(userId: number): UserProgress {
      return this.create(userId);
    },
  },

  auth: {
    setToken(token: string): void {
      localStorage.setItem(TOKEN_KEY, token);
    },

    getToken(): string | null {
      return localStorage.getItem(TOKEN_KEY);
    },

    clearToken(): void {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },

    setUser(user: LocalUser): void {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getUser(): LocalUser | null {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as LocalUser;
      } catch {
        return null;
      }
    },
  },

  labs: {
    getAllContainers(): ContainerInfo[] {
      return [
        {
          id: 'sqli-lab',
          name: 'SQL注入靶场',
          description: '包含多种SQL注入场景，适合学习SQL注入基础与进阶技术',
          port: 8081,
          url: 'http://localhost:8081',
          dockerImage: 'vulhub/sqli-labs:latest',
          difficulty: '简单',
          category: 'Web安全',
          defaultLogin: 'admin/admin',
          features: ['Union注入', '布尔盲注', '时间盲注', '报错注入'],
          running: false,
          status: 'stopped',
        },
        {
          id: 'xss-lab',
          name: 'XSS跨站脚本',
          description: '存储型、反射型、DOM型XSS综合练习平台',
          port: 8082,
          url: 'http://localhost:8082',
          dockerImage: 'vulhub/xss-game:latest',
          difficulty: '中等',
          category: 'Web安全',
          defaultLogin: 'test/test',
          features: ['反射型XSS', '存储型XSS', 'DOM型XSS', 'XSS过滤绕过'],
          running: false,
          status: 'stopped',
        },
        {
          id: 'fileupload-lab',
          name: '文件上传漏洞',
          description: '文件上传绕过、解析漏洞综合练习环境',
          port: 8083,
          url: 'http://localhost:8083',
          dockerImage: 'vulhub/fileupload:latest',
          difficulty: '困难',
          category: 'Web安全',
          defaultLogin: 'admin/admin',
          features: ['前端校验绕过', '后端校验绕过', '文件解析漏洞', '.htaccess攻击'],
          running: false,
          status: 'stopped',
        },
        {
          id: 'cmdinject-lab',
          name: '命令注入练习',
          description: '操作系统命令注入漏洞学习环境',
          port: 8084,
          url: 'http://localhost:8084',
          dockerImage: 'vulhub/cmd-inject:latest',
          difficulty: '中等',
          category: 'Web安全',
          defaultLogin: '',
          features: ['命令拼接', '命令替换', '时间盲注', '无回显注入'],
          running: false,
          status: 'stopped',
        },
      ];
    },

    getAllTools(): LabTool[] {
      return [
        {
          id: 'nmap',
          name: 'Nmap',
          description: '网络扫描和安全审计工具，用于发现网络上的主机和服务',
          officialSite: 'https://nmap.org',
          commands: [
            { name: '基本扫描', cmd: 'nmap 192.168.1.0/24', description: '扫描整个子网' },
            { name: '端口扫描', cmd: 'nmap -p 1-65535 target.com', description: '扫描所有端口' },
            { name: '版本探测', cmd: 'nmap -sV target.com', description: '探测服务版本' },
            { name: '操作系统探测', cmd: 'nmap -O target.com', description: '识别操作系统' },
          ],
        },
        {
          id: 'sqlmap',
          name: 'SQLMap',
          description: '自动化SQL注入检测和利用工具',
          officialSite: 'https://sqlmap.org',
          commands: [
            { name: '基本检测', cmd: 'sqlmap -u "http://target.com/page.php?id=1"', description: '检测并利用SQL注入' },
            { name: '指定数据库', cmd: 'sqlmap -u "http://target.com/page.php?id=1" --dbms=mysql', description: '指定数据库类型' },
            { name: '获取数据库', cmd: 'sqlmap -u "http://target.com/page.php?id=1" --dbs', description: '列出所有数据库' },
            { name: '读取文件', cmd: 'sqlmap -u "http://target.com/page.php?id=1" --file-read=/etc/passwd', description: '读取服务器文件' },
          ],
        },
        {
          id: 'burp',
          name: 'Burp Suite',
          description: 'Web应用安全测试工具集，包含代理、扫描器等功能',
          officialSite: 'https://portswigger.net/burp',
          commands: [
            { name: '启动代理', cmd: 'java -jar burpsuite.jar', description: '启动Burp Suite' },
            { name: '配置代理', cmd: 'export http_proxy=http://127.0.0.1:8080', description: '设置系统代理' },
            { name: '生成POC', cmd: 'Burp -> Scan -> Generate POC', description: '生成漏洞POC' },
            { name: '保存配置', cmd: 'Burp -> Project -> Save Project', description: '保存项目配置' },
          ],
        },
        {
          id: 'metasploit',
          name: 'Metasploit',
          description: '渗透测试框架，包含大量漏洞利用模块',
          officialSite: 'https://www.metasploit.com',
          commands: [
            { name: '启动控制台', cmd: 'msfconsole', description: '启动Metasploit控制台' },
            { name: '搜索模块', cmd: 'search ms17-010', description: '搜索漏洞利用模块' },
            { name: '使用模块', cmd: 'use exploit/windows/smb/ms17_010_eternalblue', description: '使用特定漏洞模块' },
            { name: '设置参数', cmd: 'set RHOSTS 192.168.1.100', description: '设置目标主机' },
          ],
        },
      ];
    },
  },
};

export function generateToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}