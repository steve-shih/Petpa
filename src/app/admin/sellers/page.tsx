'use client';

import { useState } from 'react';
import { catteries as initialCatteries, orders, kittens, type Cattery } from '@/lib/mock-data';
import Link from 'next/link';

export default function AdminSellersPage() {
  const [catteriesList, setCatteriesList] = useState<Cattery[]>(initialCatteries);
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [licenseInput, setLicenseInput] = useState<string>('');

  // 創建新貓舍 Modal 狀態
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    slug: '',
    sellerType: 'cattery' as 'cattery' | 'influencer',
    socialPlatform: 'Instagram (@my_cat_life)',
    followerCount: '10 萬粉絲',
    loginEmail: '',
    initialPassword: '',
    licenseNumber: '',
    description: '',
  });

  const toggleApproval = (id: string) => {
    setCatteriesList(prev => prev.map(c => c._id === id ? { ...c, isApproved: !c.isApproved } : c));
  };

  const toggleKittensZone = (id: string) => {
    setCatteriesList(prev => prev.map(c => {
      if (c._id === id) {
        if (!c.licenseNumber || c.licenseNumber === '審核中') {
          alert('⚠️ 開啟活體專區前，須先登記並審核通過「特定寵物業許可證字號」！');
          return c;
        }
        return { ...c, enableKittens: !c.enableKittens };
      }
      return c;
    }));
  };

  const saveLicense = (id: string) => {
    setCatteriesList(prev => prev.map(c => c._id === id ? { ...c, licenseNumber: licenseInput } : c));
    setEditingLicenseId(null);
  };

  const handleCreateCattery = (e: React.FormEvent) => {
    e.preventDefault();

    // 檢查 slug 是否重複
    const cleanedSlug = newStore.slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (catteriesList.some(c => c.slug === cleanedSlug || c.catteryId === cleanedSlug)) {
      alert('⚠️ 此網址代碼 (Slug) 已被其他賣家使用，請選擇不重複的唯一代碼！');
      return;
    }

    const created: Cattery = {
      _id: `cat_${Date.now()}`,
      catteryId: cleanedSlug.replace(/-/g, '_'),
      slug: cleanedSlug,
      name: newStore.name,
      sellerType: newStore.sellerType,
      socialPlatform: newStore.sellerType === 'influencer' ? newStore.socialPlatform : undefined,
      followerCount: newStore.sellerType === 'influencer' ? newStore.followerCount : undefined,
      logoUrl: '',
      bannerPreset: newStore.sellerType === 'influencer' ? 'rose-gold' : 'warm-amber',
      themeColor: newStore.sellerType === 'influencer' ? '#F43F5E' : '#F97316',
      description: newStore.description || (newStore.sellerType === 'influencer' ? '熱門寵物 KOL 獨家推薦賣場' : '專業頂級寵物貓舍，提供優質幼貓繁殖與嚴選飼養補給。'),
      loginEmail: newStore.loginEmail || `${cleanedSlug}@petpa.tw`,
      initialPassword: newStore.initialPassword || 'petpa8888password',
      licenseNumber: newStore.sellerType === 'cattery' ? newStore.licenseNumber : '社群賣家 (免特寵字號)',
      enableKittens: newStore.sellerType === 'cattery' && Boolean(newStore.licenseNumber),
      contactPhone: '0912-345-678',
      address: newStore.sellerType === 'influencer' ? '社群推廣工作室' : '門市地址籌備中',
      isApproved: true,
    };

    setCatteriesList([created, ...catteriesList]);
    setShowCreateModal(false);
    alert(`✅ 成功創建【${created.sellerType === 'influencer' ? '📱 社群 KOL 賣家' : '🐱 實體合作貓舍'}】 — 【${created.name}】！\n專屬店面網址：https://petpa.tw/shop/${created.slug}\n登入 Email：${created.loginEmail}\n預設密碼：${created.initialPassword}`);
    setNewStore({
      name: '',
      slug: '',
      sellerType: 'cattery',
      socialPlatform: 'Instagram (@my_cat_life)',
      followerCount: '10 萬粉絲',
      loginEmail: '',
      initialPassword: '',
      licenseNumber: '',
      description: '',
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🐱 合作貓舍創建、網址發行與特寵監管</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>管理員開立店家專屬 url/shop/:slug、獨立登入帳密與特寵許可字號發放</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ padding: '9px 20px', fontSize: 13.5 }}>
            ➕ 創建新合作貓舍店家
          </button>
          <span style={{ padding: '6px 14px', background: '#ECFDF5', color: '#047857', borderRadius: 'var(--radius-full)', fontSize: 12.5, fontWeight: 700 }}>
            合作中 <strong>{catteriesList.filter(c => c.isApproved).length}</strong> 家
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {catteriesList.map(cattery => {
          const catteryOrders = orders.filter(o => o.catteryId === cattery.catteryId);
          const catteryKittens = kittens.filter(k => k.catteryId === cattery.catteryId);
          const totalSales = catteryOrders.reduce((s, o) => s + o.totalAmount, 0);
          const totalCommission = catteryOrders.reduce((s, o) => s + o.sellerProfit, 0);

          return (
            <div key={cattery._id} className="kpi-card" style={{ border: cattery.isApproved ? '1px solid var(--color-border-light)' : '2px solid var(--color-warning)', position: 'relative' }}>
              {!cattery.isApproved && (
                <span className="badge badge-hot" style={{ top: 14, right: 14, background: 'var(--color-warning)' }}>待入駐審核</span>
              )}

              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-400), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'white', boxShadow: 'var(--shadow-md)' }}>🐱</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--color-text)' }}>{cattery.name}</h3>
                  <div style={{ fontSize: 12, color: 'var(--color-brand-600)', fontWeight: 700, marginTop: 2 }}>
                    🔗 專屬網址：<Link href={`/shop/${cattery.slug || cattery.catteryId}`} target="_blank" style={{ color: 'var(--color-brand-600)', fontWeight: 700 }}>url/shop/{cattery.slug || cattery.catteryId}</Link>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{cattery.description}</p>

              {/* 帳號密碼與特寵字號資訊塊 */}
              <div style={{ background: 'var(--color-bg)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: 14, border: '1px solid var(--color-border-light)', fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>🔑 專用登入 Email：</span>
                  <code style={{ fontWeight: 700 }}>{cattery.loginEmail || `${cattery.catteryId}@petpa.tw`}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>🔒 預設密碼：</span>
                  <code style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{cattery.initialPassword || 'petpa8888password'}</code>
                </div>

                <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)' }}>📜 特寵業字號：</span>
                  {editingLicenseId === cattery._id ? (
                    <button className="btn-admin btn-admin-primary" onClick={() => saveLicense(cattery._id)} style={{ padding: '2px 8px', fontSize: 11 }}>儲存</button>
                  ) : (
                    <button className="btn-admin btn-admin-outline" onClick={() => { setEditingLicenseId(cattery._id); setLicenseInput(cattery.licenseNumber || ''); }} style={{ padding: '2px 8px', fontSize: 11 }}>編輯字號</button>
                  )}
                </div>

                {editingLicenseId === cattery._id ? (
                  <input
                    type="text"
                    value={licenseInput}
                    onChange={e => setLicenseInput(e.target.value)}
                    placeholder="例：特寵業字第 A1130888 號"
                    className="form-input"
                    style={{ fontSize: 12, padding: '4px 8px', marginTop: 4 }}
                  />
                ) : (
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: cattery.licenseNumber ? 'var(--color-accent)' : 'var(--color-text-muted)', marginTop: 2 }}>
                    {cattery.licenseNumber || '⚠️ 未登記字號 (無法開啟活體專區)'}
                  </div>
                )}
              </div>

              {/* Data Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>導流訂單</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{catteryOrders.length} 筆</div>
                </div>
                <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>銷售金額</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-info)' }}>NT${totalSales.toLocaleString()}</div>
                </div>
                <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>分潤累計</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-brand-600)' }}>NT${totalCommission}</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/shop/${cattery.slug || cattery.catteryId}`} target="_blank" style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn-admin btn-admin-outline" style={{ width: '100%', fontSize: 12 }}>
                    👁️ 前往專屬 URL 賣場
                  </button>
                </Link>
                <button className="btn-admin btn-admin-outline" onClick={() => toggleApproval(cattery._id)} style={{ flex: 1, fontSize: 12, color: 'var(--color-danger)', borderColor: '#FECDD3' }}>
                  {cattery.isApproved ? '停用權限' : '核准開通'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Create New Cattery Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>➕ 創建新合作貓舍店家</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateCattery}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>賣家身份類型 *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `2px solid ${newStore.sellerType === 'cattery' ? '#F97316' : '#E2E8F0'}`, borderRadius: 8, cursor: 'pointer', background: newStore.sellerType === 'cattery' ? '#FFF7ED' : 'white' }}>
                    <input type="radio" name="sellerType" checked={newStore.sellerType === 'cattery'} onChange={() => setNewStore({ ...newStore, sellerType: 'cattery' })} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>🐱 實體合作貓舍</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>須登錄特寵字號、開放幼貓尋家</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: `2px solid ${newStore.sellerType === 'influencer' ? '#F43F5E' : '#E2E8F0'}`, borderRadius: 8, cursor: 'pointer', background: newStore.sellerType === 'influencer' ? '#FFF1F2' : 'white' }}>
                    <input type="radio" name="sellerType" checked={newStore.sellerType === 'influencer'} onChange={() => setNewStore({ ...newStore, sellerType: 'influencer' })} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>📱 社群 KOL 賣家</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>IG/YT/FB 寵物網紅、開箱導流</div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>
                  {newStore.sellerType === 'influencer' ? '社群帳號 / 品牌名稱 *' : '貓舍 / 店家名稱 *'}
                </label>
                <input type="text" required value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} placeholder={newStore.sellerType === 'influencer' ? "例：貓奴阿金的社群選品" : "例如：皇家星辰專業貓舍"} className="form-input" />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>專屬網址代碼 (URL Slug) *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>url/shop/</span>
                  <input
                    type="text"
                    required
                    value={newStore.slug}
                    onChange={e => setNewStore({ ...newStore, slug: e.target.value })}
                    placeholder="royal-star"
                    className="form-input"
                    style={{ fontFamily: 'monospace' }}
                  />
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, display: 'block' }}>💡 買家存取網址，須唯一不重複 (只允許小寫英數字與連字號)</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>獨立賣家 Email</label>
                  <input type="email" value={newStore.loginEmail} onChange={e => setNewStore({ ...newStore, loginEmail: e.target.value })} placeholder="royal@petpa.tw" className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>獨立賣家登入密碼</label>
                  <input type="text" value={newStore.initialPassword} onChange={e => setNewStore({ ...newStore, initialPassword: e.target.value })} placeholder="預設: petpa8888password" className="form-input" />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>特定寵物業許可證字號 (開立活體必填)</label>
                <input type="text" value={newStore.licenseNumber} onChange={e => setNewStore({ ...newStore, licenseNumber: e.target.value })} placeholder="例：特寵業字第 C1130999 號" className="form-input" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>貓舍品牌介紹簡述</label>
                <textarea value={newStore.description} onChange={e => setNewStore({ ...newStore, description: e.target.value })} rows={3} placeholder="簡述貓舍主打品種與經營理念..." className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowCreateModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>🚀 立即開通並發行 URL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


