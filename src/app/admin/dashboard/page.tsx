'use client';

import { orders, trendData, profitSplitConfig, products, catteries } from '@/lib/mock-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SystemArchButton from '@/components/SystemArchButton';

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

      {/* Admin Pages Explanation Tour */}
      <div style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderRadius: '16px', padding: '20px', marginBottom: '24px', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          💡 平台管理員 (Admin) 系統操作導覽手冊
        </h2>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px', lineHeight: 1.6 }}>
          歡迎來到 Petpa 管理後台！為了讓您更順暢地操作，以下是左側選單各項功能的簡要說明：
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', lineHeight: 1.6 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 700, color: '#38BDF8', marginBottom: '4px' }}>🐱 賣家與 KOL 管理</div>
            在這裡審核新註冊的實體貓舍與社群網紅 (如：美心)。可核准他們專屬的 /shop/:slug 一頁式賣場，並管理他們的特寵證照與狀態。
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 700, color: '#34D399', marginBottom: '4px' }}>📦 商品管理與審核</div>
            這是平台商品總庫 (PIM)。您可以新增商品、上傳 PDF 檢驗報告，並**指定商品要開放給哪些賣家上架**。賣家自行提報的特殊商品也在這裡審批。
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 700, color: '#FBBF24', marginBottom: '4px' }}>🏬 進銷存 (ERP) 庫存</div>
            最嚴謹的進銷存系統。每一次進貨、買家購買扣庫存、或者退貨補回，都會在這裡留下不可竄改的流水帳，確保庫存帳務精準。
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 700, color: '#F87171', marginBottom: '4px' }}>🔄 售後退貨管理 & 🛡️ 審計日誌</div>
            處理買家的退貨申請，同意後可自動將商品補回 ERP；**審計日誌**則記錄全站所有管理員與賣家的登入、修改、操作軌跡，防範內部風險。
          </div>
        </div>
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
      <SystemArchButton />
    </div>
  );
}

