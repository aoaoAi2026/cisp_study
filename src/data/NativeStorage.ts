/**
 * 持久化存储适配层
 * - APK/原生环境: 使用 Capacitor Preferences（写入 Android SharedPreferences，APP重启不丢数据）
 * - 浏览器环境: 自动降级到 localStorage
 */
import { Preferences } from '@capacitor/preferences';

let _isNative: boolean | null = null;

async function isNative(): Promise<boolean> {
  if (_isNative !== null) return _isNative;
  try {
    // Capacitor 在浏览器中 window.Capacitor 存在但 isNative 为 false
    // 在 APK 中 window.Capacitor?.isNative 为 true
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isNative) {
      _isNative = true;
    } else {
      // 浏览器环境，尝试 Preferences API（可能抛出错误）
      await Preferences.get({ key: '__cap_check__' });
      _isNative = false;
    }
  } catch {
    _isNative = false;
  }
  return _isNative ?? false;
}

export async function storageSet(key: string, value: string): Promise<void> {
  try {
    if (await isNative()) {
      await Preferences.set({ key, value });
    } else {
      localStorage.setItem(key, value);
    }
  } catch {
    // Capacitor Preferences 写入失败时，降级到 localStorage
    try { localStorage.setItem(key, value); } catch { /* quota exceeded, ignore */ }
  }
}

export async function storageGet(key: string): Promise<string | null> {
  try {
    if (await isNative()) {
      const result = await Preferences.get({ key });
      return result.value ?? null;
    }
    return localStorage.getItem(key);
  } catch {
    // 降级到 localStorage
    try { return localStorage.getItem(key); } catch { return null; }
  }
}

export async function storageRemove(key: string): Promise<void> {
  try {
    if (await isNative()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  }
}

export async function storageKeys(): Promise<string[]> {
  try {
    if (await isNative()) {
      const result = await Preferences.keys();
      return result.keys;
    }
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) keys.push(k);
    }
    return keys;
  } catch { return []; }
}

export async function storageClear(): Promise<void> {
  try {
    if (await isNative()) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  } catch {
    try { localStorage.clear(); } catch { /* ignore */ }
  }
}
