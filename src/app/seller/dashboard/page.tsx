'use client';

import { orders, trendData } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SellerDashboard() {
  const myOrders = orders.filter(o => o.catteryId === 'meow_house');
  const totalProfit = myOrders.reduce((s, o) => s + o.sellerProfit, 0);
  const completedProfit = myOrders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.sellerProfit, 0);
  const repeatBuyers = 3;
  const monthTarget = 50000;
  const monthSales = myOrders.reduce((s, o) => s + o.totalAmount, 0);
  const tierProgress = Math.min(100, Math.round(monthSales / monthTarget * 100));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>📊 我的分潤總覽</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>即時追蹤推廣導流成效、分潤累積與階梯獎勵達成度</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-brand-500)' }}>
          <div className="kpi-label">💰 本月預估分潤</div>
          <div className="kpi-value" style={{ color: 'var(--color-brand-600)' }}>NT$ {totalProfit.toLocaleString()}</div>
          <div className="kpi-trend">↑ 18.2% vs 上月</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="kpi-label">✅ 可提領餘額</div>
          <div className="kpi-value" style={{ color: 'var(--color-success)' }}>NT$ {completedProfit.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>已完成訂單即時入帳</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-info)' }}>
          <div className="kpi-label">📦 導流訂單數</div>
          <div className="kpi-value" style={{ color: 'var(--color-info)' }}>{myOrders.length} 筆</div>
          <div className="kpi-trend">本月累計成功導流</div>
        </div>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <div className="kpi-label">🔄 回購顧客數</div>
          <div className="kpi-value" style={{ color: 'var(--color-accent)' }}>{repeatBuyers} 人</div>
          <div className="kpi-trend">回購率 42.8%</div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="kpi-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>📈 階梯分潤獎勵進度</h3>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>月導流金額：NT$ {monthSales.toLocaleString()} / NT$ {monthTarget.toLocaleString()}</span>
        </div>
        <div style={{ height: 20, background: 'var(--color-border-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ height: '100%', width: `${tierProgress}%`, background: 'linear-gradient(90deg, var(--color-brand-400), var(--color-brand-600))', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10 }}>
            <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>{tierProgress}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span style={{ color: 'var(--color-brand-600)', fontWeight: 700 }}>當前分潤級別：10%</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>再導流 NT$ {(monthTarget - monthSales).toLocaleString()} 即升級至 <strong style={{ color: 'var(--color-danger)' }}>15% 分潤</strong></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Sales Trend */}
        <div className="kpi-card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>📈 近 30 天分潤趨勢</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData.map(d => ({ ...d, myProfit: Math.round(d.sales * 0.06) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip />
              <Line type="monotone" dataKey="myProfit" stroke="var(--color-brand-500)" strokeWidth={2.5} name="我的分潤" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="kpi-card" style={{ overflow: 'hidden' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>📋 最近導流訂單</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>訂單號</th>
                <th>顧客</th>
                <th style={{ textAlign: 'right' }}>售價</th>
                <th style={{ textAlign: 'right' }}>我的分潤</th>
                <th style={{ textAlign: 'center' }}>狀態</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600 }}>{order.orderNumber.slice(-8)}</td>
                  <td style={{ fontWeight: 500 }}>{order.customerName}</td>
                  <td style={{ textAlign: 'right' }}>NT${order.totalAmount.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-brand-600)' }}>NT${order.sellerProfit}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {{ Completed: '已完成', Shipped: '已發貨', Paid: '已付款', Processing: '備貨中', Pending: '待付款' }[order.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion Tools */}
      <div className="kpi-card" style={{ marginTop: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--color-text)' }}>🔗 賣家專屬推廣工具包</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center', background: 'var(--color-bg)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📲</div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>專屬 QR Code</h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>印製實體貼紙貼於貓舍現場</p>
            <button className="btn-admin btn-admin-primary" style={{ width: '100%', fontSize: 12 }}>下載高清 QR Code</button>
          </div>
          <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center', background: 'var(--color-bg)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔗</div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>專屬推廣連結</h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>社群媒體 / LINE 貼文直接分享</p>
            <button className="btn-admin btn-admin-outline" style={{ width: '100%', fontSize: 12 }}>一鍵複製連結</button>
          </div>
          <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'center', background: 'var(--color-bg)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>FB / IG 圖文製作</h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>符合 FB (1:1) 及 IG Post 規範尺寸</p>
            <button className="btn-admin btn-admin-outline" style={{ width: '100%', fontSize: 12 }}>製作社群圖片</button>
          </div>
        </div>
      </div>
    </div>
  );
}

