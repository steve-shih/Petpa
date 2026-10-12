'use client';

import { useState } from 'react';
import { returnOrders as initialReturnOrders, type ReturnOrder } from '@/lib/mock-data';

export default function AdminReturnsPage() {
  const [returnsList, setReturnsList] = useState<ReturnOrder[]>(initialReturnOrders);

  // 平台管理員進行審核
  const handleAdminDecision = (id: string, decision: 'Approved' | 'Rejected', restock: boolean = true) => {
    setReturnsList(prev => prev.map(r => {
      if (r._id !== id) return r;

      const newAdminStatus = decision;
      const isSellerApproved = r.sellerApprovalStatus === 'Approved';

      // 雙重審核規則：平台與賣家雙方均為 Approved 才算最終核准成立
      const isBothApproved = newAdminStatus === 'Approved' && isSellerApproved;
      const isAnyRejected = newAdminStatus === 'Rejected' || r.sellerApprovalStatus === 'Rejected';

      const finalOverallStatus: ReturnOrder['status'] = isBothApproved ? 'Approved' : isAnyRejected ? 'Rejected' : 'PendingDualReview';

      return {
        ...r,
        adminApprovalStatus: newAdminStatus,
        status: finalOverallStatus,
        restockInventory: isBothApproved ? restock : r.restockInventory,
      };
    }));

    if (decision === 'Approved') {
      alert('✅ 平台管理員已審核同意該筆退貨！\n' + (restock ? '系統將於雙方均同意後自動將商品庫存補回 ERP。' : ''));
    } else {
      alert('❌ 平台管理員已駁回該筆退貨申請。');
    }
  };

  const handleMarkRefunded = (id: string) => {
    setReturnsList(prev => prev.map(r => r._id === id ? { ...r, status: 'Refunded' } : r));
    alert('💰 已標記完成買家退款發放！');
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 標題與說明 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>
            🔄 售後退貨中心 — 平台與賣家雙重審核制
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
            消費者退貨將即時通知賣家與總倉；<strong>平台與賣家雙方均需審核同意</strong>，方可成立退款並自動回補進銷存 ERP 庫存
          </p>
        </div>
      </div>

      {/* 雙重審核規則橫幅 */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px 18px', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 26 }}>⚖️</div>
        <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.6 }}>
          <strong>平台核心安全規則：</strong>
          為防止買賣糾紛或惡意退貨，退貨流程採<strong>「賣家端 + 平台總倉」雙重核准機制</strong>。雙方任一方若審查有異議，將啟動客服人工協商調解；雙方均確認無誤後，系統始解鎖退款撥款權限。
        </div>
      </div>

      {/* 退貨統計 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div className="kpi-card" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
          <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>待審核 / 雙方協商中</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
            {returnsList.filter(r => r.status === 'PendingDualReview' || (r.status as any) === 'PendingReview').length} 筆
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: 12, color: '#047857', fontWeight: 600 }}>雙方核准成立</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 4 }}>
            {returnsList.filter(r => r.status === 'Approved' || r.status === 'Refunded').length} 筆
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>預計退款總金額</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1D4ED8', marginTop: 4 }}>
            NT$ {returnsList.filter(r => r.status !== 'Rejected').reduce((sum, r) => sum + r.refundAmount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 退貨單表格 */}
      <div className="kpi-card" style={{ padding: 0, overflowX: 'auto', borderRadius: 16 }}>
        <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>退貨單號 / 原訂單</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>買家與合作賣家</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>退貨品項</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>退款金額</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>退貨原因</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>🏠 賣家審核</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>🏛️ 平台審核</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>雙重同意狀態</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>平台操作</th>
            </tr>
          </thead>
          <tbody>
            {returnsList.map(r => {
              const sellerStatus = r.sellerApprovalStatus || 'Pending';
              const adminStatus = r.adminApprovalStatus || 'Pending';
              const isBothApproved = sellerStatus === 'Approved' && adminStatus === 'Approved';
              const isRejected = sellerStatus === 'Rejected' || adminStatus === 'Rejected';

              return (
                <tr key={r._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', color: '#1E293B' }}>{r.returnNumber}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>原單: {r.orderNumber}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700 }}>👤 {r.customerName}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>🏠 {r.catteryName}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{r.productTitle}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>數量：{r.qty} 件</div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>
                    NT$ {r.refundAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: 160 }}>
                    <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: 4, fontSize: 11.5 }}>
                      ⚠️ {r.reason}
                    </span>
                  </td>

                  {/* 賣家審核標籤 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: sellerStatus === 'Approved' ? '#DCFCE7' : sellerStatus === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                      color: sellerStatus === 'Approved' ? '#15803D' : sellerStatus === 'Rejected' ? '#B91C1C' : '#B45309',
                    }}>
                      {({ Approved: '✅ 賣家已同意', Rejected: '❌ 賣家已拒絕', Pending: '⏳ 等待賣家審核', PendingReview: '⏳ 等待賣家審核' } as Record<string, string>)[sellerStatus] || sellerStatus}
                    </span>
                  </td>

                  {/* 平台審核標籤 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: adminStatus === 'Approved' ? '#DCFCE7' : adminStatus === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                      color: adminStatus === 'Approved' ? '#15803D' : adminStatus === 'Rejected' ? '#B91C1C' : '#B45309',
                    }}>
                      {({ Approved: '✅ 平台已同意', Rejected: '❌ 平台已駁回', Pending: '⏳ 待總倉審核', PendingReview: '⏳ 待總倉審核' } as Record<string, string>)[adminStatus] || adminStatus}
                    </span>
                  </td>

                  {/* 雙重同意最終判定 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {isBothApproved ? (
                      <span style={{ background: '#10B981', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 800 }}>
                        🎉 雙方均同意 (核准成立)
                      </span>
                    ) : isRejected ? (
                      <span style={{ background: '#EF4444', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 800 }}>
                        ❌ 退貨不成立
                      </span>
                    ) : (
                      <span style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        ⏳ 等待雙方審核中
                      </span>
                    )}
                  </td>

                  {/* 管理員操作 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {(adminStatus === 'Pending' || adminStatus === 'PendingReview') && (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          className="btn-admin btn-admin-primary"
                          onClick={() => handleAdminDecision(r._id, 'Approved', true)}
                          style={{ padding: '4px 10px', fontSize: 11.5, background: '#10B981', color: 'white', borderRadius: 6, border: 'none' }}
                        >
                          同意
                        </button>
                        <button
                          className="btn-admin btn-admin-outline"
                          onClick={() => handleAdminDecision(r._id, 'Rejected')}
                          style={{ padding: '4px 8px', fontSize: 11.5, color: '#EF4444', borderColor: '#FCA5A5', borderRadius: 6 }}
                        >
                          駁回
                        </button>
                      </div>
                    )}

                    {isBothApproved && r.status !== 'Refunded' && (
                      <button
                        className="btn-admin btn-admin-primary"
                        onClick={() => handleMarkRefunded(r._id)}
                        style={{ padding: '4px 10px', fontSize: 11.5, background: '#1D4ED8', color: 'white', borderRadius: 6 }}
                      >
                        💰 撥款退款
                      </button>
                    )}

                    {r.status === 'Refunded' && (
                      <span style={{ fontSize: 12, color: '#047857', fontWeight: 700 }}>已完成退款結案</span>
                    )}
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
