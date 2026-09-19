'use client';

import { orders } from '@/lib/mock-data';

export default function SellerOrdersPage() {
  const myOrders = orders.filter(o => o.catteryId === 'meow_house');

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📋 導流訂單明細</h1>
      <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>僅顯示透過您的推廣頁面完成的訂單及您的推廣分潤所得。</p>
      <div className="kpi-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>訂單號</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>顧客</th>
              <th style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>訂單售價</th>
              <th style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>我的推廣分潤</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>狀態</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>日期</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12 }}>{order.orderNumber}</td>
                <td style={{ padding: '10px 12px' }}>{order.customerName}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>NT$ {order.totalAmount.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#f59e0b' }}>NT$ {order.sellerProfit}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    background: order.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                    color: order.status === 'Completed' ? '#166534' : '#92400e',
                  }}>
                    {{ Completed: '已完成', Shipped: '已發貨', Paid: '已付款', Processing: '備貨中', Pending: '待付款' }[order.status]}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString('zh-TW')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>
        ℹ️ 僅顯示售價與您的分潤金額，不公開商品成本與其他方利潤（商業機密）。
      </div>
    </div>
  );
}
