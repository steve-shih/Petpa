'use client';

import { useState } from 'react';
import { products as initialProducts, categories, catteries, profitSplitConfig, type Product } from '@/lib/mock-data';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // 新增/編輯商品表單狀態
  const [form, setForm] = useState({
    title: '',
    categoryId: 'cat_food',
    costPrice: 200,
    sellingPrice: 450,
    originalPrice: 550,
    taxRate: 5,
    stock: 100,
    pdfUrl: '',
    pdfTitle: '',
    targetCatteries: ['all'] as string[],
  });

  const filtered = productList.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.categoryId === filterCat;
    return matchSearch && matchCat && p.isActive;
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c._id === form.categoryId);
    const taxAmt = Math.round(form.sellingPrice * (form.taxRate / 100) * 10) / 10;
    const netProf = Math.round((form.sellingPrice - form.costPrice - taxAmt) * 10) / 10;
    const margin = Math.round((netProf / form.sellingPrice) * 1000) / 1000;

    const newProd: Product = {
      _id: `prod_${Date.now()}`,
      title: form.title,
      categoryId: form.categoryId,
      categorySlug: cat?.slug || 'cat-food',
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      originalPrice: Number(form.originalPrice),
      taxRate: form.taxRate / 100,
      taxAmount: taxAmt,
      netProfit: netProf,
      marginRate: margin,
      stock: Number(form.stock),
      images: ['/images/food-combo.jpg'],
      pdfUrl: form.pdfUrl || undefined,
      pdfTitle: form.pdfTitle || (form.pdfUrl ? '📄 商品相關檢驗/合約文件.pdf' : undefined),
      targetCatteries: form.targetCatteries.length === 0 ? ['all'] : form.targetCatteries,
      specifications: [{ name: '備註', value: '管理員新增商品' }],
      isRecommended: true,
      isActive: true,
    };

    setProductList([newProd, ...productList]);
    setShowModal(false);
    const targets = newProd.targetCatteries || ['all'];
    alert(`✅ 已成功創建商品【${newProd.title}】！\n已同步分配至 ${targets.includes('all') ? '所有合作貓舍' : targets.length + ' 家貓舍'} 展示上架。`);
    setForm({
      title: '',
      categoryId: 'cat_food',
      costPrice: 200,
      sellingPrice: 450,
      originalPrice: 550,
      taxRate: 5,
      stock: 100,
      pdfUrl: '',
      pdfTitle: '',
      targetCatteries: ['all'],
    });
  };

  const toggleTargetCattery = (catteryId: string) => {
    setForm(prev => {
      if (catteryId === 'all') return { ...prev, targetCatteries: ['all'] };
      let updated = prev.targetCatteries.filter(id => id !== 'all');
      if (updated.includes(catteryId)) {
        updated = updated.filter(id => id !== catteryId);
      } else {
        updated.push(catteryId);
      }
      if (updated.length === 0) updated = ['all'];
      return { ...prev, targetCatteries: updated };
    });
  };

  const approveProduct = (id: string) => {
    setProductList(prev => prev.map(p => p._id === id ? { ...p, reviewStatus: 'Approved', isActive: true } : p));
  };

  const rejectProduct = (id: string) => {
    setProductList(prev => prev.map(p => p._id === id ? { ...p, reviewStatus: 'Rejected', isActive: false } : p));
  };

  const pendingReviews = productList.filter(p => p.reviewStatus === 'PendingReview');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>📦 全站商品、種類合約與店家提報審核</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>由管理員決定商品上架至哪些合作貓舍、附帶 PDF 合約，並審核店家提報之商品與種類</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '9px 20px', fontSize: 13.5 }}>
          ➕ 建立新商品與指定上架店家
        </button>
      </div>

      {/* 待審核案件通知區 */}
      {pendingReviews.length > 0 && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#B45309', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⏳ 有 {pendingReviews.length} 筆合作店家提出的商品修改／新增申請待您審核：
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pendingReviews.map(p => {
              const proposingCattery = catteries.find(c => c.catteryId === p.proposedByCatteryId);
              return (
                <div key={p._id} style={{ background: 'white', border: '1px solid #FDE68A', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title} <span style={{ color: '#D97706', fontSize: 12 }}>(建議售價: NT${p.sellingPrice})</span></div>
                    <div style={{ fontSize: 11.5, color: '#78350F', marginTop: 2 }}>
                      🏠 提報店家：<strong>{proposingCattery?.name || p.proposedByCatteryId}</strong>
                      {p.pdfUrl && <span style={{ marginLeft: 8, color: '#2563EB', fontWeight: 700 }}>📄 含 PDF 檢驗檔</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-admin btn-admin-outline" onClick={() => rejectProduct(p._id)} style={{ color: '#DC2626', borderColor: '#FECDD3', padding: '4px 12px', fontSize: 12 }}>
                      ❌ 退回
                    </button>
                    <button className="btn-admin btn-admin-primary" onClick={() => approveProduct(p._id)} style={{ padding: '4px 14px', fontSize: 12 }}>
                      ✅ 核准上架
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 搜尋商品名稱..." style={{ flex: 1, padding: '8px 14px', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 14 }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '8px 14px', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 14 }}>
          <option value="all">全部分類</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>商品名稱與 PDF 合約</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>上架店家 (Admin 決定)</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>成本</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>售價</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>淨利潤</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>庫存</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>三方利潤預覽</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const cat = categories.find(c => c._id === p.categoryId);
              const platformFee = Math.round(p.netProfit * profitSplitConfig.platformRate / 100 * 10) / 10;
              const sellerFee = Math.round(p.netProfit * profitSplitConfig.sellerRate / 100 * 10) / 10;
              const operatorFee = Math.round((p.netProfit - platformFee - sellerFee) * 10) / 10;
              const isAllStores = !p.targetCatteries || p.targetCatteries.includes('all');

              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '10px 12px', maxWidth: 220 }}>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{cat?.icon} {cat?.name}</div>
                    {p.pdfUrl && (
                      <div style={{ marginTop: 4 }}>
                        <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2563EB', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          📄 {p.pdfTitle || '檢視附件PDF.pdf'}
                        </a>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {isAllStores ? (
                      <span className="badge" style={{ background: '#ECFDF5', color: '#047857', fontSize: 11 }}>🌐 全站所有貓舍上架</span>
                    ) : (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {p.targetCatteries?.map(id => {
                          const targetCat = catteries.find(c => c.catteryId === id || c.slug === id);
                          return (
                            <span key={id} style={{ background: '#FEF3C7', color: '#D97706', fontSize: 10.5, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                              🏠 {targetCat?.name || id}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6b7280' }}>NT${p.costPrice}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>NT${p.sellingPrice}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>NT${p.netProfit}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{p.stock}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 11, lineHeight: 1.8 }}>
                    <span style={{ color: '#3b82f6' }}>🏢 ${platformFee}</span> ·{' '}
                    <span style={{ color: '#f59e0b' }}>🐱 ${sellerFee}</span> ·{' '}
                    <span style={{ color: '#10b981' }}>👨‍💼 ${operatorFee}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {p.reviewStatus === 'PendingReview' ? (
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button onClick={() => approveProduct(p._id)} className="btn-admin btn-admin-primary" style={{ padding: '3px 8px', fontSize: 11 }}>✅ 核准</button>
                        <button onClick={() => rejectProduct(p._id)} className="btn-admin btn-admin-outline" style={{ padding: '3px 8px', fontSize: 11, color: '#DC2626' }}>❌ 退回</button>
                      </div>
                    ) : (
                      <button onClick={() => setShowModal(true)} style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>編輯</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, width: 560, maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📦 新增商品與指定店家上架</h2>

            <form onSubmit={handleSaveProduct}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>商品名稱 *</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="例：渴望無穀有機鮮肉貓糧 (1.5kg)" className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>商品分類</label>
                  <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} className="form-input">
                    {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>庫存數量</label>
                  <input type="number" required value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>進貨成本 (NT$)</label>
                  <input type="number" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>正式售價 (NT$)</label>
                  <input type="number" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: Number(e.target.value) })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>劃線原價 (NT$)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })} className="form-input" />
                </div>
              </div>

              {/* PDF 文件與合約設定塊 */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: 12, borderRadius: 8, marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>📄 附帶 PDF 合約 / 檢驗報告文件 (可選)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input
                    type="url"
                    value={form.pdfUrl}
                    onChange={e => setForm({ ...form, pdfUrl: e.target.value })}
                    placeholder="https://.../contract.pdf"
                    className="form-input"
                    style={{ fontSize: 12 }}
                  />
                  <input
                    type="text"
                    value={form.pdfTitle}
                    onChange={e => setForm({ ...form, pdfTitle: e.target.value })}
                    placeholder="顯示名稱 (如：SGS無毒檢驗報告.pdf)"
                    className="form-input"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>

              {/* 決定上架至哪些配合店家 */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                  🏬 管理員決定：上架至哪些合作貓舍頁面？
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => toggleTargetCattery('all')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: '1px solid',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: form.targetCatteries.includes('all') ? 'var(--color-primary)' : 'white',
                      color: form.targetCatteries.includes('all') ? 'white' : 'var(--color-text-secondary)',
                      borderColor: form.targetCatteries.includes('all') ? 'var(--color-primary)' : '#d9d9d9',
                    }}
                  >
                    🌐 全站所有貓舍 (預設)
                  </button>
                  {catteries.map(cat => {
                    const isSelected = form.targetCatteries.includes(cat.catteryId);
                    return (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => toggleTargetCattery(cat.catteryId)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 20,
                          border: '1px solid',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: isSelected ? '#F97316' : 'white',
                          color: isSelected ? 'white' : 'var(--color-text)',
                          borderColor: isSelected ? '#F97316' : '#d9d9d9',
                        }}
                      >
                        🐱 {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin btn-admin-outline">取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>🚀 確定發布商品</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

