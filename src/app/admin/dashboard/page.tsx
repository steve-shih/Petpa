'use client';

import { orders, trendData, profitSplitConfig, products, catteries } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const totalSales = orders.reduce((s, o) => s + o.totalAmount, 0);
  const totalNetProfit = Math.round(totalSales * 0.45);
  const platformFee = Math.round(totalNetProfit * profitSplitConfig.platformRate / 100);
  const sellerPayout = Math.round(totalNetProfit * profitSplitConfig.sellerRate / 100);
  const operatorProfit = totalNetProfit - platformFee - sellerPayout;
  const estTax = Math.round(totalSales * 0.05);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>📊 營運數據總覽 Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>即時全站銷售額、三方分潤算式與營業稅估算統計</p>
      </div>

      {/* KPI Cards Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-brand-500)' }}>
          <div className="kpi-label">💰 全站總銷售額</div>
          <div className="kpi-value" style={{ color: 'var(--color-brand-600)' }}>NT$ {totalSales.toLocaleString()}</div>
          <div className="kpi-trend">↑ 12.5% vs 上月</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="kpi-label">👨‍💼 管理員淨利潤 ({profitSplitConfig.operatorRate}%)</div>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>NT$ {operatorProfit.toLocaleString()}</div>
          <div className="kpi-trend">扣除平台費與賣家分潤後</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-info)' }}>
          <div className="kpi-label">🏢 平台系統抽成 ({profitSplitConfig.platformRate}%)</div>
          <div className="kpi-value" style={{ color: 'var(--color-info)' }}>NT$ {platformFee.toLocaleString()}</div>
          <div className="kpi-trend">支付給平台開發運營</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div className="kpi-label">🐱 賣家分潤支出 ({profitSplitConfig.sellerRate}%)</div>
          <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>NT$ {sellerPayout.toLocaleString()}</div>
          <div className="kpi-trend">支付給合作宣傳貓舍</div>
        </div>
      </div>

      {/* Second Row KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card">
          <div className="kpi-label">📦 總訂單數</div>
          <div className="kpi-value">{orders.length} 筆</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">🐱 審核通過貓舍</div>
          <div className="kpi-value">{catteries.filter(c => c.isApproved).length} 家</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">📦 上架商品總數</div>
          <div className="kpi-value">{products.filter(p => p.isActive).length} 項</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">📝 估算營業稅 *(5% 參考)*</div>
          <div className="kpi-value" style={{ color: 'var(--color-text-secondary)' }}>NT$ {estTax.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>⚠️ 稅務相關數字僅供估算參考</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="kpi-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>📈 近 30 天銷售與利潤趨勢</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="var(--color-info)" strokeWidth={2.5} name="銷售額" dot={false} />
            <Line type="monotone" dataKey="profit" stroke="var(--color-success)" strokeWidth={2.5} name="淨利潤" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="kpi-card" style={{ overflow: 'hidden' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>📋 最近全站訂單</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>訂單號</th>
              <th>來源貓舍</th>
              <th>顧客</th>
              <th style={{ textAlign: 'right' }}>金額</th>
              <th style={{ textAlign: 'center' }}>狀態</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{order.orderNumber}</td>
                <td style={{ fontWeight: 500 }}>{order.catteryName}</td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{order.customerName}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>NT$ {order.totalAmount.toLocaleString()}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status === 'Completed' ? '已完成' : order.status === 'Shipped' ? '已發貨' : order.status === 'Paid' ? '已付款' : order.status === 'Processing' ? '備貨中' : '待付款'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

