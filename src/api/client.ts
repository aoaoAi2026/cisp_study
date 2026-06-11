const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('cisp_token');
}

function setToken(token: string) {
  localStorage.setItem('cisp_token', token);
}

function clearToken() {
  localStorage.removeItem('cisp_token');
  localStorage.removeItem('cisp_user');
}

export interface ApiUser {
  id: number;
  username: string;
  email?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as any).error || '请求失败') as any;
    err.status = res.status;
    err.detail = (data as any).detail;
    throw err;
  }
  return data as T;
}

export const api = {
  getToken,
  setToken,
  clearToken,

  async register(username: string, password: string, email?: string) {
    const data = await request<{ token: string; user: ApiUser; message: string }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ username, password, email }) }
    );
    setToken(data.token);
    localStorage.setItem('cisp_user', JSON.stringify(data.user));
    return data;
  },

  async login(username: string, password: string) {
    const data = await request<{ token: string; user: ApiUser; message: string }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) }
    );
    setToken(data.token);
    localStorage.setItem('cisp_user', JSON.stringify(data.user));
    return data;
  },

  async me() {
    return request<{ user: ApiUser }>('/auth/me');
  },

  async getProgress() {
    return request<any>('/progress/all');
  },

  async completeDay(dayId: string, quizScore?: number) {
    return request<any>(`/progress/day/${dayId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ quizScore }),
    });
  },

  async completeLab(labId: string) {
    return request<any>(`/progress/lab/${labId}/complete`, { method: 'POST' });
  },

  async saveQuiz(quizId: string, score: number) {
    return request<any>(`/progress/quiz/${quizId}`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
  },

  async updatePreferences(prefs: { currentDay?: number; mode?: 'full' | 'intensive' }) {
    return request<any>('/progress/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  },

  async resetProgress() {
    return request<any>('/progress/reset', { method: 'POST' });
  },

  getStoredUser(): ApiUser | null {
    const raw = localStorage.getItem('cisp_user');
    if (!raw) return null;
    try { return JSON.parse(raw) as ApiUser; } catch { return null; }
  },

  async getLabList() {
    return request<any>('/labs/list');
  },

  async startLab(containerId: string) {
    return request<any>(`/labs/start/${containerId}`, { method: 'POST' });
  },

  async stopLab(containerId: string) {
    return request<any>(`/labs/stop/${containerId}`, { method: 'POST' });
  },

  async getLabStatus(containerId: string) {
    return request<any>(`/labs/status/${containerId}`);
  },

  async getLabTools() {
    return request<any>('/labs/tools');
  },
};

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout() {
  clearToken();
}
