'use client';

import { useState } from 'react';
import { auditLogs as initialAuditLogs, type AuditLog } from '@/lib/mock-data';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    const matchRole = roleFilter === 'all' || log.role === roleFilter;
    const matchText = log.userName.toLowerCase().includes(search.toLowerCase()) ||
                      log.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                      log.actionDetails.toLowerCase().includes(search.toLowerCase()) ||
                      log.ipAddress.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchText;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🛡️ 平台特權級別系統操作審計日誌 (Audit Log)</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>紀錄平台總管理員、管理員、賣家與買家之所有 API 操作、IP 位置、使用設備與詳細內容</p>
        </div>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, color: '#92400E' }}>
          👑 最高管理員 (SuperAdmin) 稽核層級
        </div>
      </div>

      {/* 搜尋與角色篩選 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 關鍵字搜尋 (用戶、Email、IP 位置、操作詳情...)"
          className="form-input"
          style={{ flex: 1, minWidth: 260 }}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="form-input" style={{ width: 180 }}>
          <option value="all">🌐 全部權限角色 ({logs.length})</option>
          <option value="super_admin">👑 平台總管理員 (SuperAdmin)</option>
          <option value="admin">👨‍💼 一般管理員 (Admin)</option>
          <option value="seller">🐱/📱 賣家 (Seller)</option>
          <option value="buyer">🛍️ 買家 (Buyer)</option>
        </select>
      </div>

      {/* 日誌記錄表格 */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>時間戳記 (Timestamp)</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>層級角色</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>操作者與 Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>IP 位置 & 使用設備</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>呼叫 API Endpoint</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>完整操作行為與日誌內容</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#64748B' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: '12px' }}>
                  {log.role === 'super_admin' && <span className="badge" style={{ background: '#EDE9FE', color: '#6D28D9', fontWeight: 800 }}>👑 總管理員</span>}
                  {log.role === 'admin' && <span className="badge" style={{ background: '#EFF6FF', color: '#1D4ED8', fontWeight: 800 }}>👨‍💼 管理員</span>}
                  {log.role === 'seller' && <span className="badge" style={{ background: '#FFF7ED', color: '#C2410C', fontWeight: 800 }}>🐱 賣家</span>}
                  {log.role === 'buyer' && <span className="badge" style={{ background: '#ECFDF5', color: '#047857', fontWeight: 800 }}>🛍️ 買家</span>}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700 }}>{log.userName}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}><code>{log.userEmail}</code></div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1E293B' }}>{log.ipAddress}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{log.deviceInfo}</div>
                </td>
                <td style={{ padding: '12px', fontFamily: 'monospace', color: '#2563EB', fontWeight: 700 }}>
                  {log.apiEndpoint}
                </td>
                <td style={{ padding: '12px', color: 'var(--color-text)', lineHeight: 1.5 }}>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 6, fontSize: 12 }}>
                    {log.actionDetails}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
