'use client';

import { orders } from '@/lib/mock-data';

export default function AdminOrdersPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>📋 訂單管理</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {['全部', '待付款', '已付款', '備貨中', '已發貨', '已完成'].map((label, i) => (
            <button key={label} style={{ padding: '6px 14px', borderRadius: 8, border: i === 0 ? 'none' : '1px solid #d9d9d9', background: i === 0 ? '#1890FF' : 'white', color: i === 0 ? 'white' : '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
      </div>

      <div className="kpi-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>訂單號</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>來源貓舍</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>顧客</th>
              <th style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>訂單金額</th>
              <th style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>賣家分潤</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>狀態</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>下單時間</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12, fontWeight: 500 }}>{order.orderNumber}</td>
                <td style={{ padding: '10px 12px' }}>{order.catteryName}</td>
                <td style={{ padding: '10px 12px' }}>{order.customerName}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>NT$ {order.totalAmount.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#f59e0b', fontWeight: 600 }}>NT$ {order.sellerProfit}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                    background: order.status === 'Completed' ? '#dcfce7' : order.status === 'Shipped' ? '#dbeafe' : order.status === 'Paid' ? '#fef3c7' : order.status === 'Processing' ? '#e0e7ff' : '#f3f4f6',
                    color: order.status === 'Completed' ? '#166534' : order.status === 'Shipped' ? '#1e40af' : order.status === 'Paid' ? '#92400e' : order.status === 'Processing' ? '#3730a3' : '#374151',
                  }}>
                    {{ Completed: '已完成', Shipped: '已發貨', Paid: '已付款', Processing: '備貨中', Pending: '待付款' }[order.status]}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString('zh-TW')}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <button style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', marginRight: 4 }}>詳情</button>
                  {order.status === 'Paid' && (
                    <button style={{ background: '#1890FF', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>出貨</button>
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
