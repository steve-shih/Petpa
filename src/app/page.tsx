'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FlashyLandingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAdminFlow, setShowAdminFlow] = useState(false);
  const [showBuyerFlow, setShowBuyerFlow] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const authRole = localStorage.getItem('petpa_role');
    if (authRole) {
      setUserRole(authRole);
    }
  }, []);

  const handleCTA = () => {
    if (userRole === 'admin') router.push('/admin/dashboard');
    else if (userRole === 'seller') router.push('/seller/dashboard');
    else router.push('/login');
  };

  if (!isMounted) return <div style={{ background: '#0F172A', minHeight: '100vh' }} />;

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', color: 'white', fontFamily: 'Outfit, "Noto Sans TC", sans-serif', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(20px)', position: 'fixed', width: '100%', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 24, fontWeight: 900, background: 'linear-gradient(135deg, #F97316, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          PETPA
        </div>
        <div>
          <button onClick={handleCTA} className="login-btn-nav" style={{ background: 'white', color: '#0F172A', padding: '8px 24px', borderRadius: 30, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'all 0.3s' }}>
            {userRole ? '進入控制台 →' : '商家登入 / 申請開通'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ position: 'relative', paddingTop: 160, paddingBottom: 100, textAlign: 'center', overflow: 'hidden' }}>
        {/* Glow Effects */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 500, height: 500, background: '#F97316', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, background: '#8B5CF6', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)', color: '#FBBF24', fontWeight: 700, fontSize: 14, marginBottom: 24, letterSpacing: 1 }}>
            ✨ 全台首創 · 貓舍專屬分潤電商
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
            讓您的流量變現<br/>
            <span style={{ background: 'linear-gradient(135deg, #F97316, #F43F5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              0 成本開啟自動化營收
            </span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.8 }}>
            專為優質貓舍與 KOL 打造。無需進貨、包裝、寄件。只要一個專屬網址，商品自動帶入，粉絲下單，您每月輕鬆領取高額現金分潤。
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleCTA} style={{ background: 'linear-gradient(135deg, #F97316, #FBBF24)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: 40, fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(249,115,22,0.3)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}>
              🚀 {userRole ? '立即前往管理後台' : '立即免費開通專屬賣場'}
            </button>
            <a href="#features" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '16px 40px', borderRadius: 40, fontSize: 18, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s' }}>
                了解分潤模式 ↓
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ background: '#1E293B', padding: '100px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>為什麼選擇 Petpa？</h2>
            <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>打造被動收入，我們幫您處理最繁瑣的電商物流環節</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}>
            <FeatureCard 
              icon="💰" 
              title="最高 15% 階梯式分潤" 
              desc="獨家分潤機制！每月結算無延遲，推廣越多，抽成比例越高，利潤清晰透明。"
              color="#F59E0B"
            />
            <FeatureCard 
              icon="📦" 
              title="零庫存，全自動發貨" 
              desc="由 Petpa 總倉直接出貨！粉絲在您的賣場下單後，理貨、包裝、客訴我們一手包辦。"
              color="#10B981"
            />
            <FeatureCard 
              icon="🎥" 
              title="PETLIVE 直播帶貨連動" 
              desc="內建無縫串接 PETLIVE 直播系統！邊播邊賣，商品浮水印一鍵跳出，下單轉換率提升 300%。"
              color="#8B5CF6"
            />
            <FeatureCard 
              icon="🐱" 
              title="幼貓活體展示牆" 
              desc="合規特寵字號！賣場內不僅能賣罐頭，還能展示您貓舍待預定的血統幼貓與合約。"
              color="#F43F5E"
            />
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '80px 20px', textAlign: 'center', background: 'linear-gradient(0deg, rgba(249,115,22,0.1), transparent)' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 24 }}>準備好開始變現了嗎？</h2>
        <p style={{ color: '#94A3B8', fontSize: 18, marginBottom: 40 }}>3 分鐘內完成開站，立即獲取您的專屬導購網址</p>
        <button onClick={handleCTA} style={{ background: 'white', color: '#0F172A', border: 'none', padding: '18px 48px', borderRadius: 40, fontSize: 20, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,255,255,0.1)', transition: 'transform 0.2s' }}>
          {userRole ? '回到我的儀表板' : '立即登入 / 註冊'}
        </button>
      </div>

      {/* Floating Buttons & Panels for Flow Explanations */}
      {/* Left: Admin Flow */}
      <div style={{ position: 'fixed', left: 0, top: '40%', zIndex: 1000, transform: 'translateY(-50%)' }}>
        <button 
          onClick={() => setShowAdminFlow(true)} 
          style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', border: 'none', padding: '16px 12px', borderTopRightRadius: 16, borderBottomRightRadius: 16, cursor: 'pointer', boxShadow: '5px 5px 20px rgba(37,99,235,0.3)', writingMode: 'vertical-lr', letterSpacing: 4, fontWeight: 800, fontSize: 14, transition: 'transform 0.2s' }}
        >
          👨‍💼 平台管理員操作流程說明
        </button>
      </div>

      {/* Right: Buyer Flow */}
      <div style={{ position: 'fixed', right: 0, top: '40%', zIndex: 1000, transform: 'translateY(-50%)' }}>
        <button 
          onClick={() => setShowBuyerFlow(true)} 
          style={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', padding: '16px 12px', borderTopLeftRadius: 16, borderBottomLeftRadius: 16, cursor: 'pointer', boxShadow: '-5px 5px 20px rgba(16,185,129,0.3)', writingMode: 'vertical-rl', letterSpacing: 4, fontWeight: 800, fontSize: 14, transition: 'transform 0.2s' }}
        >
          🛒 一般買家購物流程說明
        </button>
      </div>

      {/* Admin Flow Modal */}
      {showAdminFlow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1E293B', borderRadius: 24, padding: 40, maxWidth: 600, width: '100%', position: 'relative', border: '1px solid #3B82F6', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setShowAdminFlow(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: 10 }}>
              👨‍💼 平台管理員 (Admin) 操作流程
            </h2>
            <div style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>身為 PETPA 的平台總管，您掌握全站商品定價權與審核大權：</p>
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: 16, borderRadius: 12, borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ color: 'white' }}>Step 1. 審核店家入駐</strong><br/>
                前往 <code>/admin/dashboard</code> 的「賣家管理」，審查貓舍提交的特寵字號，核准後對方才能獲得專屬 <code>/shop/xxx</code> 網址。
              </div>
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: 16, borderRadius: 12, borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ color: 'white' }}>Step 2. 審批賣家自訂價格</strong><br/>
                賣家可以在自己的後台申請「調降售價」(例如原價 500 降到 450)。您會在左側菜單「📬 訊息與審批」中收到通知，點擊「核准」後，該賣場的商品價格才會真正變更（資料直接寫入 MongoDB）。
              </div>
              <div style={{ background: 'rgba(59,130,246,0.1)', padding: 16, borderRadius: 12, borderLeft: '4px solid #3B82F6' }}>
                <strong style={{ color: 'white' }}>Step 3. 處理進銷存與分潤結算</strong><br/>
                您負責總倉出貨，透過 ERP 紀錄庫存增減，月底根據設定好的分潤比例（如 10% 平台、15% 賣家、75% 供應商）直接一鍵產出報表並匯款至賣家銀行帳戶。
              </div>
            </div>
            <button onClick={() => { setShowAdminFlow(false); router.push('/login'); }} style={{ marginTop: 30, background: '#3B82F6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, width: '100%', cursor: 'pointer' }}>
              進入管理員登入頁面
            </button>
          </div>
        </div>
      )}

      {/* Buyer Flow Modal */}
      {showBuyerFlow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1E293B', borderRadius: 24, padding: 40, maxWidth: 600, width: '100%', position: 'relative', border: '1px solid #10B981', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setShowBuyerFlow(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20, color: '#34D399', display: 'flex', alignItems: 'center', gap: 10 }}>
              🛒 買家/粉絲 (Buyer) 購物體驗流程
            </h2>
            <div style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p>買家不需要註冊繁瑣的帳號，即可享受最順暢的結帳與觀看體驗：</p>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: 16, borderRadius: 12, borderLeft: '4px solid #10B981' }}>
                <strong style={{ color: 'white' }}>Step 1. 進入貓舍專屬網址</strong><br/>
                買家透過 KOL 或貓舍的 IG 連結點入 <code>/shop/meixin</code>，會看到賣家精心佈置的專屬橫幅與主題色，並享有該賣家專屬的折扣價。
              </div>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: 16, borderRadius: 12, borderLeft: '4px solid #10B981' }}>
                <strong style={{ color: 'white' }}>Step 2. 邊看直播邊購物</strong><br/>
                若賣家正在 PETLIVE 開播，畫面右下角會自動浮現直播視窗！買家可以一邊看直播主介紹主食罐，一邊將商品點擊加入浮動購物車。
              </div>
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: 16, borderRadius: 12, borderLeft: '4px solid #10B981' }}>
                <strong style={{ color: 'white' }}>Step 3. 選購血統幼貓與一頁式結帳</strong><br/>
                除了用品，買家還能點選「幼貓展示牆」，查看幼貓血統證明與合約 PDF。決定後進入結帳頁面，填寫寄送資料，支援 ATM 轉帳與多種金流，訂單成立後即刻由總倉安排出貨！
              </div>
            </div>
            <button onClick={() => { setShowBuyerFlow(false); router.push('/meow-house'); }} style={{ marginTop: 30, background: '#10B981', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, width: '100%', cursor: 'pointer' }}>
              進入示範賣場體驗購物
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .login-btn-nav:hover {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: string, title: string, desc: string, color: string }) {
  return (
    <div className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24 }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: 'white' }}>{title}</h3>
      <p style={{ color: '#94A3B8', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}
