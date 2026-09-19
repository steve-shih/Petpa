'use client';

import { useState } from 'react';
import { returnOrders as initialReturnOrders, type ReturnOrder } from '@/lib/mock-data';

export default function AdminReturnsPage() {
  const [returnsList, setReturnsList] = useState<ReturnOrder[]>(initialReturnOrders);

  const handleApproveReturn = (id: string, restock: boolean) => {
    setReturnsList(prev => prev.map(r => {
      if (r._id === id) {
        return {
          ...r,
          status: 'Approved',
          restockInventory: restock,
        };
      }
      return r;
    }));
    alert(`✅ 已成功同意該筆退貨申請！${restock ? '\n系統已自動將退貨商品 +1 補回進銷存 ERP 庫存！' : ''}`);
  };

  const handleRejectReturn = (id: string) => {
    setReturnsList(prev => prev.map(r => r._id === id ? { ...r, status: 'Rejected' } : r));
    alert('❌ 已拒絕該筆退貨申請！');
  };

  const handleMarkRefunded = (id: string) => {
    setReturnsList(prev => prev.map(r => r._id === id ? { ...r, status: 'Refunded' } : r));
    alert('💰 已標記完成退款發放！');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🔄 售後服務與退貨單管理</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>買家售後退貨申請審核、原商品 ERP 庫存自動補回與退款追蹤</p>
        </div>
      </div>

      {/* 退貨統計 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div className="kpi-card" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
          <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>待審核退貨單</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
            {returnsList.filter(r => r.status === 'PendingReview').length} 筆
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>本月預計退款金額</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1D4ED8', marginTop: 4 }}>
            NT$ {returnsList.filter(r => r.status !== 'Rejected').reduce((sum, r) => sum + r.refundAmount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 退貨單表格 */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>退貨單號 / 原訂單</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>買家與合作貓舍</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>退貨商品與數量</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>退款金額</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>退貨原因</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>ERP 庫存補回</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>狀態</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {returnsList.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 800, fontFamily: 'monospace' }}>{r.returnNumber}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>原單: {r.orderNumber}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700 }}>👤 {r.customerName}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>🏠 {r.catteryName}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600 }}>{r.productTitle}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>數量：{r.qty} 件</div>
                </td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: 'var(--color-danger)' }}>
                  NT${r.refundAmount}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="badge" style={{ background: '#F1F5F9', color: '#475569', fontSize: 11.5 }}>
                    ⚠️ {r.reason}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {r.restockInventory ? (
                    <span style={{ fontSize: 11.5, color: '#047857', fontWeight: 700 }}>✅ 已補回庫存</span>
                  ) : (
                    <span style={{ fontSize: 11.5, color: '#94A3B8' }}>⚪ 未補回</span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {r.status === 'PendingReview' && <span className="badge" style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 10px' }}>⏳ 待審核</span>}
                  {r.status === 'Approved' && <span className="badge" style={{ background: '#ECFDF5', color: '#047857', padding: '4px 10px' }}>✅ 已同意退貨</span>}
                  {r.status === 'Refunded' && <span className="badge" style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px' }}>💰 已完成退款</span>}
                  {r.status === 'Rejected' && <span className="badge" style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 10px' }}>❌ 已拒絕</span>}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {r.status === 'PendingReview' && (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button className="btn-admin btn-admin-primary" onClick={() => handleApproveReturn(r._id, true)} style={{ padding: '3px 8px', fontSize: 11 }}>
                        ✅ 同意並補庫存
                      </button>
                      <button className="btn-admin btn-admin-outline" onClick={() => handleRejectReturn(r._id)} style={{ padding: '3px 8px', fontSize: 11, color: '#DC2626' }}>
                        ❌ 拒絕
                      </button>
                    </div>
                  )}
                  {r.status === 'Approved' && (
                    <button className="btn-admin btn-admin-primary" onClick={() => handleMarkRefunded(r._id)} style={{ padding: '3px 10px', fontSize: 11 }}>
                      💰 標記完成撥款退款
                    </button>
                  )}
                  {(r.status === 'Refunded' || r.status === 'Rejected') && (
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>已結案</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
