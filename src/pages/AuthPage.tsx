import { useState } from 'react';
import { api, type ApiUser } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUserStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await api.login(username.trim(), password)
        : await api.register(username.trim(), password, email.trim() || undefined);
      login({ id: result.user.id, name: result.user.username, email: result.user.email || '', joinDate: new Date().toISOString().split('T')[0] });
      navigate('/');
    } catch (err: any) {
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  }

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const guestUser = { id: -Date.now(), name: '游客' + Math.random().toString(36).slice(2, 6), email: '', joinDate: new Date().toISOString().split('T')[0] };
      login(guestUser);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '游客登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4"
      style={{ background: 'radial-gradient(circle at 20% 30%, #00ff8820, transparent), radial-gradient(circle at 80% 70%, #00d4ff20, transparent), #0f172a' }}>
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">🛡️</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            CISP 学习平台
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {mode === 'login' ? '欢迎回来，请登录' : '创建新账号开始学习'}
          </p>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-800/50 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === 'login' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === 'register' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="至少3个字符"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
              minLength={3}
              autoComplete="username"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">邮箱 (可选)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-300 mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少6个字符"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : (mode === 'login' ? '登录' : '注册账号')}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-2.5 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              👤 游客体验（无需注册）
            </button>
          </div>
        )}

        <div className="text-center text-xs text-slate-500 mt-6">
          数据将安全存储在后端 SQLite 数据库中
        </div>
      </div>
    </div>
  );
}

export async function getUser(): Promise<ApiUser | null> {
  return api.getStoredUser();
}
