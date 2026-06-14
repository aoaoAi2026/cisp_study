/**
 * 页面级数据持久化工具
 * APK 使用 Capacitor Preferences，浏览器自动降级 localStorage
 */
import { storageSet, storageGet, storageRemove } from './NativeStorage';

export async function saveData(key: string, data: any): Promise<void> {
  await storageSet(key, JSON.stringify(data));
}

export async function loadData<T>(key: string, fallback: T): Promise<T> {
  const raw = await storageGet(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export async function removeData(key: string): Promise<void> {
  await storageRemove(key);
}
