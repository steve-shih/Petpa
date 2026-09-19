'use client';

import Link from 'next/link';
import { useState } from 'react';
import { adminBankAccount } from '@/lib/mock-data';

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 買家登入狀態 (買家檢視/加入購物車免登入，實際購買強制登入)
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [buyerAccount, setBuyerAccount] = useState({ name: '陳小美', phone: '0988-123-456', email: 'may@example.com', address: '台北市信義區忠孝東路五段 100 號 8 樓' });
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [isPaid, setIsPaid] = useState(false);

  const handleQuickBuyerLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setForm(buyerAccount); // 自動帶入會員收件資料
  };

  const handleCreateOrder = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!form.name || !form.phone || !form.address) {
      alert('⚠️ 請填寫完整收件人姓名、電話與配送地址！');
      return;
    }
    setIsPaid(true);
  };

  if (isPaid) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 40, textAlign: 'center', maxWidth: 440, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border-light)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16 }}>
            ✓
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 8px' }}>訂單下單成功！</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 20px' }}>訂單編號：#ORD-2026-9082<br />已傳送確認通知至買家 {form.name} ({form.phone})</p>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '12px 24px', fontSize: 14 }}>
              返回貓舍商城
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '24px 16px 40px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--color-brand-600)', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          ← 返回貓舍商城
        </Link>

        {/* 買家身份狀態標籤與登入提示 */}
        <div style={{ background: isLoggedIn ? '#ECFDF5' : '#FEF3C7', border: `1px solid ${isLoggedIn ? '#A7F3D0' : '#FDE68A'}`, borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ fontSize: 13, color: isLoggedIn ? '#047857' : '#D97706', fontWeight: 700 }}>
            {isLoggedIn ? `👤 買家已登入：${buyerAccount.name} (${buyerAccount.email})` : '🔒 提示：您目前為訪客模式，實際下單結帳須登入買家帳號'}
          </div>
          {!isLoggedIn ? (
            <button className="btn-primary" onClick={() => setShowLoginModal(true)} style={{ padding: '6px 14px', fontSize: 12 }}>
              🔑 買家登入
            </button>
          ) : (
            <span style={{ fontSize: 11, background: '#10B981', color: 'white', padding: '2px 8px', borderRadius: 10 }}>已授權</span>
          )}
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: 'var(--color-text)' }}>🛒 買家結帳確認</h1>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 16, border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📦</span> 收件人資料
          </h2>
          {(['name', 'phone', 'email', 'address'] as const).map(field => (
            <div key={field} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                {{ name: '收件人姓名 *', phone: '手機號碼 *', email: '電子郵件', address: '收件地址 *' }[field]}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={{ name: '請輸入真實姓名', phone: '0912345678', email: 'user@example.com', address: '請輸入完整配送地址' }[field]}
                className="form-input"
              />
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 16, border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💳</span> 付款方式 (第三方金流串接)
          </h2>
          {[
            { name: '信用卡 (Visa / Master / JCB)', status: '綠界金流實體環境 (原型展示區灰色停用)', disabled: true },
            { name: 'LINE Pay 一鍵付款', status: '沙盒測試環境 (原型展示區灰色停用)', disabled: true },
            { name: '超商代碼 / 條碼繳費', status: '藍新金流環境 (原型展示區灰色停用)', disabled: true },
            { name: 'ATM 銀行匯款 (管理員指定對帳戶頭)', status: `匯至 ${adminBankAccount.bankName} (${adminBankAccount.accountNumber})`, disabled: false, isAtm: true },
            { name: '模擬快速即時下單 (Prototype Live)', status: '開放測試下單體驗', disabled: false },
          ].map((item, i) => (
            <div key={item.name} style={{ borderBottom: i < 4 ? '1px solid var(--color-border-light)' : 'none', padding: '10px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: item.disabled ? 'not-allowed' : 'pointer', opacity: item.disabled ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="radio" name="payment" defaultChecked={item.isAtm} disabled={item.disabled} style={{ accentColor: 'var(--color-brand-500)', width: 16, height: 16 }} />
                  <span style={{ fontSize: 13.5, fontWeight: item.disabled ? 500 : 700, color: item.disabled ? 'var(--color-text-muted)' : 'var(--color-text)' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 11, background: item.disabled ? '#E2E8F0' : '#DCFCE7', color: item.disabled ? '#64748B' : '#15803D', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
                  {item.status}
                </span>
              </label>

              {item.isAtm && (
                <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: 12, marginTop: 10, fontSize: 12.5, lineHeight: 1.6 }}>
                  <div>🏛️ <strong>指定匯款銀行：</strong>{adminBankAccount.bankName} ({adminBankAccount.branchName})</div>
                  <div>💳 <strong>指定轉帳帳號：</strong><code style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF' }}>{adminBankAccount.accountNumber}</code></div>
                  <div>👤 <strong>戶名抬頭：</strong>{adminBankAccount.accountName}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>💡 下單完成後，請於 3 日內完成匯款，系統對帳完畢將自動安排寄送。</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 20, border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span> 訂單金額明細
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
            <span>商品金額小計</span><span>NT$ 1,260</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
            <span>運費小計</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>免運費</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 14, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>實付總金額</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>NT$ 1,260</span>
          </div>
        </div>

        <button className="btn-primary" onClick={handleCreateOrder} style={{ width: '100%', padding: '16px', fontSize: 16, borderRadius: 'var(--radius-lg)' }}>
          {isLoggedIn ? '確認付款下單 NT$ 1,260' : '🔒 登入買家帳號並進行下單 (NT$ 1,260)'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 14 }}>
          ⚠️ 買家可自由瀏覽賣場與加入購物車，實際結帳需進行授權登入驗證。
        </p>
      </div>

      {/* 買家強制/快速登入 Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔑</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text)' }}>買家會員登入 verification</h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>
              依據交易保障規範，實際結帳前請先登入或驗證買家身份。
            </p>

            <button className="btn-primary" onClick={handleQuickBuyerLogin} style={{ width: '100%', padding: 14, fontSize: 14, marginBottom: 10 }}>
              ⚡ 一鍵測試買家快速登入 ({buyerAccount.name})
            </button>

            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-admin btn-admin-outline" style={{ width: '100%', padding: 12, fontSize: 13.5 }}>
                使用 Email / 密碼至標準登入頁 →
              </button>
            </Link>

            <button onClick={() => setShowLoginModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 12, marginTop: 14, cursor: 'pointer', textDecoration: 'underline' }}>
              暫時返回賣場繼續逛逛
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

