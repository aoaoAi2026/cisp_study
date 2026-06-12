import { Resource, Category } from '../types/resource';

const DB_NAME = 'CISPResourceDB';
const DB_VERSION = 1;
const STORE_NAME = 'resources';

interface DBSchema {
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

export class ResourceDB {
  private db: IDBDatabase | null = null;

  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('difficulty', 'difficulty', { unique: false });
          store.createIndex('title', 'title', { unique: false });
        }
      };
    });
  }

  async addResources(resources: Resource[]): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      resources.forEach(resource => {
        store.put(resource);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getAllResources(): Promise<Resource[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as Resource[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('category');
      const request = index.getAll(category);

      request.onsuccess = () => resolve(request.result as Resource[]);
      request.onerror = () => reject(request.error);
    });
  }

  async getResourceById(id: string): Promise<Resource | null> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result as Resource | null);
      request.onerror = () => reject(request.error);
    });
  }

  async getCategories(): Promise<Category[]> {
    const resources = await this.getAllResources();
    const categoryMap = new Map<string, number>();

    resources.forEach(resource => {
      const current = categoryMap.get(resource.category) || 0;
      categoryMap.set(resource.category, current + 1);
    });

    return Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: this.getCategoryName(id),
      icon: '',
      count
    }));
  }

  async getStats(): Promise<{
    total: number;
    categories: number;
    beginner: number;
    intermediate: number;
    advanced: number;
  }> {
    const resources = await this.getAllResources();
    return {
      total: resources.length,
      categories: new Set(resources.map(r => r.category)).size,
      beginner: resources.filter(r => r.difficulty === '入门').length,
      intermediate: resources.filter(r => r.difficulty === '进阶').length,
      advanced: resources.filter(r => r.difficulty === '精通').length,
    };
  }

  private getCategoryName(id: string): string {
    const names: Record<string, string> = {
      'penetration': '渗透测试',
      'vuln': '漏洞分析',
      'codeaudit': '代码审计',
      'djbh': '等级保护',
      'ctf': 'CTF竞赛',
      'cloud': '云安全',
      'mobile': '移动安全',
      'reverse': '逆向工程',
      'data-security': '数据安全',
      'incident': '应急响应',
      'intel': '威胁情报',
      'soc': '安全运维',
      'tools': '工具指南',
      'knowledge': '基础知识',
      'ai-security': 'AI安全',
      'supply-chain': '供应链安全',
      'ics-iot': 'ICS/IoT安全',
      'web3': 'Web3安全',
      'v2x': '车联网安全',
      'zero-trust': '零信任',
      'crypto-compliance': '密码合规',
      'hw': '安全运维',
    };
    return names[id] || id;
  }

  async isEmpty(): Promise<boolean> {
    const stats = await this.getStats();
    return stats.total === 0;
  }
}