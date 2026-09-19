'use client';

import { useState, useMemo, use } from 'react';
import { categories, products, catteries, bannerPresets, kittens, type Product, type Kitten } from '@/lib/mock-data';
import Link from 'next/link';

export default function DedicatedShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedKitten, setSelectedKitten] = useState<Kitten | null>(null);

  // 根據 URL 比對 slug 或 fallback
  const cattery = useMemo(() => {
    return catteries.find(c => c.slug === slug || c.catteryId === slug) || catteries[0];
  }, [slug]);

  const activePreset = useMemo(() => {
    return bannerPresets.find(p => p.id === cattery.bannerPreset) || bannerPresets[0];
  }, [cattery]);

  const catteryKittens = useMemo(() => {
    return kittens.filter(k => k.catteryId === cattery.catteryId);
  }, [cattery]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isActive) return false;
      // Admin 決定上架商品：若未設定、包含 'all'，或是包含目前貓舍 catteryId/slug 則展示
      const targets = p.targetCatteries;
      const isTargeted = !targets || targets.length === 0 || targets.includes('all') || targets.includes(cattery.catteryId) || targets.includes(cattery.slug);
      if (!isTargeted) return false;

      if (activeCategory === 'all') return true;
      return p.categoryId === activeCategory;
    });
  }, [activeCategory, cattery]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ product: products.find(p => p._id === id)!, qty }));
  }, [cart]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.sellingPrice * item.qty, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  return (
    <div className="store-bg" style={{ paddingBottom: 110 }}>
      {/* Top Brand Notice */}
      <div style={{ background: '#0F172A', padding: '8px 16px', color: 'white', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span>🛍️ 歡迎光臨【{cattery.name}】官方合作賣場 — 專屬專址：<code>https://petpa.tw/shop/{cattery.slug}</code></span>
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
                <span style={{ background: activePreset.badgeBg, color: activePreset.badgeColor, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>認證貓舍</span>
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
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--color-text)' }}>🐾 貓舍血統幼貓展示牆</h3>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)' }}>依《特定寵物業管理辦法》合法刊登，均植入晶片並含基本疫苗證明</p>
              </div>
              <div style={{ background: '#ECFDF5', color: '#047857', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700 }}>
                📜 許可字號：{cattery.licenseNumber}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {catteryKittens.map(kitten => (
                <div key={kitten._id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedKitten(kitten)}>
                  <div className="card-img" style={{ height: 200, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}>
                    🐱
                    <span className={`badge ${kitten.status === 'Available' ? 'badge-hot' : 'badge-discount'}`} style={{ background: kitten.status === 'Available' ? 'var(--color-success)' : kitten.status === 'Reserved' ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                      {{ Available: '✨ 待預定 (開放尋家)', Reserved: '🔒 已受預訂', Sold: '🏠 已找到新家' }[kitten.status]}
                    </span>
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h3 className="card-title" style={{ minHeight: 'auto', fontSize: 16, fontWeight: 800 }}>{kitten.name}</h3>
                      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>NT$ {kitten.price.toLocaleString()}</span>
                    </div>

                    <div className="card-specs" style={{ marginTop: 8 }}>
                      <span className="spec-tag">{kitten.breed}</span>
                      <span className="spec-tag">{kitten.gender}孩</span>
                      <span className="spec-tag">🎂 {kitten.birthday} 生</span>
                    </div>

                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '10px 0 0', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {kitten.description}
                    </p>

                    <button className="btn-primary" style={{ width: '100%', padding: '8px 0', fontSize: 13, marginTop: 12 }}>
                      🔍 查看貓咪詳細資訊與血統 →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} catteryId={cattery.catteryId} qty={cart[product._id] || 0} onUpdate={(d) => updateQty(product._id, d)} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
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
            <Link href="/checkout" style={{ textDecoration: 'none' }}>
              <button className="cart-btn">
                前往結帳 →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Kitten Detail Modal */}
      {selectedKitten && (
        <div className="modal-overlay" onClick={() => setSelectedKitten(null)}>
          <div className="modal-content" style={{ width: '100%', maxWidth: 540, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: 220, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, position: 'relative' }}>
              🐱
              <button onClick={() => setSelectedKitten(null)} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              <span className={`status-badge status-${selectedKitten.status === 'Available' ? 'completed' : 'paid'}`} style={{ position: 'absolute', bottom: 14, left: 14, fontSize: 13, padding: '4px 12px' }}>
                {{ Available: '✨ 待預定 (開放尋家)', Reserved: '🔒 已受預訂', Sold: '🏠 已找到新家' }[selectedKitten.status]}
              </span>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--color-text)' }}>{selectedKitten.name}</h2>
                <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>NT$ {selectedKitten.price.toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                <span className="spec-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{selectedKitten.breed}</span>
                <span className="spec-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{selectedKitten.gender}孩</span>
                <span className="spec-tag" style={{ fontSize: 12, padding: '4px 10px', background: '#FEF3C7', color: '#D97706' }}>🎂 生日：{selectedKitten.birthday}</span>
              </div>

              <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 16, border: '1px solid var(--color-border-light)', fontSize: 13, lineHeight: 1.7 }}>
                <div><strong>父親血統：</strong>{selectedKitten.fatherName}</div>
                <div><strong>母親血統：</strong>{selectedKitten.motherName}</div>
                <div><strong>晶片號碼：</strong><code style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: 4 }}>{selectedKitten.microchipNumber}</code></div>
                <div><strong>健康狀態：</strong>{selectedKitten.dewormed ? '已完成體內外驅蟲' : '未驅蟲'} · 疫苗：{selectedKitten.vaccines.join('、')}</div>
                <div><strong>出版字號：</strong>{cattery.licenseNumber}</div>
              </div>

              {/* PDF 文件與合約檢視區 */}
              {selectedKitten.pdfUrl && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1E40AF', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    📄 法定合約與權益文件 (PDF 檔)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#1E3A8A', fontWeight: 600 }}>{selectedKitten.pdfTitle || '寵物買賣定型化契約書.pdf'}</span>
                    <a href={selectedKitten.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                      <button className="btn-admin btn-admin-primary" style={{ padding: '4px 12px', fontSize: 11.5 }}>
                        👁️ 預覽/下載 PDF
                      </button>
                    </a>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                {selectedKitten.description}
              </p>

              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`tel:${cattery.contactPhone || '0912345678'}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn-admin btn-admin-outline" style={{ width: '100%', padding: 12, fontSize: 14 }}>
                    📞 電話諮詢貓舍 ({cattery.contactPhone || '0912-345-678'})
                  </button>
                </a>
                <button className="btn-primary" onClick={() => alert(`已為您發送【${selectedKitten.name}】預約賞貓需求給${cattery.name}！`)} style={{ flex: 1, padding: 12, fontSize: 14 }}>
                  💬 預約看貓與預定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, catteryId, qty, onUpdate }: { product: Product; catteryId?: string; qty: number; onUpdate: (d: number) => void }) {
  const sellerConfig = catteryId && product.sellerConfigs ? product.sellerConfigs[catteryId] : undefined;

  // 1. 標籤優先級：賣家自訂標籤 (customBadge) > 管理員預設推薦標籤
  const badgeText = sellerConfig?.customBadge || (product.isRecommended ? '🔥 店長推薦' : undefined);

  // 2. 售價與劃線打折原價：賣家客製售價 (若高於底價) > 管理員預設底價
  const effectivePrice = sellerConfig?.customPrice || product.sellingPrice;
  const effectiveOriginalPrice = sellerConfig?.customOriginalPrice || product.originalPrice;

  // 3. 折扣幅度計算
  const discount = Math.round((1 - effectivePrice / effectiveOriginalPrice) * 100);

  return (
    <div className="product-card">
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
          {qty === 0 ? (
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
