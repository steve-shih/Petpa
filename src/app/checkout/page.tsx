'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { adminBankAccount } from '@/lib/mock-data';

export default function CheckoutPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 買家登入狀態
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [buyerAccount] = useState({ name: '陳小美', phone: '0988-123-456', email: 'may@example.com', address: '台北市信義區忠孝東路五段 100 號 8 樓' });
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [isPaid, setIsPaid] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [savedSlug, setSavedSlug] = useState('meow-house');
  const [savedCatteryName, setSavedCatteryName] = useState('喵喵萌寵專業貓舍');
  const [paymentMethod, setPaymentMethod] = useState('ATM 銀行匯款 (管理員指定對帳戶頭)');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('petpa_cart_items');
      const savedTotal = localStorage.getItem('petpa_cart_total');
      const slug = localStorage.getItem('petpa_cart_slug');
      const catteryName = localStorage.getItem('petpa_cart_cattery_name');
      
      if (savedItems) {
        try { setCartItems(JSON.parse(savedItems)); } catch (e) {}
      }
      if (savedTotal) {
        setCartTotal(Number(savedTotal));
      }
      if (slug) {
        setSavedSlug(slug);
      }
      if (catteryName) {
        setSavedCatteryName(catteryName);
      }
    }
  }, []);

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

    const generatedOrderId = `#ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedOrderId);

    // ATM 轉帳及一般流暢下單流程
    if (typeof window !== 'undefined') {
      // 儲存新建立之訂單記錄供買賣雙方查看
      const newOrder = {
        _id: `ord_${Date.now()}`,
        orderNumber: generatedOrderId,
        catteryId: savedSlug.replace(/-/g, '_'),
        buyerName: form.name,
        buyerPhone: form.phone,
        buyerAddress: form.address,
        totalAmount: cartTotal,
        paymentMethod: paymentMethod,
        logisticsStatus: 'PendingShipment',
        logisticsProvider: '黑貓宅急便 (常溫/低溫專車)',
        createdAt: new Date().toISOString(),
      };
      
      const existingOrdersStr = localStorage.getItem('petpa_buyer_orders');
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      existingOrders.unshift(newOrder);
      localStorage.setItem('petpa_buyer_orders', JSON.stringify(existingOrders));

      // 清除購物車
      localStorage.removeItem('petpa_cart_items');
      localStorage.removeItem('petpa_cart_total');
    }
    setIsPaid(true);
  };

  if (isProcessingPayment) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 40, textAlign: 'center', maxWidth: 440, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border-light)' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>💳</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 8px' }}>
            綠界金流 (ECPay) 3D 驗證中...
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 20px' }}>
            正在與發卡銀行進行安全授權連線，請勿關閉視窗...
          </p>
          <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #E2E8F0', borderTop: '3px solid var(--color-brand-500)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 40, textAlign: 'center', maxWidth: 440, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-danger)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 16 }}>
            ✕
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 8px' }}>連線授權失敗</h1>
          <p style={{ fontSize: 14, color: 'var(--color-danger)', margin: '0 0 20px', fontWeight: 600 }}>{paymentError}</p>
          <button className="btn-admin btn-admin-outline" onClick={() => setPaymentError('')} style={{ width: '100%', padding: '12px 24px', fontSize: 14 }}>
            返回選擇其他付款方式 (如 ATM 匯款)
          </button>
        </div>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: '36px 30px', textAlign: 'center', maxWidth: 480, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--color-border-light)' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, marginBottom: 16 }}>
            ✓
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 6px' }}>訂單下單成功！</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>
            訂單編號：<strong style={{ color: '#0F172A' }}>{orderId || '#ORD-2026-9082'}</strong><br />
            已發送訂單確認簡訊與 Email 至買家 {form.name} ({form.phone})
          </p>

          {/* 訂單明細摘要 */}
          <div style={{ background: '#F8FAFC', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20, textAlign: 'left', fontSize: 12.5, lineHeight: 1.6, border: '1px solid #E2E8F0' }}>
            <div>🏠 <strong>來源賣場：</strong>{savedCatteryName}</div>
            <div>💳 <strong>付款方式：</strong>{paymentMethod.split(' ')[0]}</div>
            <div>📍 <strong>配送地址：</strong>{form.address}</div>
            <div>💰 <strong>實付總額：</strong><strong style={{ color: '#E11D48', fontSize: 14 }}>NT$ {cartTotal.toLocaleString()}</strong></div>
            {paymentMethod.includes('ATM') && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #CBD5E1', color: '#1E40AF', fontSize: 12 }}>
                🏛️ 請匯款至：{adminBankAccount.bankName} 帳號 <code>{adminBankAccount.accountNumber}</code>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* 修正：使用 Next.js Link 連結回專屬賣場，避免產生 /shop/shop */}
            <Link href={`/${savedSlug}`} style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: '100%', padding: '12px 24px', fontSize: 14 }}>
                返回【{savedCatteryName}】賣場繼續逛逛
              </button>
            </Link>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-admin btn-admin-outline" style={{ width: '100%', padding: '10px 24px', fontSize: 13 }}>
                返回 Petpa 平台首頁
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 購物車為空時之友善提示
  if (cartItems.length === 0 && cartTotal === 0) {
    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 40, textAlign: 'center', maxWidth: 440, boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border-light)' }}>
          <div style={{ fontSize: 50, marginBottom: 12 }}>🛒</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: 'var(--color-text)' }}>您的購物車目前是空的</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 24px' }}>
            尚未在【{savedCatteryName}】選購商品，請返回賣場將喜愛的寵物用品加入購物車！
          </p>
          <Link href={`/${savedSlug}`} style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '12px 24px', fontSize: 14 }}>
              前往【{savedCatteryName}】挑選商品 →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '24px 16px 40px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* 修正：使用 Next.js Link 連結回 /slug 避免 /shop/shop */}
        <Link href={`/${savedSlug}`} style={{ color: 'var(--color-brand-600)', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          ← 返回【{savedCatteryName}】專屬賣場
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

        {/* 收件人資料 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 16, border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📦</span> 收件人配送資料
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

        {/* 付款方式選擇 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 16, border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>💳</span> 付款方式 (第三方金流串接)
          </h2>
          {[
            { name: 'ATM 銀行匯款 (管理員指定對帳戶頭)', status: '✅ 正常可用 (支援自動對帳發貨)', disabled: false, isAtm: true },
            { name: '信用卡 Visa / Master (線上即時授權)', status: '🔒 暫時灰色未開放 (尚未開發)', disabled: true },
            { name: '綠界金流 ECPay (多元支付閘道)', status: '🔒 暫時灰色未開放 (尚未開發)', disabled: true },
            { name: 'LINE Pay 行動支付', status: '🔒 暫時灰色未開放 (尚未開發)', disabled: true },
          ].map((item, i) => (
            <div key={item.name} style={{ borderBottom: i < 3 ? '1px solid var(--color-border-light)' : 'none', padding: '12px 0', background: item.disabled ? 'rgba(241, 245, 249, 0.5)' : 'transparent', borderRadius: item.disabled ? 'var(--radius-sm)' : 0, paddingLeft: item.disabled ? 8 : 0, paddingRight: item.disabled ? 8 : 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: item.disabled ? 'not-allowed' : 'pointer', opacity: item.disabled ? 0.55 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === item.name} 
                    onChange={() => !item.disabled && setPaymentMethod(item.name)}
                    disabled={item.disabled} 
                    style={{ accentColor: 'var(--color-brand-500)', width: 16, height: 16 }} 
                  />
                  <span style={{ fontSize: 13.5, fontWeight: item.disabled ? 500 : 700, color: item.disabled ? '#94A3B8' : 'var(--color-text)' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 11, background: item.disabled ? '#E2E8F0' : '#DCFCE7', color: item.disabled ? '#64748B' : '#15803D', padding: '3px 9px', borderRadius: 10, fontWeight: 700, border: item.disabled ? '1px solid #CBD5E1' : 'none' }}>
                  {item.status}
                </span>
              </label>

              {item.isAtm && paymentMethod === item.name && (
                <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: 12, marginTop: 10, fontSize: 12.5, lineHeight: 1.6 }}>
                  <div>🏛️ <strong>指定匯款銀行：</strong>{adminBankAccount.bankName} ({adminBankAccount.branchName})</div>
                  <div>💳 <strong>指定轉帳帳號：</strong><code style={{ fontSize: 13, fontWeight: 800, color: '#1E40AF' }}>{adminBankAccount.accountNumber}</code></div>
                  <div>👤 <strong>戶名抬頭：</strong>{adminBankAccount.accountName}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>💡 下單完成後，請於 3 日內完成匯款，系統對帳完畢將由總倉即刻安排發貨。</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 訂單明細 */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 20, border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span> 訂單金額明細
          </h2>
          {cartItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--color-text)' }}>
              <span>{item.product?.title || '嚴選寵物商品'} x {item.qty}</span>
              <span>NT$ {((item.product?.sellingPrice || 0) * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, marginTop: 12, color: 'var(--color-text-secondary)' }}>
            <span>商品金額小計</span><span>NT$ {cartTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
            <span>運費小計</span><span style={{ color: 'var(--color-success)', fontWeight: 600 }}>免運費 (平台全額補貼)</span>
          </div>
          <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 14, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>實付總金額</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>NT$ {cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <button className="btn-primary" onClick={handleCreateOrder} style={{ width: '100%', padding: '16px', fontSize: 16, borderRadius: 'var(--radius-lg)' }}>
          {isLoggedIn ? `確認下單支付 NT$ ${cartTotal.toLocaleString()} (${paymentMethod.split(' ')[0]})` : `🔒 登入買家帳號並進行下單 (NT$ ${cartTotal.toLocaleString()})`}
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
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text)' }}>買家會員驗證登入</h2>
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
