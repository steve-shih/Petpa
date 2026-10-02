'use client';

import Link from 'next/link';
import { catteries } from '@/lib/mock-data';
import { useState } from 'react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)', color: 'white', fontFamily: 'Outfit, "Noto Sans TC", sans-serif' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, background: 'linear-gradient(135deg, #F97316, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🐾 Petpa 寵物補給站
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          專為合作貓舍、社群網紅打造的高奢一頁式品牌購物平台。<br />
          提供獨立帳號、進銷存管理、退貨審核與全站審計日誌。
        </p>
      </div>

      {/* Guide Section */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '40px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>📖</span> 系統操作與體驗指南
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
            {/* Admin Guide */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👑</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#FBBF24' }}>平台總管理員 (Admin)</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                管理全站商品資料庫、審核合作貓舍、處理買家退貨並進行進銷存(ERP)補貨。<br />擁有全站操作軌跡 (Audit Log) 最高權限與財務對帳功能。
              </p>
            </div>

            {/* Seller Guide */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏪</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#34D399' }}>合作賣家 / 貓舍 (Seller)</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                擁有專屬推廣網址，可自訂賣場標籤與特殊售價。管理幼貓活體狀態、上傳定型化契約 PDF，並能隨時追蹤自己賣場產生的分潤訂單與業績。
              </p>
            </div>

            {/* Buyer Guide */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🛍️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#60A5FA' }}>消費者 / 買家 (Buyer)</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                透過網紅或貓舍的推廣連結進入專屬賣場。免登入即可瀏覽並加入購物車，結帳時進行登入授權並完成下單。可查看商品詳情與檢驗證書。
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40, textAlign: 'center' }}>
            🚀 開始體驗 (Role Portals)
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
            
            {/* Account Info Box */}
            <div style={{ padding: '20px 24px', background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, marginBottom: 10 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: '#FBBF24' }}>🔑 預設測試帳號清單</h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                <li><strong>平台管理員 (Admin)</strong>: <code>admin@petpa.tw</code> / 密碼 <code>admin123</code></li>
                <li><strong>網紅賣家 (Seller)</strong>: <code>cat-master@petpa.tw</code> / 密碼 <code>seller123</code></li>
              </ul>
            </div>

            {/* Unified Login Button */}
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', background: 'linear-gradient(135deg, #F97316, #FBBF24)', border: 'none', borderRadius: 16, transition: 'all 0.2s', cursor: 'pointer', color: 'white', fontWeight: 800, fontSize: 18, boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }} className="portal-card">
                前往系統統一登入入口 →
              </div>
            </Link>

            {/* Buyer Portal */}
            <div style={{ padding: '20px 24px', background: 'linear-gradient(90deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, marginTop: 10 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#60A5FA', margin: '0 0 12px' }}>買家賣場入口 (Buyer / Shop)</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 12px' }}>消費者不需要預先登入，請選擇下方任一合作店家的專屬賣場進行體驗：</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {catteries.filter(c => c.isApproved).map(c => (
                  <Link key={c.catteryId} href={`/shop/${c.slug || c.catteryId}`} style={{ textDecoration: 'none' }}>
                    <button style={{ background: 'rgba(59,130,246,0.2)', color: '#93C5FD', border: '1px solid rgba(59,130,246,0.3)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} className="shop-btn">
                      {c.name}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .portal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          background: rgba(255,255,255,0.08) !important;
        }
        .shop-btn:hover {
          background: rgba(59,130,246,0.4) !important;
          color: white !important;
        }
      `}} />
    </div>
  );
}
