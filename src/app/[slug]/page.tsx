'use client';

import { useState, useMemo, use, useEffect } from 'react';
import { categories, products, catteries, bannerPresets, kittens, type Product, type Kitten } from '@/lib/mock-data';
import Link from 'next/link';

export default function DedicatedShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedKitten, setSelectedKitten] = useState<Kitten | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [activeModalTab, setActiveModalTab] = useState<'photos' | 'video'>('photos');
  const [dbData, setDbData] = useState<{ cattery?: any; kittens?: Kitten[]; products?: Product[] } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 從 MongoDB Atlas 即時抓取最新資料
  useEffect(() => {
    fetch(`/api/v1/shop/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json?.data) {
          setDbData(json.data);
        }
      })
      .catch(() => {});
  }, [slug]);

  // 根據 URL 比對 slug 或 catteryId，若無則 fallback 第一家
  const cattery = useMemo(() => {
    if (dbData?.cattery) return dbData.cattery;
    return catteries.find(c => c.slug === slug || c.catteryId === slug) || catteries[0];
  }, [slug, dbData]);

  // 如果店家有設定 petliveRoomId 且有開啟 activeWidgets 的 'petlive_stream'，預設顯示
  const [showLiveStream, setShowLiveStream] = useState<boolean>(
    Boolean(cattery.petliveRoomId && cattery.activeWidgets?.includes('petlive_stream'))
  );

  const activePreset = useMemo(() => {
    return bannerPresets.find(p => p.id === cattery.bannerPreset) || bannerPresets[0];
  }, [cattery]);

  const catteryKittens = useMemo(() => {
    if (dbData?.kittens && dbData.kittens.length > 0) return dbData.kittens;
    return kittens.filter(k => k.catteryId === cattery.catteryId);
  }, [cattery, dbData]);

  const filteredProducts = useMemo(() => {
    const prods = (dbData?.products && dbData.products.length > 0) ? dbData.products : products;
    return prods.filter(p => {
      if (!p.isActive) return false;
      // Admin 決定上架商品：若未設定、包含 'all'，或是包含目前貓舍 catteryId/slug 則展示
      const targets = p.targetCatteries;
      const isTargeted = !targets || targets.length === 0 || targets.includes('all') || targets.includes(cattery.catteryId) || targets.includes(cattery.slug);
      if (!isTargeted) return false;

      if (activeCategory === 'all') return true;
      return p.categoryId === activeCategory;
    });
  }, [activeCategory, cattery, dbData]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ product: products.find(p => p._id === id)!, qty }));
  }, [cart]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.sellingPrice * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // 購物車同步儲存至 localStorage，供結帳頁 /checkout 讀取
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cartCount > 0) {
        localStorage.setItem('petpa_cart_items', JSON.stringify(cartItems));
        localStorage.setItem('petpa_cart_total', String(cartTotal));
        localStorage.setItem('petpa_cart_slug', slug);
        localStorage.setItem('petpa_cart_cattery_name', cattery.name);
      }
    }
  }, [cartItems, cartTotal, slug, cattery.name, cartCount]);

  const updateQty = (productId: string, delta: number) => {
    // 若該店家已被停權，禁止加入購物車
    if (cattery.isSuspended) {
      alert('⚠️ 此合作店家目前處於停權處分狀態，暫停前台營業與下單服務！');
      return;
    }

    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });

    if (delta > 0) {
      showToast('🛒 已加入購物車');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="store-bg" style={{ paddingBottom: 110 }}>
      {/* Toast 提示 */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: '#0F172A',
          color: 'white',
          padding: '10px 24px',
          borderRadius: 30,
          fontSize: 13,
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 停權警示橫幅 (若處於停權狀態) */}
      {cattery.isSuspended && (
        <div style={{ background: '#FEF2F2', borderBottom: '2px solid #EF4444', padding: '14px 20px', textAlign: 'center', color: '#991B1B' }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>⚠️ 本合作賣場目前配合平台進行規範審查，暫停營運中</div>
          <div style={{ fontSize: 13, marginTop: 4, color: '#B91C1C' }}>
            <strong>處分原因：</strong>{cattery.suspendedReason || '特定寵物業許可證逾期未補正，暫停營業'}
          </div>
          <div style={{ fontSize: 12, marginTop: 4, color: '#6B7280' }}>
            在此期間暫不提供商品加入購物車與結帳下單。如有售後需求請洽 Petpa 官方客服 (support@petpa.tw)。
          </div>
          <div style={{ marginTop: 10 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#DC2626', color: 'white', border: 'none', padding: '6px 18px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                🏠 返回平台首頁瀏覽其他店家
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Top Brand Notice - 修正網址避免重複 /shop/shop */}
      <div style={{ background: '#0F172A', padding: '8px 16px', color: 'white', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span>🛍️ 歡迎光臨【{cattery.name}】官方合作賣場 — 專屬專址：<code>https://area.petpa.tw/shop/{cattery.slug}</code></span>
      </div>

      {/* Dynamic Cattery Brand Hero Header */}
      <div className="store-hero" style={{
        background: cattery.bannerUrl ? `url(${cattery.bannerUrl}) center/cover no-repeat` : activePreset.gradient,
        color: activePreset.isDark && !cattery.bannerUrl ? 'white' : 'var(--color-text)',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', padding: '14px 24px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: 'var(--shadow-md)', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: activePreset.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              🐱
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-text)' }}>{cattery.name}</h1>
                <span style={{ background: cattery.isSuspended ? '#FEE2E2' : activePreset.badgeBg, color: cattery.isSuspended ? '#DC2626' : activePreset.badgeColor, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>
                  {cattery.isSuspended ? '⛔ 暫停營業' : '認證賣場'}
                </span>
              </div>
              {cattery.licenseNumber && (
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-brand-600)', marginTop: 2 }}>
                  📜 {cattery.licenseNumber}
                </div>
              )}
            </div>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.3px', margin: '4px 0 6px', color: activePreset.isDark && !cattery.bannerUrl ? 'white' : 'var(--color-text)' }}>
            {cattery.name} · 專屬補給與血統幼貓展示
          </h2>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.85, color: activePreset.isDark && !cattery.bannerUrl ? 'rgba(255,255,255,0.85)' : 'var(--color-text-secondary)' }}>
            ✨ 正品保證 · 產地直送 · 特寵許可字號合法登錄
          </p>

          {/* Header Video Banner Ad Component */}
          {cattery.enableVideoAd && cattery.videoUrl && (
            <div style={{ marginTop: 16, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(16px)', borderRadius: 'var(--radius-xl)', padding: 14, color: 'white', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span>{cattery.headerVideoTitle || '🎥 貓舍最新影音導覽'}</span>
              </div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 200, background: '#000', position: 'relative' }}>
                <video src={cattery.videoUrl} controls autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        {/* Category Tabs */}
        <div className="cat-tabs" style={{ padding: '16px 0' }}>
          {cattery.enableKittens && (
            <button
              className={`cat-tab ${activeCategory === 'live_kittens' ? 'active' : ''}`}
              onClick={() => setActiveCategory('live_kittens')}
              style={{
                background: activeCategory === 'live_kittens' ? 'linear-gradient(135deg, #EC4899, #F43F5E)' : 'white',
                borderColor: '#F43F5E',
                color: activeCategory === 'live_kittens' ? 'white' : '#BE123C',
                fontWeight: 700,
              }}
            >
              👑 幼貓尋家/活體專區 ({catteryKittens.length})
            </button>
          )}

          <button
            className={`cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            ✨ 全部用品 ({products.length})
          </button>

          {categories.filter(c => c.isActive).map(cat => (
            <button
              key={cat._id}
              className={`cat-tab ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat._id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Live Kittens Grid View */}
        {activeCategory === 'live_kittens' ? (
          <div>
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20, border: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--color-text)' }}>🐾 貓舍血統幼貓展示牆 (多元樣式特寵專區)</h3>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>依《特定寵物業管理辦法》合法刊登，均植入晶片並含基本疫苗證明與國際登錄血統</p>
              </div>
              <div style={{ background: '#ECFDF5', color: '#047857', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700 }}>
                📜 許可字號：{cattery.licenseNumber}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {catteryKittens.map(kitten => {
                const style = kitten.themeStyle || cattery.kittenCardStyle || 'polaroid';
                const firstImg = (kitten.images && kitten.images[0]) || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800';

                // 樣式 1: 拍立得風格 (Polaroid)
                if (style === 'polaroid') {
                  return (
                    <div 
                      key={kitten._id} 
                      onClick={() => { setSelectedKitten(kitten); setActivePhotoIdx(0); setActiveModalTab('photos'); }}
                      style={{ 
                        background: '#FFFFFF', 
                        padding: '14px 14px 20px', 
                        borderRadius: 8, 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)', 
                        border: '1px solid #E2E8F0', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px) rotate(-0.5deg)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) rotate(0)')}
                    >
                      {/* 紙膠帶貼紙裝飾 */}
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(2deg)', background: 'rgba(254, 240, 138, 0.9)', color: '#854D0E', fontSize: 11, fontWeight: 800, padding: '2px 16px', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 2 }}>
                        📷 拍立得日常實拍
                      </div>

                      <div style={{ height: 230, width: '100%', borderRadius: 4, overflow: 'hidden', position: 'relative', background: '#F1F5F9' }}>
                        <img src={firstImg} alt={kitten.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.65)', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                          📸 {kitten.images?.length || 1} 張寫真
                        </span>
                        <span className={`badge ${kitten.status === 'Available' ? 'badge-hot' : 'badge-discount'}`} style={{ position: 'absolute', top: 8, right: 8, background: kitten.status === 'Available' ? '#10B981' : kitten.status === 'Reserved' ? '#F59E0B' : '#64748B' }}>
                          {{ Available: '✨ 開放尋家', Reserved: '🔒 已受預訂', Sold: '🏠 已回新家' }[kitten.status]}
                        </span>
                      </div>

                      <div style={{ paddingTop: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B', fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
                            {kitten.name}
                          </h3>
                          <span style={{ fontSize: 19, fontWeight: 800, color: '#EA580C', fontFamily: "'Outfit', sans-serif" }}>
                            NT$ {kitten.price.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          <span style={{ background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 4, fontSize: 11.5, fontWeight: 700 }}>{kitten.breed}</span>
                          <span style={{ background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: 4, fontSize: 11.5 }}>{kitten.gender}孩</span>
                          <span style={{ background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: 4, fontSize: 11.5 }}>🎂 {kitten.birthday}</span>
                        </div>
                        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>晶片: {kitten.microchipNumber}</span>
                          <span style={{ fontSize: 12, color: '#F97316', fontWeight: 800 }}>點開看寫真牆 →</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 樣式 2: 賽級尊榮金卡風格 (Pedigree)
                if (style === 'pedigree') {
                  return (
                    <div 
                      key={kitten._id} 
                      onClick={() => { setSelectedKitten(kitten); setActivePhotoIdx(0); setActiveModalTab('photos'); }}
                      style={{ 
                        background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)', 
                        padding: 16, 
                        borderRadius: 16, 
                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)', 
                        border: '2px solid #F59E0B', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        color: 'white',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#FCD34D', display: 'flex', alignItems: 'center', gap: 4 }}>
                          👑 CFA 賽級名門血統
                        </span>
                        <span style={{ background: '#F59E0B', color: '#000', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                          {{ Available: '開放預定', Reserved: '已被預訂', Sold: '已交付' }[kitten.status]}
                        </span>
                      </div>

                      <div style={{ height: 210, width: '100%', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                        <img src={firstImg} alt={kitten.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(15,23,42,0.9))', padding: '8px 12px' }}>
                          <div style={{ fontSize: 12, color: '#FCD34D' }}>父系：{kitten.fatherName || '國際登錄純血種公'}</div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#F8FAFC' }}>{kitten.name}</h3>
                          <span style={{ fontSize: 20, fontWeight: 800, color: '#F59E0B', fontFamily: "'Outfit', sans-serif" }}>
                            NT$ {kitten.price.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          <span style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{kitten.breed}</span>
                          <span style={{ background: 'rgba(255,255,255,0.1)', color: '#E2E8F0', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{kitten.gender}孩</span>
                          <span style={{ background: 'rgba(255,255,255,0.1)', color: '#E2E8F0', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{kitten.dewormed ? '🛡️ 完成全套驅蟲' : ''}</span>
                        </div>
                        <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>晶片號碼: {kitten.microchipNumber}</span>
                          <span style={{ fontSize: 12, color: '#FCD34D', fontWeight: 800 }}>查驗血統證照 →</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 樣式 3: 影片膠捲動態風 (Reel)
                if (style === 'reel') {
                  return (
                    <div 
                      key={kitten._id} 
                      onClick={() => { setSelectedKitten(kitten); setActivePhotoIdx(0); setActiveModalTab(kitten.videoUrl ? 'video' : 'photos'); }}
                      style={{ 
                        background: '#18181B', 
                        padding: '14px 16px', 
                        borderRadius: 12, 
                        border: '2px dashed #52525B', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease',
                        color: 'white',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 11, color: '#A1A1AA', fontFamily: 'monospace' }}>
                        <span>🎞️ REEL 35MM [REC]</span>
                        <span style={{ color: '#EF4444' }}>● LIVE MOTION</span>
                      </div>

                      <div style={{ height: 210, width: '100%', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <img src={firstImg} alt={kitten.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                          ▶️
                        </div>
                        <span style={{ position: 'absolute', bottom: 8, right: 8, background: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800 }}>
                          🎬 包含短片展示
                        </span>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#FAFAFA' }}>{kitten.name}</h3>
                          <span style={{ fontSize: 19, fontWeight: 800, color: '#38BDF8', fontFamily: "'Outfit', sans-serif" }}>
                            NT$ {kitten.price.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          <span style={{ background: '#27272A', color: '#E4E4E7', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{kitten.breed}</span>
                          <span style={{ background: '#27272A', color: '#E4E4E7', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>{kitten.gender}孩</span>
                        </div>
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#38BDF8' }}>
                          <span>晶片: {kitten.microchipNumber}</span>
                          <span style={{ fontWeight: 800 }}>播放動態膠捲 ➔</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 樣式 4: 粉彩馬卡龍萌系 (Macaron)
                return (
                  <div 
                    key={kitten._id} 
                    onClick={() => { setSelectedKitten(kitten); setActivePhotoIdx(0); setActiveModalTab('photos'); }}
                    style={{ 
                      background: 'linear-gradient(135deg, #FFF1F2 0%, #F5F3FF 50%, #ECFDF5 100%)', 
                      padding: 16, 
                      borderRadius: 24, 
                      border: '2px solid #FBCFE8', 
                      boxShadow: '0 10px 25px rgba(244,114,182,0.15)', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ background: '#FCE7F3', color: '#DB2777', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                        🧁 甜心馬卡龍萌寵
                      </span>
                      <span style={{ background: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                        {{ Available: '✨ 開放尋家', Reserved: '🔒 已受預訂', Sold: '🏠 已回新家' }[kitten.status]}
                      </span>
                    </div>

                    <div style={{ height: 210, width: '100%', borderRadius: 16, overflow: 'hidden', position: 'relative', border: '3px solid white' }}>
                      <img src={firstImg} alt={kitten.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(255,255,255,0.9)', color: '#DB2777', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 800 }}>
                        💖 點擊看多圖牆
                      </span>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#831843' }}>{kitten.name}</h3>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#EC4899', fontFamily: "'Outfit', sans-serif" }}>
                          NT$ {kitten.price.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                        <span style={{ background: '#FDF2F8', color: '#BE185D', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{kitten.breed}</span>
                        <span style={{ background: '#F3E8FF', color: '#7E22CE', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{kitten.gender}孩</span>
                        <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>🎂 {kitten.birthday}</span>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>晶片: {kitten.microchipNumber}</span>
                        <span style={{ fontSize: 12, color: '#DB2777', fontWeight: 800 }}>查看詳細身世 ➔</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Products Grid View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                catteryId={cattery.catteryId}
                qty={cart[product._id] || 0}
                onUpdate={(d) => updateQty(product._id, d)}
                isSuspended={Boolean(cattery.isSuspended)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && !cattery.isSuspended && (
        <div className="floating-cart-bar" style={{ padding: '0 16px' }}>
          <div className="floating-cart-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(249,115,22,0.2)', color: 'var(--color-brand-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                🛒
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>已選 {cartCount} 件商品</div>
                <div style={{ fontSize: 19, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#FFF' }}>NT$ {cartTotal.toLocaleString()}</div>
              </div>
            </div>
            {/* 修正：Link href 導向 /checkout，Next.js 會自動帶入 basePath /shop */}
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <button className="cart-btn">
                前往結帳 →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Kitten Detail Modal (互動相簿照片牆 + 短片展示) */}
      {selectedKitten && (
        <div className="modal-overlay" onClick={() => setSelectedKitten(null)}>
          <div className="modal-content" style={{ width: '100%', maxWidth: 640, maxHeight: '92vh', overflowY: 'auto', padding: 0, borderRadius: 20 }} onClick={e => e.stopPropagation()}>
            
            {/* Modal 頂部 Tab：相片牆 vs 動態短片 */}
            <div style={{ background: '#0F172A', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => setActiveModalTab('photos')} 
                  style={{ 
                    background: activeModalTab === 'photos' ? '#F97316' : 'rgba(255,255,255,0.1)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 20, 
                    padding: '6px 14px', 
                    fontSize: 12, 
                    fontWeight: 700, 
                    cursor: 'pointer' 
                  }}
                >
                  📸 高清寫真牆 ({selectedKitten.images?.length || 1} 張)
                </button>
                {selectedKitten.videoUrl && (
                  <button 
                    onClick={() => setActiveModalTab('video')} 
                    style={{ 
                      background: activeModalTab === 'video' ? '#EF4444' : 'rgba(255,255,255,0.1)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: 20, 
                      padding: '6px 14px', 
                      fontSize: 12, 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    🎬 萌貓動態短片
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectedKitten(null)} 
                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* 媒體檢視區 */}
            {activeModalTab === 'photos' ? (
              <div style={{ background: '#020617', padding: '10px 0', textAlign: 'center' }}>
                <div style={{ height: 320, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={(selectedKitten.images && selectedKitten.images[activePhotoIdx]) || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'} 
                    alt={selectedKitten.name} 
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                  />
                  {selectedKitten.images && selectedKitten.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : selectedKitten.images.length - 1))}
                        style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer' }}
                      >
                        ◀
                      </button>
                      <button 
                        onClick={() => setActivePhotoIdx(prev => (prev < selectedKitten.images.length - 1 ? prev + 1 : 0))}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer' }}
                      >
                        ▶
                      </button>
                    </>
                  )}
                  <span style={{ position: 'absolute', bottom: 10, right: 14, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>
                    {activePhotoIdx + 1} / {selectedKitten.images?.length || 1}
                  </span>
                </div>

                {/* 縮圖列 (Thumbnail Bar) */}
                {selectedKitten.images && selectedKitten.images.length > 1 && (
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '10px 16px', overflowX: 'auto' }}>
                    {selectedKitten.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setActivePhotoIdx(idx)}
                        style={{ 
                          width: 54, 
                          height: 54, 
                          borderRadius: 6, 
                          overflow: 'hidden', 
                          cursor: 'pointer', 
                          border: activePhotoIdx === idx ? '2px solid #F97316' : '2px solid transparent',
                          opacity: activePhotoIdx === idx ? 1 : 0.6,
                          flexShrink: 0,
                        }}
                      >
                        <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* 動態短片播放器 */
              <div style={{ background: '#000', padding: 10, textAlign: 'center' }}>
                <video 
                  src={selectedKitten.videoUrl} 
                  controls 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{ width: '100%', maxHeight: 340, borderRadius: 8 }} 
                />
              </div>
            )}

            {/* 幼貓詳細資訊 */}
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>{selectedKitten.name}</h2>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                    所屬貓舍：<strong>{cattery.name}</strong> · 特寵字號：{cattery.licenseNumber}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>
                    NT$ {selectedKitten.price.toLocaleString()}
                  </div>
                  <span className={`badge ${selectedKitten.status === 'Available' ? 'badge-hot' : 'badge-discount'}`} style={{ background: selectedKitten.status === 'Available' ? '#10B981' : '#F59E0B' }}>
                    {{ Available: '✨ 開放尋找新家', Reserved: '🔒 已受預訂', Sold: '🏠 已回新家' }[selectedKitten.status]}
                  </span>
                </div>
              </div>

              {/* 個性標籤 (Traits) */}
              {selectedKitten.traits && selectedKitten.traits.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>🌟 貓咪個性與特徵：</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {selectedKitten.traits.map((t, idx) => (
                      <span key={idx} style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 賽級與血統認證 (Awards) */}
              {selectedKitten.awards && selectedKitten.awards.length > 0 && (
                <div style={{ background: 'linear-gradient(135deg, #FEFCE8, #FFFBEB)', border: '1px solid #FDE68A', borderRadius: 12, padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#B45309', marginBottom: 6 }}>🏆 國際賽事與基因篩檢認證：</div>
                  {selectedKitten.awards.map((a, idx) => (
                    <div key={idx} style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.6 }}>
                      • {a}
                    </div>
                  ))}
                </div>
              )}

              {/* 身世與血統檔案 */}
              <div style={{ background: 'var(--color-bg)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid var(--color-border-light)', fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><strong>品種：</strong>{selectedKitten.breed}</div>
                  <div><strong>性別：</strong>{selectedKitten.gender}孩</div>
                  <div><strong>出生日期：</strong>{selectedKitten.birthday}</div>
                  <div><strong>體內外驅蟲：</strong>{selectedKitten.dewormed ? '已完成全套驅蟲' : '安排中'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>施打疫苗：</strong>{selectedKitten.vaccines.join('、')}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>父親名門：</strong>{selectedKitten.fatherName || '國際登錄純種種公'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>母親純血：</strong>{selectedKitten.motherName || '純血登錄種母'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>晶片號碼：</strong><code style={{ background: '#E2E8F0', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>{selectedKitten.microchipNumber}</code></div>
                </div>
              </div>

              {/* PDF 法定契約 */}
              {selectedKitten.pdfUrl && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: '#1E40AF' }}>📄 法定買賣定型化契約書與健康保證書</div>
                    <div style={{ fontSize: 11.5, color: '#3B82F6', marginTop: 2 }}>依政府規定提供消費者審閱條款</div>
                  </div>
                  <a href={selectedKitten.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <button className="btn-admin btn-admin-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
                      👁️ 預覽契約 PDF
                    </button>
                  </a>
                </div>
              )}

              <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.6, marginBottom: 20 }}>
                {selectedKitten.description}
              </p>

              {/* 操作按鈕 */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href={`tel:${cattery.contactPhone || '0912345678'}`} style={{ flex: 1, minWidth: 140, textDecoration: 'none' }}>
                  <button className="btn-admin btn-admin-outline" style={{ width: '100%', padding: 12, fontSize: 14 }}>
                    📞 電話諮詢貓舍
                  </button>
                </a>
                <button 
                  className="btn-primary" 
                  onClick={() => alert(`已為您發送【${selectedKitten.name}】預約賞貓需求給${cattery.name}！貓舍將透過電話 ${cattery.contactPhone || '0912-345-678'} 與您聯絡。`)} 
                  style={{ flex: 1, minWidth: 140, padding: 12, fontSize: 14 }}
                >
                  💬 預約看貓與預定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating PETLIVE Widget */}
      {showLiveStream && (
        <div style={{ position: 'fixed', bottom: cartCount > 0 ? 110 : 20, right: 20, zIndex: 999, width: 280, background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '2px solid #8B5CF6' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#EF4444', borderRadius: '50%', boxShadow: '0 0 8px #EF4444' }}></span>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: 0.5 }}>PETLIVE 即時直播</span>
            </div>
            <button onClick={() => setShowLiveStream(false)} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', width: 22, height: 22, borderRadius: '50%', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
          {/* Player Box (Actual iframe to petlive viewer) */}
          <div style={{ width: '100%', height: 380, background: '#000', position: 'relative' }}>
            {cattery.petliveRoomId ? (
              <iframe 
                src={`https://live.petpa.tw/live/${cattery.petliveRoomId}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="camera; microphone; fullscreen"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>💤</div>
                <div style={{ fontSize: 12 }}>目前無直播</div>
              </div>
            )}
          </div>
          {/* Action */}
          <div style={{ padding: 8, background: '#1E293B', textAlign: 'center' }}>
            <a
              href={`https://live.petpa.tw/live/${cattery.petliveRoomId || 'demo-room'}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none', color: '#A78BFA', fontSize: 11, fontWeight: 700, display: 'block' }}
            >
              進入 PETLIVE 原站互動直播間 →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, catteryId, qty, onUpdate, isSuspended }: { product: Product; catteryId?: string; qty: number; onUpdate: (d: number) => void; isSuspended?: boolean }) {
  const sellerConfig = catteryId && product.sellerConfigs ? product.sellerConfigs[catteryId] : undefined;

  // 1. 標籤優先級：賣家自訂標籤 (customBadge) > 管理員預設推薦標籤
  const badgeText = sellerConfig?.customBadge || (product.isRecommended ? '🔥 店長推薦' : undefined);

  // 2. 售價與劃線打折原價：賣家客製售價 (若高於底價) > 管理員預設底價
  const effectivePrice = sellerConfig?.customPrice || product.sellingPrice;
  const effectiveOriginalPrice = sellerConfig?.customOriginalPrice || product.originalPrice;

  // 3. 折扣幅度計算
  const discount = Math.round((1 - effectivePrice / effectiveOriginalPrice) * 100);

  return (
    <div className="product-card" style={{ opacity: isSuspended ? 0.7 : 1 }}>
      <div className="card-img" style={{
        background: product.categoryId === 'cat_food' ? 'linear-gradient(135deg, #FEF3C7, #FDE68A)' : product.categoryId === 'cat_litter' ? 'linear-gradient(135deg, #E0F2FE, #BAE6FD)' : product.categoryId === 'cleaning' ? 'linear-gradient(135deg, #F0FDF4, #BBF7D0)' : product.categoryId === 'supplement' ? 'linear-gradient(135deg, #FDF2F8, #FBCFE8)' : 'linear-gradient(135deg, #FFF7ED, #FED7AA)',
      }}>
        {categories.find(c => c._id === product.categoryId)?.icon || '📦'}
        {badgeText && (
          <span className="badge badge-hot" style={{ background: sellerConfig?.customBadge ? '#8B5CF6' : undefined }}>{badgeText}</span>
        )}
        {discount > 0 && (
          <span className="badge badge-discount">-{discount}%</span>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">
          {product.title}
        </h3>

        <div className="card-specs">
          {product.specifications.map((spec, idx) => (
            <span key={idx} className="spec-tag">{spec.name}: {spec.value}</span>
          ))}
        </div>

        {/* 📄 PDF 文件檢視按鈕區 */}
        {product.pdfUrl && (
          <div style={{ marginTop: 6, marginBottom: 4 }}>
            <a href={product.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: 6, fontSize: 11, color: '#1D4ED8', fontWeight: 700 }}>
              📄 檢視PDF文件/檢驗報告
            </a>
          </div>
        )}

        <div className="card-price">
          <span className="price-current">NT${effectivePrice}</span>
          <span className="price-original">NT${effectiveOriginalPrice}</span>
        </div>

        <div className="card-footer">
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>庫存 {product.stock}</span>
          {isSuspended ? (
            <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 700 }}>賣場停權中</span>
          ) : qty === 0 ? (
            <button className="btn-add" onClick={() => onUpdate(1)}>
              + 加入購物車
            </button>
          ) : (
            <div className="qty-box">
              <button onClick={() => onUpdate(-1)}>−</button>
              <span>{qty}</span>
              <button onClick={() => onUpdate(1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
