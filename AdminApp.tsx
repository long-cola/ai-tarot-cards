import React, { useEffect, useState } from 'react';
import { AdminUser, TopicWithUsage, TopicEvent } from './types';

interface AdminTopic extends TopicWithUsage {}

const fetchJson = async (path: string, authHeader: string) => {
  const res = await fetch(path, {
    headers: { 'Authorization': authHeader }
  });
  const data = await res.json();
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || '请求失败');
  }
  return data;
};

const AdminApp: React.FC = () => {
  const [email, setEmail] = useState('catadioptric19941@gmail.com');
  const [password, setPassword] = useState('Admin@!23');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [events, setEvents] = useState<TopicEvent[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const loadUsers = async () => {
    if (!email.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const authHeader = 'Basic ' + btoa(`${email.trim()}:${password.trim()}`);
      const data = await fetchJson('/api/admin/users', authHeader);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err?.message || '加载用户失败');
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (user: AdminUser) => {
    if (!email.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }
    setSelectedUser(user);
    setTopics([]);
    setEvents([]);
    setLoadingTopics(true);
    setError('');
    try {
      const authHeader = 'Basic ' + btoa(`${email.trim()}:${password.trim()}`);
      const data = await fetchJson(`/api/admin/users/${user.id}/topics`, authHeader);
      setTopics(data.topics || []);
    } catch (err: any) {
      setError(err?.message || '加载命题失败');
    } finally {
      setLoadingTopics(false);
    }
  };

  const loadEvents = async (topic: AdminTopic) => {
    if (!email.trim() || !password.trim()) {
      setError('请输入账号和密码');
      return;
    }
    setLoadingEvents(true);
    setActiveTopic(topic);
    setError('');
    try {
      const authHeader = 'Basic ' + btoa(`${email.trim()}:${password.trim()}`);
      const data = await fetchJson(`/api/admin/topics/${topic.id}`, authHeader);
      setEvents(data.events || []);
      setActiveTopic(data.topic || topic);
    } catch (err: any) {
      setError(err?.message || '加载事件失败');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    const cachedEmail = sessionStorage.getItem('admin-email');
    const cachedPw = sessionStorage.getItem('admin-pw');
    if (cachedEmail) setEmail(cachedEmail);
    if (cachedPw) setPassword(cachedPw);
  }, []);

  useEffect(() => {
    if (email) sessionStorage.setItem('admin-email', email);
    if (password) sessionStorage.setItem('admin-pw', password);
  }, [email, password]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="bg-slate-900 border border-white/5 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">后台面板</h1>
            <p className="text-sm text-slate-400">查看用户、命题与事件数据（Basic Auth）</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm"
            />
            <button
              onClick={loadUsers}
              className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-semibold text-sm"
            >
              登录并加载
            </button>
          </div>
        </header>

        {error && <div className="bg-red-500/20 border border-red-500/40 text-red-100 px-4 py-2 rounded-lg text-sm">{error}</div>}

        <section className="bg-slate-900 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">用户列表</h2>
            {loading && <span className="text-xs text-slate-400">加载中...</span>}
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-slate-800/60">
                  <th className="text-left px-2 py-2">Email</th>
                  <th className="text-left px-2 py-2">计划</th>
                  <th className="text-left px-2 py-2">到期</th>
                  <th className="text-left px-2 py-2">注册时间</th>
                  <th className="text-left px-2 py-2">命题数</th>
                  <th className="text-left px-2 py-2">事件数</th>
                  <th className="text-left px-2 py-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/5">
                    <td className="px-2 py-2">{u.email || u.name || u.id}</td>
                    <td className="px-2 py-2">{u.plan}</td>
                    <td className="px-2 py-2">{u.membership_expires_at ? new Date(u.membership_expires_at).toLocaleDateString() : '-'}</td>
                    <td className="px-2 py-2">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                    <td className="px-2 py-2">{u.topic_count}</td>
                    <td className="px-2 py-2">{u.event_count}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => loadTopics(u)}
                        className="px-3 py-1 rounded bg-slate-800 border border-white/10 text-amber-100"
                      >
                        查看命题
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td className="px-2 py-3 text-center text-slate-500" colSpan={7}>暂无数据</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedUser && (
          <section className="bg-slate-900 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">命题 - {selectedUser.email || selectedUser.name || selectedUser.id}</h2>
              {loadingTopics && <span className="text-xs text-slate-400">加载中...</span>}
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/60">
                    <th className="text-left px-2 py-2">标题</th>
                    <th className="text-left px-2 py-2">创建时间</th>
                    <th className="text-left px-2 py-2">事件数</th>
                    <th className="text-left px-2 py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((t) => (
                    <tr key={t.id} className="border-t border-white/5">
                      <td className="px-2 py-2">{t.title}</td>
                      <td className="px-2 py-2">{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                      <td className="px-2 py-2">{(t as any).event_count ?? 0}</td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => loadEvents(t)}
                          className="px-3 py-1 rounded bg-slate-800 border border-white/10 text-amber-100"
                        >
                          查看事件
                        </button>
                      </td>
                    </tr>
                  ))}
                  {topics.length === 0 && !loadingTopics && (
                    <tr>
                      <td className="px-2 py-3 text-center text-slate-500" colSpan={4}>暂无命题</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {selectedUser && events.length > 0 && (
          <section className="bg-slate-900 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">事件列表</h2>
                {activeTopic && (
                  <div className="text-xs text-slate-400">
                    课题：{activeTopic.title} | 基准牌：{(activeTopic.baseline_cards || []).map(c => (c as any).nameCn || (c as any).name || '').join('，')}
                  </div>
                )}
              </div>
              {loadingEvents && <span className="text-xs text-slate-400">加载中...</span>}
            </div>
            {activeTopic?.baseline_reading && (
              <div className="bg-slate-800/60 border border-white/5 rounded-lg p-3 text-xs text-slate-200 whitespace-pre-wrap mb-3">
                {activeTopic.baseline_reading}
              </div>
            )}
            <div className="overflow-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-slate-800/60">
                    <th className="text-left px-2 py-2">名称</th>
                    <th className="text-left px-2 py-2">时间</th>
                    <th className="text-left px-2 py-2">牌</th>
                    <th className="text-left px-2 py-2">解读</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} className="border-t border-white/5 align-top">
                      <td className="px-2 py-2">{ev.name}</td>
                      <td className="px-2 py-2">{ev.created_at ? new Date(ev.created_at).toLocaleString() : '-'}</td>
                      <td className="px-2 py-2">{(ev.cards || []).map(c => (c as any).name || (c as any).nameCn || '').join(', ')}</td>
                      <td className="px-2 py-2 whitespace-pre-wrap max-w-xs">{ev.reading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminApp;
