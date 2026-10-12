'use client';

import { orders } from '@/lib/mock-data';

export default function SellerOrdersPage() {
  const myOrders = orders.filter(o => o.catteryId === 'meow_house');

  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>
          📋 導流訂單與物流追蹤明細
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
          掌握前台專屬賣場推廣訂單之總倉物流配送狀態（待出貨、路上、到貨）與您的分潤收益
        </p>
      </div>

      <div className="kpi-card" style={{ padding: 0, overflowX: 'auto', borderRadius: 16 }}>
        <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>訂單號</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>收件顧客</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>訂單售價</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#D97706' }}>我的推廣分潤</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>總倉物流進度</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>黑貓追蹤單號</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>下單日期</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map(order => {
              const lStatus = order.logisticsStatus || (order.status === 'Completed' ? 'Completed' : order.status === 'Shipped' ? 'InTransit' : 'PendingShipment');

              const statusBadge = {
                PendingShipment: { bg: '#FEF3C7', color: '#B45309', label: '⏳ 待總倉打包' },
                InTransit: { bg: '#EDE9FE', color: '#6D28D9', label: '🚚 路上 (黑貓專車)' },
                Delivered: { bg: '#E0F2FE', color: '#0369A1', label: '📦 到貨 (買家已簽收)' },
                Completed: { bg: '#DCFCE7', color: '#15803D', label: '✅ 訂單結算完成' },
              }[lStatus] || { bg: '#F1F5F9', color: '#475569', label: lStatus };

              return (
                <tr key={order._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#1E293B' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{order.customerName}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                    NT$ {order.totalAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#D97706', fontFamily: "'Outfit', sans-serif" }}>
                    NT$ {order.sellerProfit.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ background: statusBadge.bg, color: statusBadge.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 800 }}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>
                    {order.trackingNumber ? (
                      <code style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: 4, fontWeight: 700, color: '#1E40AF' }}>
                        {order.trackingNumber}
                      </code>
                    ) : (
                      <span style={{ color: '#94A3B8' }}>總倉備貨中</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>
                    {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>ℹ️</span> 平台總倉負責實體物流出貨與黑貓物流簽收，訂單狀態為「已完成」後，分潤將自動結轉至您的提現帳戶。
      </div>
    </div>
  );
}
