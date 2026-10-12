'use client';

import { useState } from 'react';
import { catteries as initialCatteries, orders, kittens, type Cattery } from '@/lib/mock-data';
import Link from 'next/link';

export default function AdminSellersPage() {
  const [catteriesList, setCatteriesList] = useState<Cattery[]>(initialCatteries);
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [licenseInput, setLicenseInput] = useState<string>('');

  // 篩選標籤：全部 | 正常營運 | 待入駐審核 | 已停權
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

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

  // 獨立停權處分 Modal 狀態
  const [suspensionModalCattery, setSuspensionModalCattery] = useState<Cattery | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string>('特定寵物業許可證逾期未補正，暫停前台營業');

  // 預設常見停權原因
  const presetReasons = [
    '特定寵物業許可證逾期或遭主管機關廢止',
    '違反寵物買賣契約保障條款，買賣糾紛待釐清',
    '違反動保相關法規，主管機關來函勒令停業',
    '嚴重買家投訴退貨率過高，暫停接單調查中',
    '賣場帳號異常或涉及未授權交易行為',
  ];

  // 1. 審核通過 / 取消審核 (針對新入駐商家)
  const toggleApproval = (id: string) => {
    setCatteriesList(prev => prev.map(c => {
      if (c._id === id) {
        const nextState = !c.isApproved;
        return { ...c, isApproved: nextState };
      }
      return c;
    }));
  };

  // 2. 獨立停權功能：開啟停權確認彈窗
  const openSuspensionModal = (cattery: Cattery) => {
    setSuspensionModalCattery(cattery);
    setSuspensionReason('特定寵物業許可證逾期未補正，暫停前台營業');
  };

  // 執行確認停權
  const confirmSuspension = () => {
    if (!suspensionModalCattery) return;
    const nowStr = new Date().toLocaleString('zh-TW', { hour12: false });
    setCatteriesList(prev => prev.map(c => {
      if (c._id === suspensionModalCattery._id) {
        return {
          ...c,
          isSuspended: true,
          suspendedReason: suspensionReason.trim() || '配合平台合約審查，暫停前台營業',
          suspendedAt: nowStr,
        };
      }
      return c;
    }));

    alert(`⛔ 已成功對賣家【${suspensionModalCattery.name}】執行停權處分！\n前台賣場已立即停止營業與封鎖下單。`);
    setSuspensionModalCattery(null);
  };

  // 解除停權 / 恢復營運
  const unsuspendSeller = (cattery: Cattery) => {
    if (confirm(`確定要解除賣家【${cattery.name}】的停權處分並恢復正常營運嗎？`)) {
      setCatteriesList(prev => prev.map(c => {
        if (c._id === cattery._id) {
          return {
            ...c,
            isSuspended: false,
            suspendedReason: undefined,
            suspendedAt: undefined,
          };
        }
        return c;
      }));
      alert(`✅ 已恢復【${cattery.name}】的正常營運權限！前台專屬賣場已重啟營業。`);
    }
  };

  // 開啟 / 關閉幼貓專區
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

  // 儲存特寵字號
  const saveLicense = (id: string) => {
    setCatteriesList(prev => prev.map(c => c._id === id ? { ...c, licenseNumber: licenseInput } : c));
    setEditingLicenseId(null);
  };

  // 創建新合作貓舍店家
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
      isSuspended: false,
    };

    setCatteriesList([created, ...catteriesList]);
    setShowCreateModal(false);
    alert(`✅ 成功創建【${created.sellerType === 'influencer' ? '📱 社群 KOL 賣家' : '🐱 實體合作貓舍'}】 — 【${created.name}】！\n專屬店面網址：https://area.petpa.tw/shop/${created.slug}\n登入 Email：${created.loginEmail}\n預設密碼：${created.initialPassword}`);
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

  // 篩選列表計算
  const filteredCatteries = catteriesList.filter(c => {
    if (filterTab === 'active') return c.isApproved && !c.isSuspended;
    if (filterTab === 'pending') return !c.isApproved;
    if (filterTab === 'suspended') return Boolean(c.isSuspended);
    return true;
  });

  const activeCount = catteriesList.filter(c => c.isApproved && !c.isSuspended).length;
  const pendingCount = catteriesList.filter(c => !c.isApproved).length;
  const suspendedCount = catteriesList.filter(c => Boolean(c.isSuspended)).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🐱 合作賣家管理、專屬網址發行與停權監管</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>管理員開立店家專屬 /shop/:slug、獨立登入帳密、特寵許可證與停權處分管控</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)} style={{ padding: '9px 20px', fontSize: 13.5 }}>
            ➕ 創建新合作賣家
          </button>
        </div>
      </div>

      {/* 頂部快速篩選標籤 (Tabs) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: 12 }}>
        <button
          onClick={() => setFilterTab('all')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            border: 'none',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: filterTab === 'all' ? '#1E293B' : '#F1F5F9',
            color: filterTab === 'all' ? 'white' : '#475569',
            transition: 'all 0.2s',
          }}
        >
          全部賣家 ({catteriesList.length})
        </button>

        <button
          onClick={() => setFilterTab('active')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            border: 'none',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: filterTab === 'active' ? '#059669' : '#ECFDF5',
            color: filterTab === 'active' ? 'white' : '#047857',
            transition: 'all 0.2s',
          }}
        >
          ✅ 正常營運中 ({activeCount})
        </button>

        <button
          onClick={() => setFilterTab('pending')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            border: 'none',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: filterTab === 'pending' ? '#D97706' : '#FEF3C7',
            color: filterTab === 'pending' ? 'white' : '#B45309',
            transition: 'all 0.2s',
          }}
        >
          ⏳ 待入駐審核 ({pendingCount})
        </button>

        <button
          onClick={() => setFilterTab('suspended')}
          style={{
            padding: '7px 16px',
            borderRadius: 20,
            border: 'none',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            background: filterTab === 'suspended' ? '#DC2626' : '#FEE2E2',
            color: filterTab === 'suspended' ? 'white' : '#B91C1C',
            transition: 'all 0.2s',
          }}
        >
          ⛔ 已停權名單 ({suspendedCount})
        </button>
      </div>

      {filteredCatteries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1px dashed var(--color-border)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>此分類下暫無賣家資料</div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '6px 0 0' }}>請切換其他標籤查看或點擊右上角創建新賣家</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {filteredCatteries.map(cattery => {
            const catteryOrders = orders.filter(o => o.catteryId === cattery.catteryId);
            const totalSales = catteryOrders.reduce((s, o) => s + o.totalAmount, 0);
            const totalCommission = catteryOrders.reduce((s, o) => s + o.sellerProfit, 0);

            // 判斷邊框顏色狀態
            let borderStyle = '1px solid var(--color-border-light)';
            if (cattery.isSuspended) {
              borderStyle = '2px solid #EF4444';
            } else if (!cattery.isApproved) {
              borderStyle = '2px solid var(--color-warning)';
            }

            return (
              <div
                key={cattery._id}
                className="kpi-card"
                style={{
                  border: borderStyle,
                  position: 'relative',
                  background: cattery.isSuspended ? '#FFF5F5' : 'white',
                  transition: 'all 0.2s',
                }}
              >
                {/* 狀態徽章 */}
                {cattery.isSuspended ? (
                  <span style={{ position: 'absolute', top: 14, right: 14, background: '#DC2626', color: 'white', padding: '3px 10px', borderRadius: 12, fontSize: 11.5, fontWeight: 800 }}>
                    ⛔ 已停權處分
                  </span>
                ) : !cattery.isApproved ? (
                  <span style={{ position: 'absolute', top: 14, right: 14, background: '#F59E0B', color: 'white', padding: '3px 10px', borderRadius: 12, fontSize: 11.5, fontWeight: 800 }}>
                    ⏳ 待入駐審核
                  </span>
                ) : (
                  <span style={{ position: 'absolute', top: 14, right: 14, background: '#10B981', color: 'white', padding: '3px 10px', borderRadius: 12, fontSize: 11.5, fontWeight: 800 }}>
                    ✅ 營運中
                  </span>
                )}

                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: cattery.isSuspended ? '#9CA3AF' : 'linear-gradient(135deg, var(--color-brand-400), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'white', boxShadow: 'var(--shadow-md)' }}>
                    {cattery.sellerType === 'influencer' ? '📱' : '🐱'}
                  </div>
                  <div style={{ paddingRight: 90 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--color-text)' }}>{cattery.name}</h3>
                    <div style={{ fontSize: 12, color: 'var(--color-brand-600)', fontWeight: 700, marginTop: 3 }}>
                      {/* 修正：Next.js basePath 為 /shop，Link href 應使用 /slug 避免產生 /shop/shop 重複路徑 */}
                      🔗 專屬網址：<Link href={`/${cattery.slug || cattery.catteryId}`} target="_blank" style={{ color: 'var(--color-brand-600)', fontWeight: 700 }}>
                        /shop/{cattery.slug || cattery.catteryId}
                      </Link>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{cattery.description}</p>

                {/* 停權警示塊 (若處於停權狀態) */}
                {cattery.isSuspended && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#991B1B' }}>
                    <div style={{ fontWeight: 800, marginBottom: 2 }}>⚠️ 停權處分生效中 (前台賣場已停止營業)</div>
                    <div><strong>原因：</strong>{cattery.suspendedReason || '特定寵物業許可證逾期未補正，暫停前台營業'}</div>
                    {cattery.suspendedAt && <div style={{ fontSize: 11, color: '#B91C1C', marginTop: 2 }}>時間：{cattery.suspendedAt}</div>}
                  </div>
                )}

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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                  <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>導流訂單</div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{catteryOrders.length} 筆</div>
                  </div>
                  <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>銷售金額</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-info)' }}>NT${totalSales.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>分潤累計</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-brand-600)' }}>NT${totalCommission.toLocaleString()}</div>
                  </div>
                </div>

                {/* 操作按鈕組：前往賣場、入駐審核、獨立停權選項 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {/* 修正：使用 Next.js basePath 自動對應之 /slug 避免 /shop/shop */}
                    <Link href={`/${cattery.slug || cattery.catteryId}`} target="_blank" style={{ flex: 1, textDecoration: 'none' }}>
                      <button className="btn-admin btn-admin-outline" style={{ width: '100%', fontSize: 12 }}>
                        👁️ 前往專屬賣場
                      </button>
                    </Link>

                    {/* 入駐審核切換 */}
                    <button
                      className="btn-admin btn-admin-outline"
                      onClick={() => toggleApproval(cattery._id)}
                      style={{
                        flex: 1,
                        fontSize: 12,
                        color: cattery.isApproved ? '#475569' : '#059669',
                        borderColor: cattery.isApproved ? '#CBD5E1' : '#A7F3D0',
                      }}
                    >
                      {cattery.isApproved ? '取消入駐核准' : '✅ 核准入駐'}
                    </button>
                  </div>

                  {/* 另萬：停權額外做一個選項 (獨立停權 / 解除停權按鈕) */}
                  {cattery.isSuspended ? (
                    <button
                      onClick={() => unsuspendSeller(cattery)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <span>✅</span> 解除停權處分 (立即恢復營運)
                    </button>
                  ) : (
                    <button
                      onClick={() => openSuspensionModal(cattery)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#FFF1F2',
                        color: '#E11D48',
                        border: '1px solid #FECDD3',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 12.5,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <span>⛔</span> 執行停權處分 (封鎖賣場接單)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 獨立停權處分確認 Modal */}
      {suspensionModalCattery && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 24 }}>⛔</span>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#DC2626' }}>
                  執行賣家停權處分
                </h2>
              </div>
              <button onClick={() => setSuspensionModalCattery(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#991B1B' }}>
              <div>您即將對【<strong>{suspensionModalCattery.name}</strong>】(代碼：{suspensionModalCattery.slug}) 執行停權處分。</div>
              <div style={{ marginTop: 4, fontSize: 12 }}>處分生效後，該賣家前台專屬賣場將<strong>立即停止營業</strong>，買家將無法加入購物車與下單結帳。</div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
                請選擇常見停權原因 (或直接於下方編輯)：
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {presetReasons.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSuspensionReason(preset)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: 12,
                      borderRadius: 6,
                      border: suspensionReason === preset ? '1.5px solid #DC2626' : '1px solid #E2E8F0',
                      background: suspensionReason === preset ? '#FEF2F2' : 'white',
                      color: suspensionReason === preset ? '#991B1B' : '#334155',
                      fontWeight: suspensionReason === preset ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    • {preset}
                  </button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 4, color: 'var(--color-text)' }}>
                停權具體原因與說明 *
              </label>
              <textarea
                value={suspensionReason}
                onChange={e => setSuspensionReason(e.target.value)}
                rows={3}
                className="form-input"
                placeholder="請輸入詳盡停權理由..."
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
              <button
                type="button"
                className="btn-admin btn-admin-outline"
                onClick={() => setSuspensionModalCattery(null)}
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmSuspension}
                style={{
                  padding: '9px 20px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                }}
              >
                ⛔ 確認執行停權處分
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Create New Cattery Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>➕ 創建新合作賣家與專屬網址</h2>
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
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>/shop/</span>
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
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, display: 'block' }}>💡 買家存取網址為 <code>https://area.petpa.tw/shop/代碼</code> (只允許小寫英數字與連字號)</span>
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
