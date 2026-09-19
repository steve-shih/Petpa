'use client';

import { useState } from 'react';
import { bannerPresets, catteries } from '@/lib/mock-data';

export default function SellerPageView() {
  const currentCattery = catteries[0];
  const [name, setName] = useState(currentCattery.name);
  const [description, setDescription] = useState(currentCattery.description);
  const [selectedPreset, setSelectedPreset] = useState(currentCattery.bannerPreset || 'warm-amber');
  const [customBannerUrl, setCustomBannerUrl] = useState(currentCattery.bannerUrl || '');

  // 影片廣告設定
  const [enableVideoAd, setEnableVideoAd] = useState(currentCattery.enableVideoAd ?? true);
  const [videoUrl, setVideoUrl] = useState(currentCattery.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [headerVideoTitle, setHeaderVideoTitle] = useState(currentCattery.headerVideoTitle || '🎥 喵喵萌寵貓舍 2026 最新賽級英短介紹');

  // 自訂模組開關 (Widgets)
  const [activeWidgets, setActiveWidgets] = useState<string[]>(
    currentCattery.activeWidgets || ['announcement', 'video_ad', 'kittens_showcase', 'guarantee_badge', 'recommended_products']
  );

  const [saved, setSaved] = useState(false);

  const activePreset = bannerPresets.find(p => p.id === selectedPreset) || bannerPresets[0];

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(prev =>
      prev.includes(widgetId) ? prev.filter(w => w !== widgetId) : [...prev, widgetId]
    );
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...activeWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;
    setActiveWidgets(newWidgets);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🖼️ 頁面封面、影片廣告與組件積木拖拉設定</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>自定義 Header 影音宣傳短片、風格封面與動態版塊模組組合</p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={handleSave} style={{ padding: '10px 24px', fontSize: 14 }}>
          {saved ? '✓ 儲存成功！' : '💾 儲存發布變更'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
        {/* Left: Form & Widget Customizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Brand Basic Info */}
          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--color-text)' }}>📝 品牌基本資料</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>貓舍 / 品牌名稱</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>貓舍簡介與推薦語</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="form-input" style={{ resize: 'vertical' }} />
            </div>
          </div>

          {/* Banner Preset & Cover Photo */}
          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--color-text)' }}>🎨 賣場封面風格主題</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              {bannerPresets.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => { setSelectedPreset(preset.id); setCustomBannerUrl(''); }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: preset.gradient,
                    border: selectedPreset === preset.id && !customBannerUrl ? `2.5px solid ${preset.accentColor}` : '1.5px solid var(--color-border)',
                    cursor: 'pointer',
                    boxShadow: selectedPreset === preset.id && !customBannerUrl ? 'var(--shadow-md)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: preset.isDark ? 'white' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{preset.name}</span>
                    {selectedPreset === preset.id && !customBannerUrl && <span>✓</span>}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>自訂封面圖片網址 (圖片 URL)</label>
              <input
                type="text"
                value={customBannerUrl}
                onChange={e => setCustomBannerUrl(e.target.value)}
                placeholder="/cattery_banner_demo.png"
                className="form-input"
              />
            </div>
          </div>

          {/* Video Banner Settings */}
          <div className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>🎥 Header 影音廣告播報</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                <input type="checkbox" checked={enableVideoAd} onChange={e => setEnableVideoAd(e.target.checked)} style={{ accentColor: 'var(--color-brand-500)' }} />
                開啟影音廣告
              </label>
            </div>

            {enableVideoAd && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>影音宣傳標題</label>
                  <input type="text" value={headerVideoTitle} onChange={e => setHeaderVideoTitle(e.target.value)} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-secondary)' }}>MP4 影片 / YouTube 連結 URL</label>
                  <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="form-input" />
                </div>
              </div>
            )}
          </div>

          {/* Widget Drag & Toggle Selector */}
          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--color-text)' }}>🧩 頁面版塊模組順序 (排列與開關)</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 14 }}>可勾選啟用或透過上下按鈕調整顧客手機畫面的組件呈現順序：</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'announcement', title: '📢 貓舍最新公告跑馬燈', icon: '📢' },
                { id: 'video_ad', title: '🎥 Header 影音宣傳廣告', icon: '🎥' },
                { id: 'kittens_showcase', title: '🐾 血統幼貓展示牆 (活體專區)', icon: '🐾' },
                { id: 'guarantee_badge', title: '🛡️ 正品與特定寵物字號保障牆', icon: '🛡️' },
                { id: 'recommended_products', title: '🛍️ 店長嚴選推薦商品牆', icon: '🛍️' },
              ].map((w, idx) => {
                const isActive = activeWidgets.includes(w.id);
                const activeIndex = activeWidgets.indexOf(w.id);

                return (
                  <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: isActive ? 'white' : 'var(--color-bg)', border: isActive ? '1.5px solid var(--color-brand-300)' : '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', opacity: isActive ? 1 : 0.6 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                      <input type="checkbox" checked={isActive} onChange={() => toggleWidget(w.id)} style={{ accentColor: 'var(--color-brand-500)', width: 16, height: 16 }} />
                      <span>{w.title}</span>
                    </label>

                    {isActive && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => moveWidget(activeIndex, 'up')} disabled={activeIndex === 0} style={{ padding: '2px 8px', fontSize: 11, cursor: activeIndex === 0 ? 'not-allowed' : 'pointer' }}>▲ 上移</button>
                        <button onClick={() => moveWidget(activeIndex, 'down')} disabled={activeIndex === activeWidgets.length - 1} style={{ padding: '2px 8px', fontSize: 11, cursor: activeIndex === activeWidgets.length - 1 ? 'not-allowed' : 'pointer' }}>▼ 下移</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <div className="kpi-card" style={{ position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>👁️ 手機視角實時預覽 (Live RWD Preview)</h3>
              <span style={{ fontSize: 11, background: 'var(--color-brand-50)', color: 'var(--color-brand-600)', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>1:1 實時渲染</span>
            </div>

            {/* Simulated Phone Device Frame */}
            <div style={{
              border: '2px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              overflow: 'hidden',
              background: 'var(--color-bg)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: 680,
              overflowY: 'auto',
            }}>
              {/* Header Hero Area */}
              <div style={{
                position: 'relative',
                padding: '30px 16px 20px',
                background: customBannerUrl ? `url(${customBannerUrl}) center/cover no-repeat` : activePreset.gradient,
                textAlign: 'center',
                color: activePreset.isDark && !customBannerUrl ? 'white' : 'var(--color-text)',
                transition: 'all 0.3s',
              }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(10px)', padding: '8px 14px', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)', marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: activePreset.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'white' }}>
                    🐱
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text)' }}>{name || '品牌名稱'}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-brand-600)', fontWeight: 700 }}>📜 {currentCattery.licenseNumber || '特寵字號認證'}</div>
                  </div>
                </div>
                <p style={{ fontSize: 11.5, color: activePreset.isDark && !customBannerUrl ? 'rgba(255,255,255,0.85)' : 'var(--color-text-secondary)', margin: '0 auto', maxWidth: 260, lineHeight: 1.35 }}>
                  {description}
                </p>
              </div>

              {/* Dynamic Widgets Rendered by Order */}
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeWidgets.map(widgetId => {
                  if (widgetId === 'announcement') {
                    return (
                      <div key={widgetId} style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: 11.5, color: '#92400E', fontWeight: 600 }}>
                        📢 公告：九月秋季幼貓滿月開放預約賞貓，下單即贈優質幼貓試吃包！
                      </div>
                    );
                  }

                  if (widgetId === 'video_ad' && enableVideoAd) {
                    return (
                      <div key={widgetId} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: 10, border: '1px solid var(--color-border-light)' }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>{headerVideoTitle}</div>
                        <div style={{ position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: 140, background: '#000' }}>
                          <video src={videoUrl} controls autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    );
                  }

                  if (widgetId === 'kittens_showcase') {
                    return (
                      <div key={widgetId} style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 'var(--radius-md)', padding: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#BE123C', marginBottom: 6 }}>👑 血統幼貓展示牆 (活體專區)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                          <div style={{ background: 'white', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ height: 60, background: '#FEF3C7', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🐱</div>
                            <div style={{ fontSize: 10.5, fontWeight: 800, marginTop: 4 }}>珍珠 (藍白英短)</div>
                            <div style={{ fontSize: 11, color: 'var(--color-danger)', fontWeight: 800 }}>NT$ 38,000</div>
                          </div>
                          <div style={{ background: 'white', padding: 8, borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ height: 60, background: '#FDE68A', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🐱</div>
                            <div style={{ fontSize: 10.5, fontWeight: 800, marginTop: 4 }}>奧斯卡 (藍貓)</div>
                            <div style={{ fontSize: 11, color: '#D97706', fontWeight: 800 }}>🔒 已受預訂</div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (widgetId === 'guarantee_badge') {
                    return (
                      <div key={widgetId} style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: 11, color: '#047857', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>🛡️ 正品保證</div>
                        <div>📜 登記字號</div>
                        <div>🚚 30秒極速結帳</div>
                      </div>
                    );
                  }

                  if (widgetId === 'recommended_products') {
                    return (
                      <div key={widgetId}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-text)', marginBottom: 6 }}>🛍️ 店長嚴選推薦商品牆</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: 8, border: '1px solid var(--color-border-light)' }}>
                            <div style={{ height: 60, background: '#FEF3C7', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🍚</div>
                            <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 4 }}>幼貓專用糧</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-danger)' }}>NT$ 280</div>
                          </div>
                          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: 8, border: '1px solid var(--color-border-light)' }}>
                            <div style={{ height: 60, background: '#E0F2FE', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏖️</div>
                            <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 4 }}>除臭豆腐貓砂</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-danger)' }}>NT$ 220</div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


