'use client';

export default function SellerQRCodePage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📲 推廣 QR Code</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="kpi-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>您的專屬推廣 QR Code</h3>
          <div style={{ width: 200, height: 200, margin: '0 auto 16px', background: '#f9fafb', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e5e7eb' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>📲</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>QR Code 預覽</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
            推廣連結：<code style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>https://shop.petpa/?c=meow_house</code>
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button style={{ padding: '8px 20px', background: '#1890FF', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📥 下載 QR Code PNG</button>
            <button style={{ padding: '8px 20px', background: '#52c41a', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📋 複製連結</button>
          </div>
        </div>
        <div className="kpi-card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🎴 嫁妝卡模板</h3>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>🐾 Petpa 寵物補給站</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>喵喵萌寵專業貓舍 · 專屬推薦</div>
            </div>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, margin: '0 auto 12px', background: '#f9fafb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📲</div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>掃碼即可購買貓咪日常用品</p>
              <p style={{ fontSize: 12, color: '#9ca3af' }}>飼料 · 貓砂 · 保健品 · 凍乾零食</p>
            </div>
          </div>
          <button style={{ width: '100%', padding: '8px 0', background: '#722ed1', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>📥 下載嫁妝卡 PDF</button>
        </div>
      </div>
    </div>
  );
}
