'use client';

import { useState } from 'react';
import { catteries, orders, trendData } from '@/lib/mock-data';

export default function AdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [emailStatus, setEmailStatus] = useState<Record<string, boolean>>({});
  const [isSendingAll, setIsSendingAll] = useState(false);

  const handleSendReport = (catteryId: string, catteryName: string, email: string) => {
    setEmailStatus(prev => ({ ...prev, [catteryId]: true }));
    alert(`📧 [系統模擬郵件發送成功]\n已成功將【${selectedMonth} 月份對帳財務與導流效益報表】PDF 與 Excel 附件寄送至：\n收件人：${catteryName} (${email})`);
  };

  const handleSendAllReports = () => {
    setIsSendingAll(true);
    setTimeout(() => {
      const updated: Record<string, boolean> = {};
      catteries.forEach(c => { updated[c.catteryId] = true; });
      setEmailStatus(updated);
      setIsSendingAll(false);
      alert(`🚀 [每月例行自動推播完成]\n已為全站 ${catteries.length} 家合作貓舍生成 ${selectedMonth} 月度損益財務報表，並完成 Email 自動化發送！`);
    }, 1000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>📅 每月例行財務報表與合作賣家寄送排程</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>管理員每月固定匯出對帳月報，自動寄送至合作貓舍負責人 Email</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="form-input"
            style={{ width: 'auto', fontSize: 13 }}
          />
          <button className="btn-primary" onClick={handleSendAllReports} disabled={isSendingAll} style={{ padding: '9px 20px', fontSize: 13.5 }}>
            {isSendingAll ? '⏳ 批次生成與發送中...' : '📨 一鍵發送本期所有賣家月報'}
          </button>
        </div>
      </div>

      {/* 報表設定卡片 */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-lg)', padding: 18, marginBottom: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>⏰ 定期自動派送設定</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-brand-600)', marginTop: 2 }}>每月 1 日 09:00 (自動執行)</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>📊 本期全站預估營收</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>NT$ 128,500</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>💰 本期需派發賣家總分潤</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-danger)', marginTop: 2 }}>NT$ 19,275</div>
        </div>
      </div>

      {/* 合作貓舍報表寄送狀態清單 */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>合作貓舍名稱</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>專屬 URL 賣場</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>接收 Email</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>當月訂單筆數</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>結算應付分潤</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>報表寄送狀態</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {catteries.map(c => {
              const catteryOrders = orders.filter(o => o.catteryId === c.catteryId);
              const profit = catteryOrders.reduce((sum, o) => sum + o.sellerProfit, 0);
              const isSent = emailStatus[c.catteryId];
              const email = c.loginEmail || `${c.catteryId}@petpa.tw`;

              return (
                <tr key={c._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>
                    🐱 {c.name}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--color-brand-600)', fontFamily: 'monospace' }}>
                    /shop/{c.slug || c.catteryId}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <code style={{ fontSize: 12 }}>{email}</code>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600 }}>
                    {catteryOrders.length} 筆
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>
                    NT$ {profit}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {isSent ? (
                      <span className="badge" style={{ background: '#ECFDF5', color: '#047857', padding: '4px 10px', fontSize: 11.5 }}>
                        ✅ 已於今日寄送
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 10px', fontSize: 11.5 }}>
                        ⏳ 待發送 (排程 1 日)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      className="btn-admin btn-admin-outline"
                      onClick={() => handleSendReport(c.catteryId, c.name, email)}
                      style={{ padding: '4px 10px', fontSize: 12 }}
                    >
                      ✉️ 手動補寄月報
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
