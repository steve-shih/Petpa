'use client';
import { useState } from 'react';

export default function SystemArchButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(249,115,22,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15) translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(249,115,22,0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(249,115,22,0.5)';
        }}
        title="查看系統架構與功能藍圖"
      >
        🗺️
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, animation: 'fadeIn 0.3s ease-out', padding: '20px' }}>
          <div style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)', padding: '0', borderRadius: '24px', maxWidth: '1100px', width: '100%', maxHeight: '92vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)' }}>
            
            {/* Header */}
            <div style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '24px 32px', borderBottom: '1px solid #E2E8F0', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: '#0F172A', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>🐾 Petpa 系統架構與功能藍圖 (System Blueprint)</h2>
                <p style={{ margin: 0, color: '#64748B', fontSize: '14px', fontWeight: 500 }}>高度解耦的前後端分離架構，完美支援實體貓舍與社群 KOL 的一頁式購物體驗。</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '18px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'}
                onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              {/* Architecture Diagram */}
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '32px', height: '32px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', borderRadius: '8px', textAlign: 'center', lineHeight: '32px' }}>1</span> 
                系統分層架構 (N-Tier Architecture)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {/* Client Layer */}
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#2563EB', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Client 視圖層 (Frontend)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🛍️</div>
                      <div style={{ fontWeight: 700, color: '#1E3A8A' }}>買家端 /shop/:slug</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>免登入選購、購物車、綠界結帳</div>
                    </div>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏪</div>
                      <div style={{ fontWeight: 700, color: '#1E3A8A' }}>賣家端 /seller</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>訂單分潤、上架活體幼貓、推廣工具</div>
                    </div>
                    <div style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>👑</div>
                      <div style={{ fontWeight: 700, color: '#1E3A8A' }}>管理員 /admin</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>商品審核、進銷存庫存、操作審計</div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '24px' }}>⬇️ RESTful API / JSON Payload ⬇️</div>

                {/* Core Engine Layer */}
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px', padding: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#DC2626', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>API Gateway & Core Engines</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '12px' }}>
                    {[
                      { icon: '🔒', title: 'Auth Engine', desc: '買家結帳授權與路由保護' },
                      { icon: '🔗', title: 'Slug Router', desc: '動態品牌網址解析' },
                      { icon: '🏬', title: 'ERP Engine', desc: '進銷存補貨與扣減' },
                      { icon: '🛡️', title: 'Audit Engine', desc: '全站操作安全監控' },
                      { icon: '💳', title: 'Payment Gate', desc: '綠界金流與 ATM 對帳' }
                    ].map(e => (
                      <div key={e.title} style={{ background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '24px' }}>{e.icon}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#991B1B', fontSize: '14px' }}>{e.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{e.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '24px' }}>⬇️ Data R/W ⬇️</div>

                {/* Database Layer */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#16A34A', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>Database Layer (MongoDB)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '12px' }}>
                    {['Catteries DB', 'Products DB', 'Inventory DB', 'Returns DB', 'Audit DB'].map(db => (
                      <div key={db} style={{ background: 'white', padding: '12px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', fontWeight: 700, color: '#166534', fontSize: '13px' }}>
                        💾 {db}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Function Features List */}
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '32px', height: '32px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', borderRadius: '8px', textAlign: 'center', lineHeight: '32px' }}>2</span> 
                系統亮點與細項功能 (Key Features)
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>👨‍💼 管理員專屬功能</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: 1.8 }}>
                    <li><strong>強大 PIM 商品庫：</strong>管理全站商品，設定底價並開放給賣家選品。</li>
                    <li><strong>嚴謹的 ERP 進銷存：</strong>完整紀錄採購、出庫、退貨的庫存流水帳，低庫存自動預警。</li>
                    <li><strong>退貨與售後核准：</strong>一鍵同意買家退貨，並自動將數量補回 ERP 庫存。</li>
                    <li><strong>特權操作審計 (Audit Log)：</strong>紀錄全站所有帳號的 IP、設備與 API 行為軌跡。</li>
                  </ul>
                </div>
                
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <h4 style={{ margin: '0 0 12px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>🏪 合作賣家 (KOL/貓舍) 功能</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: 1.8 }}>
                    <li><strong>一頁式獨立網址：</strong>擁有自己專屬的 `area.petpa.tw/shop/賣家ID`，無競品干擾。</li>
                    <li><strong>自訂定價與標籤：</strong>可在總部底價之上自由加價，並貼上「店長推薦」等專屬標籤。</li>
                    <li><strong>幼貓展示牆 (貓舍專屬)：</strong>展示尋家幼貓、上傳晶片號碼與定型化契約 PDF。</li>
                    <li><strong>即時分潤報表：</strong>登入後台隨時觀看自己的導流業績與階梯分潤獎金進度。</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(16px); }
        }
      `}} />
    </>
  );
}
