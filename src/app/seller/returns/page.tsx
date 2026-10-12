'use client';

import { useState } from 'react';
import { returnOrders as initialReturnOrders, type ReturnOrder } from '@/lib/mock-data';

export default function SellerReturnsPage() {
  const [returnsList, setReturnsList] = useState<ReturnOrder[]>(
    initialReturnOrders.filter(r => r.catteryId === 'meow_house' || !r.catteryId)
  );

  // 賣家進行退貨審核 (同意 / 拒絕)
  const handleSellerDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setReturnsList(prev => prev.map(r => {
      if (r._id !== id) return r;

      const newSellerStatus = decision;
      const isAdminApproved = r.adminApprovalStatus === 'Approved';

      // 雙重審核規則：平台與賣家雙方均為 Approved 才算最終核准成立
      const isBothApproved = newSellerStatus === 'Approved' && isAdminApproved;
      const isAnyRejected = newSellerStatus === 'Rejected' || r.adminApprovalStatus === 'Rejected';

      const finalOverallStatus: ReturnOrder['status'] = isBothApproved ? 'Approved' : isAnyRejected ? 'Rejected' : 'PendingDualReview';

      return {
        ...r,
        sellerApprovalStatus: newSellerStatus,
        status: finalOverallStatus,
      };
    }));

    if (decision === 'Approved') {
      alert('✅ 您已審核同意該筆退貨！\n若平台管理員亦完成同意，系統將正式啟動退貨物流與退款程序。');
    } else {
      alert('❌ 您已拒絕該筆退貨申請。');
    }
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 標題與說明 */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>
          🔄 消費者售後退貨 — 賣家雙重審核中心
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
          平台保障機制：消費者申請退貨時將同步推播通知賣家與平台總倉，<strong>須雙方均審核同意方可成立退貨與撥款</strong>。
        </p>
      </div>

      {/* 雙重審核規則提示橫幅 */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '14px 18px', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 24 }}>⚖️</div>
        <div style={{ fontSize: 12.5, color: '#1E40AF', lineHeight: 1.6 }}>
          <strong>平台與賣家雙重同意規範：</strong>
          當買家在專屬賣場發起退貨時，您與平台管理員皆會收到通報。您可依據商品開箱完整性、使用現況進行同意或駁回。雙方皆核准後，總倉將安排收回並扣除相關分潤結算。
        </div>
      </div>

      {/* 退貨審核清單 */}
      <div className="kpi-card" style={{ padding: 0, overflowX: 'auto', borderRadius: 16 }}>
        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>退貨單號 / 原單</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>買家姓名</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>退貨商品</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>退款金額</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>退貨原因</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>🏠 賣家審核</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>🏛️ 平台審核</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>雙重同意結果</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>賣家操作</th>
            </tr>
          </thead>
          <tbody>
            {returnsList.map(r => {
              const sellerStatus = r.sellerApprovalStatus || 'PendingReview';
              const adminStatus = r.adminApprovalStatus || 'PendingReview';

              const isBothApproved = sellerStatus === 'Approved' && adminStatus === 'Approved';
              const isRejected = sellerStatus === 'Rejected' || adminStatus === 'Rejected';

              return (
                <tr key={r._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E293B' }}>{r.returnNumber}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>原單: {r.orderNumber}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                    {r.customerName}
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

                  {/* 賣家自身狀態 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: sellerStatus === 'Approved' ? '#DCFCE7' : sellerStatus === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                      color: sellerStatus === 'Approved' ? '#15803D' : sellerStatus === 'Rejected' ? '#B91C1C' : '#B45309',
                    }}>
                      {({ Approved: '✅ 賣家已同意', Rejected: '❌ 賣家已拒絕', Pending: '⏳ 待您審核', PendingReview: '⏳ 待您審核' } as Record<string, string>)[sellerStatus] || sellerStatus}
                    </span>
                  </td>

                  {/* 平台管理員狀態 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 20,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: adminStatus === 'Approved' ? '#DCFCE7' : adminStatus === 'Rejected' ? '#FEE2E2' : '#F1F5F9',
                      color: adminStatus === 'Approved' ? '#15803D' : adminStatus === 'Rejected' ? '#B91C1C' : '#64748B',
                    }}>
                      {({ Approved: '✅ 平台已同意', Rejected: '❌ 平台已駁回', Pending: '⏳ 等待平台中', PendingReview: '⏳ 等待平台中' } as Record<string, string>)[adminStatus] || adminStatus}
                    </span>
                  </td>

                  {/* 雙重審核結果 */}
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
                        ⏳ 審核進行中
                      </span>
                    )}
                  </td>

                  {/* 賣家操作按鈕 */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {(sellerStatus === 'Pending' || sellerStatus === 'PendingReview') ? (
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          className="btn-admin btn-admin-primary"
                          onClick={() => handleSellerDecision(r._id, 'Approved')}
                          style={{ padding: '4px 10px', fontSize: 11.5, background: '#10B981', color: 'white', border: 'none', borderRadius: 6 }}
                        >
                          同意
                        </button>
                        <button
                          className="btn-admin btn-admin-outline"
                          onClick={() => handleSellerDecision(r._id, 'Rejected')}
                          style={{ padding: '4px 8px', fontSize: 11.5, color: '#EF4444', borderColor: '#FCA5A5', borderRadius: 6 }}
                        >
                          拒絕
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11.5, color: '#94A3B8' }}>您已完成審核</span>
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
