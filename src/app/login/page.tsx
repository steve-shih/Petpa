'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { catteries } from '@/lib/mock-data';
import { envFeatures, isCapabilityReady, capabilityLabel } from '@/lib/env';

// 展示站才預填示範資料；正式站一律空白
const demo = envFeatures.prefillDemoCredentials;
// 正式站：真實登入 / KYC 尚未完成前，登入相關表單全部鎖住
const authReady = isCapabilityReady('realAuth');
const kycReady = isCapabilityReady('sellerKyc');

export default function UnifiedLoginPage() {
  const router = useRouter();

  // 分頁切換：login (登入) | register_buyer (辦理買家會員) | apply_seller (商家申請入駐)
  const [activeTab, setActiveTab] = useState<'login' | 'register_buyer' | 'apply_seller'>('login');

  // 登入表單狀態
  const [email, setEmail] = useState(demo ? 'admin@petpa.tw' : '');
  const [password, setPassword] = useState(demo ? 'admin123' : '');

  // 買家註冊表單狀態
  const [buyerForm, setBuyerForm] = useState(demo ? {
    name: '王小華',
    email: 'hua@example.com',
    password: 'password123',
    phone: '0912-345-678',
    address: '台北市信義區松仁路 100 號 12 樓',
  } : { name: '', email: '', password: '', phone: '', address: '' });

  // 賣家入駐申請表單狀態
  const [sellerApplyForm, setSellerApplyForm] = useState(demo ? {
    catteryName: '皇冠名貓坊',
    sellerType: 'cattery' as 'cattery' | 'influencer',
    licenseNumber: '特寵業字第 D1130666 號',
    contactName: '陳店長',
    email: 'crown@petpa.tw',
    phone: '0988-777-666',
    description: '專育賽級曼赤肯與金漸層英短，申請加入 Petpa 合作賣場。',
  } : {
    catteryName: '',
    sellerType: 'cattery' as 'cattery' | 'influencer',
    licenseNumber: '',
    contactName: '',
    email: '',
    phone: '',
    description: '',
  });

  // 記錄前一個來源賣場 slug
  const [savedSlug, setSavedSlug] = useState('meow-house');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const slug = localStorage.getItem('petpa_cart_slug');
      if (slug) setSavedSlug(slug);
    }
  }, []);

  // 🎯 核心功能：根據輸入帳號自動識別是「管理員」、「賣家」還是「消費者」
  const detectedRole = useMemo<'admin' | 'seller' | 'buyer'>(() => {
    const lower = email.trim().toLowerCase();
    if (!lower) return 'buyer';

    // 1. 管理員規則
    if (lower.startsWith('admin') || lower.startsWith('root') || lower === 'test@petpa.tw') {
      return 'admin';
    }

    // 2. 合作賣家規則 (依據現有貓舍 Email 或關鍵字)
    const isKnownSeller = catteries.some(c => c.loginEmail?.toLowerCase() === lower || c.catteryId === lower || c.slug === lower);
    if (isKnownSeller || lower.includes('cattery') || lower.includes('meow') || lower.includes('golden') || lower.includes('whisker') || lower.includes('starcat') || lower.includes('gold_master') || lower.includes('meixin')) {
      return 'seller';
    }

    // 3. 其餘均為一般買家/消費者
    return 'buyer';
  }, [email]);

  // 快捷帶入示範帳號
  const selectQuickAccount = (type: 'admin' | 'seller' | 'buyer') => {
    if (type === 'admin') {
      setEmail('admin@petpa.tw');
      setPassword('admin123');
    } else if (type === 'seller') {
      setEmail('meow@petpa.tw');
      setPassword('meow8888password');
    } else {
      setEmail('buyer@petpa.tw');
      setPassword('buyer1234');
    }
  };

  // 處理統一登入提交
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 正式站：真實登入尚未完成，禁止使用展示站的 localStorage 假登入
    if (!authReady) {
      alert(`🔒 正式站尚未開放登入：${capabilityLabel('realAuth')} 開發中`);
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('petpa_role', detectedRole);
      localStorage.setItem('petpa_auth_email', email);

      if (detectedRole === 'admin') {
        localStorage.setItem('petpa_admin_name', '平台最高管理員');
        alert('👨‍💼 歡迎管理員登入！即將進入 Petpa 平台管理後台。');
        router.push('/admin/dashboard');
      } else if (detectedRole === 'seller') {
        const matchedCattery = catteries.find(c => c.loginEmail?.toLowerCase() === email.toLowerCase()) || catteries[0];
        localStorage.setItem('petpa_seller_catteryId', matchedCattery.catteryId);
        alert(`🐱 歡迎【${matchedCattery.name}】登入！即將進入賣家控制台。`);
        router.push('/seller/dashboard');
      } else {
        // 消費者/買家登入
        localStorage.setItem('petpa_buyer_user', JSON.stringify({
          name: email.includes('buyer') ? '陳小美' : '會員買家',
          email,
          phone: '0988-123-456',
          address: '台北市信義區忠孝東路五段 100 號 8 樓',
        }));
        alert(`🛍️ 買家會員登入成功！已為您開通各賣場快速下單與追蹤功能。`);
        router.push(`/${savedSlug}`);
      }
    }
  };

  // 處理買家會員快速辦理註冊
  const handleBuyerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authReady) {
      alert(`🔒 正式站尚未開放註冊：${capabilityLabel('realAuth')} 開發中`);
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('petpa_role', 'buyer');
      localStorage.setItem('petpa_auth_email', buyerForm.email);
      localStorage.setItem('petpa_buyer_user', JSON.stringify(buyerForm));
      alert(`🎉 恭喜！買家會員【${buyerForm.name}】辦理成功！\n您現在已具有正式買家身份，可自由在各合作賣家一頁式店鋪直接下單購物。`);
      router.push(`/${savedSlug}`);
    }
  };

  // 處理賣家向管理員申請入駐
  const handleSellerApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycReady) {
      alert(`🔒 正式站尚未開放入駐申請：${capabilityLabel('sellerKyc')} 開發中`);
      return;
    }
    alert(`📨 合作商家申請已送出！\n店家名稱：${sellerApplyForm.catteryName}\n特寵字號：${sellerApplyForm.licenseNumber}\n系統管理員已收到您的入駐提報，審核完成後將為您開通專屬網址與控制台密碼！`);
    setActiveTab('login');
  };

  return (
    <div className="login-bg">
      <div className="login-card" style={{ maxWidth: 480, width: '100%', padding: '32px 28px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-accent))', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: 'var(--shadow-md)', marginBottom: 10 }}>
            🐾
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Petpa 寵物補給站</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            三方角色統一登入 · 會員辦理 · 合作貓舍入駐
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--color-bg)', padding: 4, borderRadius: 'var(--radius-md)', marginBottom: 20, border: '1px solid var(--color-border-light)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'login' ? 'white' : 'transparent',
              color: activeTab === 'login' ? 'var(--color-brand-600)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'login' ? 800 : 600,
              fontSize: 12,
              cursor: 'pointer',
              boxShadow: activeTab === 'login' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            🔑 帳號登入
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register_buyer')}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'register_buyer' ? 'white' : 'transparent',
              color: activeTab === 'register_buyer' ? '#059669' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'register_buyer' ? 800 : 600,
              fontSize: 12,
              cursor: 'pointer',
              boxShadow: activeTab === 'register_buyer' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            🛍️ 辦理買家會員
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apply_seller')}
            style={{
              padding: '8px 4px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'apply_seller' ? 'white' : 'transparent',
              color: activeTab === 'apply_seller' ? '#D97706' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'apply_seller' ? 800 : 600,
              fontSize: 12,
              cursor: 'pointer',
              boxShadow: activeTab === 'apply_seller' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            🐱 賣家申請入駐
          </button>
        </div>

        {/* 正式站：登入尚未完成時的說明 */}
        {!authReady && (
          <div className="prod-lock-notice" style={{ marginBottom: 16 }}>
            🔒 正式站登入功能準備中（{capabilityLabel('realAuth')}）。目前可先以訪客身份瀏覽各合作賣場。
          </div>
        )}

        {/* 1. 統一登入畫面 (自動識別三方身份) */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            {/* 快速示範帶入按鈕：只在展示站顯示 */}
            {envFeatures.oneClickRoleSwitch && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 6 }}>
                ⚡ 測試快捷帶入帳號 (系統將自動識別身份)：
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => selectQuickAccount('admin')}
                  style={{
                    padding: '6px 4px',
                    fontSize: 11,
                    fontWeight: detectedRole === 'admin' ? 800 : 600,
                    borderRadius: 6,
                    border: detectedRole === 'admin' ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                    background: detectedRole === 'admin' ? '#EFF6FF' : 'white',
                    color: detectedRole === 'admin' ? '#1D4ED8' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  👨‍💼 平台管理員
                </button>

                <button
                  type="button"
                  onClick={() => selectQuickAccount('seller')}
                  style={{
                    padding: '6px 4px',
                    fontSize: 11,
                    fontWeight: detectedRole === 'seller' ? 800 : 600,
                    borderRadius: 6,
                    border: detectedRole === 'seller' ? '1.5px solid #F97316' : '1px solid #E2E8F0',
                    background: detectedRole === 'seller' ? '#FFF7ED' : 'white',
                    color: detectedRole === 'seller' ? '#C2410C' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  🐱 合作賣家
                </button>

                <button
                  type="button"
                  onClick={() => selectQuickAccount('buyer')}
                  style={{
                    padding: '6px 4px',
                    fontSize: 11,
                    fontWeight: detectedRole === 'buyer' ? 800 : 600,
                    borderRadius: 6,
                    border: detectedRole === 'buyer' ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                    background: detectedRole === 'buyer' ? '#ECFDF5' : 'white',
                    color: detectedRole === 'buyer' ? '#047857' : '#475569',
                    cursor: 'pointer',
                  }}
                >
                  🛍️ 消費者買家
                </button>
              </div>
            </div>
            )}

            {/* 即時身份識別徽章提醒 */}
            <div style={{
              background: detectedRole === 'admin' ? '#EFF6FF' : detectedRole === 'seller' ? '#FFF7ED' : '#ECFDF5',
              border: `1px solid ${detectedRole === 'admin' ? '#BFDBFE' : detectedRole === 'seller' ? '#FED7AA' : '#A7F3D0'}`,
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 12.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontWeight: 800, color: detectedRole === 'admin' ? '#1E40AF' : detectedRole === 'seller' ? '#C2410C' : '#047857' }}>
                  {detectedRole === 'admin' ? '👨‍💼 目前識別：平台管理員' : detectedRole === 'seller' ? '🐱 目前識別：合作貓舍賣家' : '🛍️ 目前識別：一般消費者買家'}
                </span>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                  {detectedRole === 'admin' ? '登入後進入全站總管理台、控管出貨物流' : detectedRole === 'seller' ? '登入後進入店家專屬封面設置與分潤後台' : '登入後享有各賣家一頁式店鋪自由下單與退貨追蹤'}
                </div>
              </div>
              <span style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 10,
                color: 'white',
                background: detectedRole === 'admin' ? '#2563EB' : detectedRole === 'seller' ? '#EA580C' : '#059669',
                fontWeight: 700,
              }}>
                自動分流
              </span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                帳號或電子郵件 (Email) *
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="請輸入 Email 或帳號"
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
                登入密碼 *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: 14.5,
                borderRadius: 'var(--radius-md)',
                background: detectedRole === 'admin' ? '#2563EB' : detectedRole === 'seller' ? '#EA580C' : '#059669',
              }}
            >
              確認登入 (導向 {detectedRole === 'admin' ? '管理員控制台' : detectedRole === 'seller' ? '賣家後台' : '買家商城'}) →
            </button>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link href={`/${savedSlug}`} style={{ fontSize: 12.5, color: 'var(--color-brand-600)', textDecoration: 'none', fontWeight: 600 }}>
                ← 訪客模式：免登入直接預覽合作貓舍賣場
              </Link>
            </div>
          </form>
        )}

        {/* 2. 辦理買家會員表單 */}
        {activeTab === 'register_buyer' && (
          <form onSubmit={handleBuyerRegister}>
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 12, color: '#047857' }}>
              💡 辦理好買家會員後，即可在所有合作貓舍與 KOL 賣場自由結帳下單，並享有訂單物流追蹤與退貨保障！
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>買家姓名 *</label>
              <input type="text" required value={buyerForm.name} onChange={e => setBuyerForm({ ...buyerForm, name: e.target.value })} className="form-input" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>電子郵件 Email *</label>
              <input type="email" required value={buyerForm.email} onChange={e => setBuyerForm({ ...buyerForm, email: e.target.value })} className="form-input" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>自訂密碼 *</label>
              <input type="password" required value={buyerForm.password} onChange={e => setBuyerForm({ ...buyerForm, password: e.target.value })} className="form-input" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>手機號碼 (收簡訊通知) *</label>
              <input type="tel" required value={buyerForm.phone} onChange={e => setBuyerForm({ ...buyerForm, phone: e.target.value })} className="form-input" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>預設配送地址 *</label>
              <input type="text" required value={buyerForm.address} onChange={e => setBuyerForm({ ...buyerForm, address: e.target.value })} className="form-input" />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14, background: '#059669' }}>
              🎉 立即辦理會員並前往購物
            </button>
          </form>
        )}

        {/* 3. 合作賣家申請入駐表單 */}
        {activeTab === 'apply_seller' && (
          <form onSubmit={handleSellerApply}>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: 10, marginBottom: 14, fontSize: 12, color: '#92400E' }}>
              📝 合作賣家需向平台管理員申請。提交後由管理員審核特寵許可字號，審批通過即發行專屬網址與登入帳號。
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>賣家身份類型 *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <label style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="radio" checked={sellerApplyForm.sellerType === 'cattery'} onChange={() => setSellerApplyForm({ ...sellerApplyForm, sellerType: 'cattery' })} />
                  🐱 實體合作貓舍
                </label>
                <label style={{ fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="radio" checked={sellerApplyForm.sellerType === 'influencer'} onChange={() => setSellerApplyForm({ ...sellerApplyForm, sellerType: 'influencer' })} />
                  📱 社群 KOL 賣家
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>貓舍 / 品牌名稱 *</label>
              <input type="text" required value={sellerApplyForm.catteryName} onChange={e => setSellerApplyForm({ ...sellerApplyForm, catteryName: e.target.value })} className="form-input" />
            </div>

            {sellerApplyForm.sellerType === 'cattery' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>特定寵物業許可證字號 *</label>
                <input type="text" required value={sellerApplyForm.licenseNumber} onChange={e => setSellerApplyForm({ ...sellerApplyForm, licenseNumber: e.target.value })} placeholder="例：特寵業字第 A1130888 號" className="form-input" />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>負責人姓名 *</label>
                <input type="text" required value={sellerApplyForm.contactName} onChange={e => setSellerApplyForm({ ...sellerApplyForm, contactName: e.target.value })} className="form-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>聯絡電話 *</label>
                <input type="tel" required value={sellerApplyForm.phone} onChange={e => setSellerApplyForm({ ...sellerApplyForm, phone: e.target.value })} className="form-input" />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>聯絡 Email (審核通過寄送密碼) *</label>
              <input type="email" required value={sellerApplyForm.email} onChange={e => setSellerApplyForm({ ...sellerApplyForm, email: e.target.value })} className="form-input" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>店家主打品種簡介</label>
              <textarea rows={2} value={sellerApplyForm.description} onChange={e => setSellerApplyForm({ ...sellerApplyForm, description: e.target.value })} className="form-input" />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14, background: '#D97706' }}>
              🚀 提交申請，等待管理員審批
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
