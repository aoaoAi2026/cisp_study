import { LocalDB, hashPassword, generateToken } from '../data/LocalStorageDB';

export interface ApiUser {
  id: number;
  username: string;
  email?: string;
}

async function getToken(): Promise<string | null> {
  return LocalDB.auth.getToken();
}

async function setToken(token: string): Promise<void> {
  return LocalDB.auth.setToken(token);
}

async function clearToken(): Promise<void> {
  return LocalDB.auth.clearToken();
}

export const api = {
  getToken,
  setToken,
  clearToken,

  async register(username: string, password: string, email?: string) {
    if (await LocalDB.users.exists(username)) {
      throw new Error('用户名已存在');
    }
    
    const hashedPassword = hashPassword(password);
    const user = await LocalDB.users.create({ username, password: hashedPassword, email });
    
    const token = generateToken();
    await setToken(token);
    await LocalDB.auth.setUser(user);
    
    return { token, user: { id: user.id, username: user.username, email: user.email }, message: '注册成功' };
  },

  async login(username: string, password: string) {
    const user = await LocalDB.users.getByUsername(username);
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      throw new Error('用户名或密码错误');
    }
    
    const token = generateToken();
    await setToken(token);
    await LocalDB.auth.setUser(user);
    
    return { token, user: { id: user.id, username: user.username, email: user.email }, message: '登录成功' };
  },

  async me() {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    return { user: { id: user.id, username: user.username, email: user.email } };
  },

  async getProgress() {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    return LocalDB.progress.get(user.id);
  },

  async completeDay(dayId: string, quizScore?: number) {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    
    const progress = await LocalDB.progress.get(user.id);
    const alreadyCompleted = progress.completedDays.some((d) => d.dayId === dayId);
    
    if (!alreadyCompleted) {
      progress.completedDays.push({ dayId, completedAt: new Date().toISOString(), quizScore });
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (progress.lastStudyDate === yesterday) {
        progress.streak++;
      } else if (progress.lastStudyDate !== today) {
        progress.streak = 1;
      }
      progress.lastStudyDate = today;
      
      const dayNum = parseInt(dayId.replace('day-', ''));
      if (dayNum >= progress.currentDay) {
        progress.currentDay = dayNum + 1;
      }
      
      await LocalDB.progress.save(user.id, progress);
    }
    
    return { currentDay: progress.currentDay };
  },

  async completeLab(labId: string) {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    
    const progress = await LocalDB.progress.get(user.id);
    if (!progress.completedLabs.includes(labId)) {
      progress.completedLabs.push(labId);
      await LocalDB.progress.save(user.id, progress);
    }
    
    return { success: true };
  },

  async saveQuiz(quizId: string, score: number) {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    
    const progress = await LocalDB.progress.get(user.id);
    progress.quizResults[quizId] = { score, date: new Date().toISOString() };
    await LocalDB.progress.save(user.id, progress);
    
    return { success: true };
  },

  async updatePreferences(prefs: { currentDay?: number; mode?: 'full' | 'intensive' }) {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    
    const progress = await LocalDB.progress.get(user.id);
    if (prefs.currentDay !== undefined) progress.currentDay = prefs.currentDay;
    if (prefs.mode !== undefined) progress.mode = prefs.mode;
    await LocalDB.progress.save(user.id, progress);
    
    return { success: true };
  },

  async resetProgress() {
    const user = await LocalDB.auth.getUser();
    if (!user) {
      throw new Error('未登录');
    }
    
    await LocalDB.progress.reset(user.id);
    return { success: true };
  },

  async getStoredUser(): Promise<ApiUser | null> {
    const user = await LocalDB.auth.getUser();
    if (!user) return null;
    return { id: user.id, username: user.username, email: user.email };
  },

  async getLabList() {
    return { containers: LocalDB.labs.getAllContainers() };
  },

  async startLab(containerId: string) {
    return { containerId, status: 'started', message: '实验室环境已启动（模拟）', success: true };
  },

  async stopLab(containerId: string) {
    return { containerId, status: 'stopped', message: '实验室环境已停止（模拟）', success: true };
  },

  async getLabStatus(containerId: string) {
    return { containerId, status: 'running', ports: { 80: 'http://localhost:8080' } };
  },

  async getLabTools() {
    return { tools: LocalDB.labs.getAllTools() };
  },
};

export async function isLoggedIn(): Promise<boolean> {
  return !!(await getToken());
}

export async function logout(): Promise<void> {
  await clearToken();
}
