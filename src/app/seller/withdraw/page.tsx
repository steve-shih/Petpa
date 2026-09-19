'use client';

export default function SellerWithdrawPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>💳 提現申請</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div className="kpi-card" style={{ marginBottom: 16, borderLeft: '4px solid #10b981' }}>
            <div className="kpi-label">✅ 可提領餘額</div>
            <div className="kpi-value" style={{ color: '#10b981', fontSize: 36 }}>NT$ 715</div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>最低提領金額：NT$ 1,000</div>
          </div>

          <div className="kpi-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🏦 銀行帳戶資訊</h3>
            {[
              { label: '銀行代碼', value: '822（中國信託）' },
              { label: '戶名', value: '喵喵萌寵有限公司' },
              { label: '帳號', value: '****-****-****-1234' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ color: '#9ca3af' }}>{item.label}</span>
                <span style={{ fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
            <button style={{ marginTop: 12, padding: '6px 16px', border: '1px solid #d9d9d9', borderRadius: 8, background: 'white', fontSize: 13, cursor: 'pointer' }}>✏️ 修改帳戶</button>
          </div>

          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📝 申請提現</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#6b7280' }}>提現金額 (NT$)</label>
              <input type="number" placeholder="1000" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 16 }} />
            </div>
            <button style={{ width: '100%', padding: 12, background: '#d9d9d9', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'not-allowed' }}>
              餘額不足 NT$ 1,000，暫時無法提現
            </button>
          </div>
        </div>

        <div>
          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>📜 提現歷史紀錄</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#9ca3af', fontWeight: 500 }}>日期</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#9ca3af', fontWeight: 500 }}>金額</th>
                  <th style={{ padding: '8px', textAlign: 'center', color: '#9ca3af', fontWeight: 500 }}>狀態</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#9ca3af', fontWeight: 500 }}>交易序號</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 8px' }}>2026/08/20</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600 }}>NT$ 3,200</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#dcfce7', color: '#166534' }}>已匯款</span>
                  </td>
                  <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>TXN-20260820-0031</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 8px' }}>2026/07/15</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 600 }}>NT$ 2,800</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#dcfce7', color: '#166534' }}>已匯款</span>
                  </td>
                  <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: 11, color: '#9ca3af' }}>TXN-20260715-0028</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
