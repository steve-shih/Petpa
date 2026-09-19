'use client';

import { useState } from 'react';
import { products as initialProducts, categories as initialCategories, catteries, type Product, type Category } from '@/lib/mock-data';

export default function SellerProductsPage() {
  const currentCattery = catteries[0]; // 喵喵萌寵貓舍

  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);

  // Modal 狀態
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showCustomConfigModal, setShowCustomConfigModal] = useState(false);
  const [showSpecialPriceModal, setShowSpecialPriceModal] = useState(false);

  // 選取的當前編輯商品
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);

  // 賣家標籤與售價自訂表單
  const [customForm, setCustomForm] = useState({
    customBadge: '🔥 店長推薦',
    customPrice: 480,
    customOriginalPrice: 550,
  });

  // 大量採購特殊價申請表單
  const [specialForm, setSpecialForm] = useState({
    bulkThresholdQty: 50,
    specialDiscountPrice: 280,
    specialPriceReason: '預計下個月新幼貓交車潮，申請進貨50包作為過渡期贈品',
  });

  const openCustomConfigModal = (p: Product) => {
    setTargetProduct(p);
    const cfg = p.sellerConfigs ? p.sellerConfigs[currentCattery.catteryId] : undefined;
    setCustomForm({
      customBadge: cfg?.customBadge || (p.isRecommended ? '🔥 店長推薦' : '👑 貓舍血統專用'),
      customPrice: cfg?.customPrice || p.sellingPrice,
      customOriginalPrice: cfg?.customOriginalPrice || p.originalPrice,
    });
    setShowCustomConfigModal(true);
  };

  const openSpecialPriceModal = (p: Product) => {
    setTargetProduct(p);
    const cfg = p.sellerConfigs ? p.sellerConfigs[currentCattery.catteryId] : undefined;
    setSpecialForm({
      bulkThresholdQty: cfg?.bulkThresholdQty || 50,
      specialDiscountPrice: cfg?.specialDiscountPrice || Math.round(p.costPrice * 1.15),
      specialPriceReason: cfg?.specialPriceReason || '大量進貨作為合作貓舍贈品',
    });
    setShowSpecialPriceModal(true);
  };

  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct) return;

    // 價格檢核：不可低於管理員預訂底價 (unless 特殊合約)
    if (customForm.customPrice < targetProduct.sellingPrice) {
      alert(`⚠️ 自訂售價 (NT$${customForm.customPrice}) 不可低於管理員預設建議底價 (NT$${targetProduct.sellingPrice})！\n若需設為低於底價的特殊折扣，請點擊「簽訂特殊價合約」向 Admin 提交審批。`);
      return;
    }

    setProductsList(prev => prev.map(p => {
      if (p._id === targetProduct._id) {
        const prevCfgs = p.sellerConfigs || {};
        return {
          ...p,
          sellerConfigs: {
            ...prevCfgs,
            [currentCattery.catteryId]: {
              ...(prevCfgs[currentCattery.catteryId] || { catteryId: currentCattery.catteryId }),
              customBadge: customForm.customBadge,
              customPrice: customForm.customPrice,
              customOriginalPrice: customForm.customOriginalPrice,
            },
          },
        };
      }
      return p;
    }));

    setShowCustomConfigModal(false);
    alert(`✅ 已成功更新【${targetProduct.title}】的專屬賣場標籤 (【${customForm.customBadge}】) 與售價 (NT$${customForm.customPrice})！`);
  };

  const handleRequestSpecialPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProduct) return;

    setProductsList(prev => prev.map(p => {
      if (p._id === targetProduct._id) {
        const prevCfgs = p.sellerConfigs || {};
        return {
          ...p,
          sellerConfigs: {
            ...prevCfgs,
            [currentCattery.catteryId]: {
              ...(prevCfgs[currentCattery.catteryId] || { catteryId: currentCattery.catteryId }),
              bulkThresholdQty: Number(specialForm.bulkThresholdQty),
              specialDiscountPrice: Number(specialForm.specialDiscountPrice),
              specialPriceReason: specialForm.specialPriceReason,
              specialPriceStatus: 'PendingReview', // ⏳ 送交 Admin 審批
            },
          },
        };
      }
      return p;
    }));

    setShowSpecialPriceModal(false);
    alert(`⏳ 已送出【${targetProduct.title}】大量採購 (超過 ${specialForm.bulkThresholdQty} 件) 特殊低價 (NT$${specialForm.specialDiscountPrice}) 簽訂合約審批！\n請等待系統管理員 (Admin) 審查簽核。`);
  };

  // 新增/提報商品表單
  const [prodForm, setProdForm] = useState({
    title: '',
    categoryId: 'cat_food',
    sellingPrice: 480,
    costPrice: 200,
    pdfUrl: '',
    pdfTitle: '',
    description: '',
  });

  // 新增/提報分類表單
  const [catForm, setCatForm] = useState({
    name: '',
    icon: '🐱',
    reason: '',
  });

  // 賣家提報新商品修改 / 上架申請
  const handleProposeProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categoriesList.find(c => c._id === prodForm.categoryId);
    const cost = Number(prodForm.costPrice);
    const selling = Number(prodForm.sellingPrice);
    const netProf = Math.round((selling - cost - selling * 0.05) * 10) / 10;

    const proposed: Product = {
      _id: `prod_prop_${Date.now()}`,
      title: prodForm.title,
      categoryId: prodForm.categoryId,
      categorySlug: cat?.slug || 'cat-food',
      costPrice: cost,
      sellingPrice: selling,
      originalPrice: Math.round(selling * 1.2),
      taxRate: 0.05,
      taxAmount: Math.round(selling * 0.05),
      netProfit: netProf,
      marginRate: Math.round((netProf / selling) * 1000) / 1000,
      stock: 50,
      images: ['/images/food-kitten.jpg'],
      pdfUrl: prodForm.pdfUrl || undefined,
      pdfTitle: prodForm.pdfTitle || (prodForm.pdfUrl ? '📄 賣家上傳檢驗證明.pdf' : undefined),
      targetCatteries: [currentCattery.catteryId],
      specifications: [{ name: '申請店家', value: currentCattery.name }],
      isRecommended: false,
      isActive: false, // 尚未通過 Admin 審核
      reviewStatus: 'PendingReview', // ⏳ 待管理員審核
      proposedByCatteryId: currentCattery.catteryId,
    };

    setProductsList([proposed, ...productsList]);
    setShowProductModal(false);
    alert(`⏳ 已送出【${proposed.title}】商品自訂申請！\n依平台規範，需待系統管理員 (Admin) 審核通過後，方可正式上架並於您的專屬賣場展示。`);
    setProdForm({
      title: '',
      categoryId: 'cat_food',
      sellingPrice: 480,
      costPrice: 200,
      pdfUrl: '',
      pdfTitle: '',
      description: '',
    });
  };

  // 賣家提報新商品種類 / 分類申請
  const handleProposeCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const proposed: Category = {
      _id: `cat_prop_${Date.now()}`,
      name: catForm.name,
      slug: catForm.name.toLowerCase().replace(/\s+/g, '-'),
      icon: catForm.icon || '🏷️',
      sortOrder: 99,
      defaultCommissionRate: 0.15,
      isSystem: false,
      isActive: false, // 待 Admin 審核
      reviewStatus: 'PendingReview',
      proposedByCatteryId: currentCattery.catteryId,
    };

    setCategoriesList([...categoriesList, proposed]);
    setShowCatModal(false);
    alert(`⏳ 已向 Admin 提交全新商品種類【${proposed.icon} ${proposed.name}】申請！\n管理員審核通過後將全站開放選用。`);
    setCatForm({ name: '', icon: '🐱', reason: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>📦 店家專屬商品與種類修改申請</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
            合作店家：<strong style={{ color: 'var(--color-brand-600)' }}>{currentCattery.name}</strong> · 自行修改與新增須經 Admin 審核通過
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-admin btn-admin-outline" onClick={() => setShowCatModal(true)} style={{ fontSize: 13 }}>
            🏷️ 申請新商品種類
          </button>
          <button className="btn-primary" onClick={() => setShowProductModal(true)} style={{ padding: '9px 18px', fontSize: 13.5 }}>
            ➕ 提報自訂修改商品
          </button>
        </div>
      </div>

      {/* 提醒通知塊 */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 20, color: '#1E40AF', fontSize: 13, lineHeight: 1.6 }}>
        💡 <strong>平台管理規範提示：</strong>為確保全站寵物食品與保健品安全品質，店家自行新增商品或修改種類時，資料將自動送交 <strong>系統管理員 (Admin) 進行合規審核</strong>。核准後將自動開通上架！
      </div>

      {/* 我的賣場商品與審核狀態列表 */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto', marginBottom: 24 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>📋 我提出的商品上架與修改清單</h3>
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>共 {productsList.filter(p => p.proposedByCatteryId === currentCattery.catteryId || p.targetCatteries?.includes(currentCattery.catteryId) || p.targetCatteries?.includes('all')).length} 筆商品</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>商品名稱與 PDF 檢驗檔</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>賣場專屬標籤</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>底價 / 自訂售價</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Admin 審核狀態</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作與特殊價簽訂</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map(p => {
              const cat = categoriesList.find(c => c._id === p.categoryId);
              const status = p.reviewStatus || 'Approved';
              const cfg = p.sellerConfigs ? p.sellerConfigs[currentCattery.catteryId] : undefined;
              const effectiveBadge = cfg?.customBadge || (p.isRecommended ? '🔥 店長推薦' : '未設定 (管理員預設)');
              const effectivePrice = cfg?.customPrice || p.sellingPrice;

              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '12px', maxWidth: 220 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{p.title}</div>
                    {p.pdfUrl && (
                      <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2563EB', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        📄 {p.pdfTitle || '查看PDF檢驗證明.pdf'}
                      </a>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge" style={{ background: cfg?.customBadge ? '#EDE9FE' : '#F1F5F9', color: cfg?.customBadge ? '#6D28D9' : '#475569', fontSize: 11.5, fontWeight: 700 }}>
                      🏷️ {effectiveBadge}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-danger)' }}>NT${effectivePrice}</div>
                    {cfg?.customPrice && cfg.customPrice > p.sellingPrice && (
                      <div style={{ fontSize: 10.5, color: '#6B7280' }}>(管理員底價: NT${p.sellingPrice})</div>
                    )}
                    {cfg?.specialPriceStatus === 'Approved' && (
                      <span style={{ fontSize: 10, background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: 4, fontWeight: 700, display: 'block', marginTop: 2 }}>
                        🤝 簽訂特殊批發價: NT${cfg.specialDiscountPrice} (&gt;{cfg.bulkThresholdQty}件)
                      </span>
                    )}
                    {cfg?.specialPriceStatus === 'PendingReview' && (
                      <span style={{ fontSize: 10, background: '#FEF3C7', color: '#D97706', padding: '1px 6px', borderRadius: 4, fontWeight: 700, display: 'block', marginTop: 2 }}>
                        ⏳ 特殊價簽訂審批中 (NT${cfg.specialDiscountPrice})
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {status === 'Approved' && (
                      <span className="badge" style={{ background: '#ECFDF5', color: '#047857', padding: '4px 10px', fontSize: 11.5 }}>
                        ✅ 審核核准
                      </span>
                    )}
                    {status === 'PendingReview' && (
                      <span className="badge" style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 10px', fontSize: 11.5 }}>
                        ⏳ 待 Admin 審核
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-admin btn-admin-outline" onClick={() => openCustomConfigModal(p)} style={{ padding: '4px 10px', fontSize: 11.5 }}>
                        ✏️ 自訂標籤與售價
                      </button>
                      <button className="btn-admin btn-admin-primary" onClick={() => openSpecialPriceModal(p)} style={{ padding: '4px 10px', fontSize: 11.5 }}>
                        🤝 申請高量特殊價
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 提出商品種類申請區 */}
      <div className="kpi-card" style={{ padding: 18 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800 }}>🏷️ 目前全站商品種類庫 (含店家提報)</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {categoriesList.map(cat => (
            <div key={cat._id} style={{ background: cat.reviewStatus === 'PendingReview' ? '#FEF3C7' : 'var(--color-bg)', border: '1px solid var(--color-border-light)', padding: '6px 14px', borderRadius: 20, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{cat.icon}</span>
              <span style={{ fontWeight: 700 }}>{cat.name}</span>
              {cat.reviewStatus === 'PendingReview' && <span style={{ fontSize: 10, color: '#D97706', background: '#FFF', padding: '1px 6px', borderRadius: 10 }}>審核中</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Propose Product Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>➕ 提報自訂商品修改/上架 (需 Admin 審核)</h2>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleProposeProduct}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>商品名稱 *</label>
                <input type="text" required value={prodForm.title} onChange={e => setProdForm({ ...prodForm, title: e.target.value })} placeholder="例：喵喵貓舍獨家手作貓草凍乾 (30g)" className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>所屬商品種類 *</label>
                  <select value={prodForm.categoryId} onChange={e => setProdForm({ ...prodForm, categoryId: e.target.value })} className="form-input">
                    {categoriesList.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>建議售價 (NT$) *</label>
                  <input type="number" required value={prodForm.sellingPrice} onChange={e => setProdForm({ ...prodForm, sellingPrice: Number(e.target.value) })} className="form-input" />
                </div>
              </div>

              {/* PDF 文件上傳欄位 */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: 12, borderRadius: 8, marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>📄 附帶 PDF 合約 / 成分與檢驗證明 (可選)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input
                    type="url"
                    value={prodForm.pdfUrl}
                    onChange={e => setProdForm({ ...prodForm, pdfUrl: e.target.value })}
                    placeholder="PDF 網址 (https://...)"
                    className="form-input"
                    style={{ fontSize: 12 }}
                  />
                  <input
                    type="text"
                    value={prodForm.pdfTitle}
                    onChange={e => setProdForm({ ...prodForm, pdfTitle: e.target.value })}
                    placeholder="檔案名稱 (如：SGS檢驗.pdf)"
                    className="form-input"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>修改說明 / 申請原因</label>
                <textarea value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} rows={3} placeholder="簡述商品特色或修改原因，加速 Admin 審核..." className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowProductModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>🚀 送出申請等待 Admin 審核</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Propose Category Modal */}
      {showCatModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>🏷️ 申請新增商品種類/分類</h2>
              <button onClick={() => setShowCatModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleProposeCategory}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>圖示 Icon</label>
                  <input type="text" value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} placeholder="🐱" className="form-input" style={{ textAlign: 'center', fontSize: 18 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>種類名稱 *</label>
                  <input type="text" required value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="例：貓咪肉泥／美容用品" className="form-input" />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>申請說明</label>
                <textarea value={catForm.reason} onChange={e => setCatForm({ ...catForm, reason: e.target.value })} rows={2} placeholder="說明為何建議新增此分類..." className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowCatModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>提交 Admin 審核</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. 自訂標籤與售價 Modal */}
      {showCustomConfigModal && targetProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>✏️ 自訂專屬賣場標籤與售價</h2>
              <button onClick={() => setShowCustomConfigModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveCustomConfig}>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12.5, lineHeight: 1.6 }}>
                <div><strong>目前商品：</strong>{targetProduct.title}</div>
                <div><strong>管理員建議底價：</strong><span style={{ color: 'var(--color-brand-600)', fontWeight: 700 }}>NT$ {targetProduct.sellingPrice}</span> (劃線原價 NT${targetProduct.originalPrice})</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>賣場專屬自訂標籤 (多元自選或自填)</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  {['🔥 店長推薦', '👑 貓舍血統專用', '✨ 降價回饋', '🌟 幼貓轉糧首選', '🏆 CFA 賽級推薦'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setCustomForm({ ...customForm, customBadge: tag })}
                      style={{
                        fontSize: 11,
                        padding: '3px 8px',
                        borderRadius: 12,
                        border: '1px solid',
                        cursor: 'pointer',
                        background: customForm.customBadge === tag ? '#8B5CF6' : 'white',
                        color: customForm.customBadge === tag ? 'white' : '#475569',
                        borderColor: customForm.customBadge === tag ? '#8B5CF6' : '#CBD5E1',
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <input type="text" value={customForm.customBadge} onChange={e => setCustomForm({ ...customForm, customBadge: e.target.value })} placeholder="亦可自由手寫標籤文字..." className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>賣場展示售價 (NT$) *</label>
                  <input type="number" required min={targetProduct.sellingPrice} value={customForm.customPrice} onChange={e => setCustomForm({ ...customForm, customPrice: Number(e.target.value) })} className="form-input" />
                  <span style={{ fontSize: 10.5, color: '#64748B', marginTop: 2, display: 'block' }}>不可低於底價 NT${targetProduct.sellingPrice}</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>劃線打折原價 (NT$)</label>
                  <input type="number" required value={customForm.customOriginalPrice} onChange={e => setCustomForm({ ...customForm, customOriginalPrice: Number(e.target.value) })} className="form-input" />
                  <span style={{ fontSize: 10.5, color: '#64748B', marginTop: 2, display: 'block' }}>用於計算前台 -XX% 折扣</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowCustomConfigModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>💾 儲存並連動專屬賣場</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 高量採購特殊價簽訂審批 Modal */}
      {showSpecialPriceModal && targetProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>🤝 簽訂高量特殊低價合約 (需 Admin 審批)</h2>
              <button onClick={() => setShowSpecialPriceModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleRequestSpecialPrice}>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12.5, lineHeight: 1.6, color: '#1E40AF' }}>
                💡 <strong>管理員簽合約規範：</strong>若您的貓舍預計一次引進或發放大量商品（如門市贈品、新手禮包），可以申請低於底價的專屬進貨價格。審批通過後即生效！
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>採購數量門檻 (件) *</label>
                  <input type="number" required min={10} value={specialForm.bulkThresholdQty} onChange={e => setSpecialForm({ ...specialForm, bulkThresholdQty: Number(e.target.value) })} className="form-input" />
                  <span style={{ fontSize: 10.5, color: '#64748B', marginTop: 2, display: 'block' }}>例如：超過 50 件</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>申請特殊批發折扣價 (NT$) *</label>
                  <input type="number" required value={specialForm.specialDiscountPrice} onChange={e => setSpecialForm({ ...specialForm, specialDiscountPrice: Number(e.target.value) })} className="form-input" />
                  <span style={{ fontSize: 10.5, color: '#64748B', marginTop: 2, display: 'block' }}>成本 NT${targetProduct.costPrice} / 底價 NT${targetProduct.sellingPrice}</span>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>申請原因與合作合約說明 *</label>
                <textarea required value={specialForm.specialPriceReason} onChange={e => setSpecialForm({ ...specialForm, specialPriceReason: e.target.value })} rows={3} placeholder="詳細說明採購用途（例：做為新貓入住包送給新家長）..." className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowSpecialPriceModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>🚀 送出合約申請等待 Admin 簽核</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
