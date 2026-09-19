'use client';

import { useState } from 'react';
import { categories } from '@/lib/mock-data';

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(categories);
  const [showModal, setShowModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '📦' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>🗂️ 商品分類管理</h1>
        <button onClick={() => setShowModal(true)} style={{ background: '#1890FF', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          + 新增分類
        </button>
      </div>

      <div className="kpi-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280', width: 60 }}>排序</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280', width: 60 }}>圖示</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>分類名稱</th>
              <th style={{ padding: 12, textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Slug</th>
              <th style={{ padding: 12, textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>預設分潤率</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>類型</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>狀態</th>
              <th style={{ padding: 12, textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {cats.sort((a, b) => a.sortOrder - b.sortOrder).map(cat => (
              <tr key={cat._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: 12, textAlign: 'center', color: '#9ca3af' }}>{cat.sortOrder}</td>
                <td style={{ padding: 12, textAlign: 'center', fontSize: 22 }}>{cat.icon}</td>
                <td style={{ padding: 12, fontWeight: 600 }}>{cat.name}</td>
                <td style={{ padding: 12, fontFamily: 'monospace', color: '#6b7280', fontSize: 13 }}>{cat.slug}</td>
                <td style={{ padding: 12, textAlign: 'right', fontWeight: 500 }}>{(cat.defaultCommissionRate * 100).toFixed(1)}%</td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: cat.isSystem ? '#dbeafe' : '#fef3c7', color: cat.isSystem ? '#1e40af' : '#92400e' }}>
                    {cat.isSystem ? '系統內建' : '自定義'}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: cat.isActive ? '#10b981' : '#d1d5db' }} />
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', marginRight: 4 }}>編輯</button>
                  {!cat.isSystem && (
                    <button style={{ background: 'none', border: '1px solid #ffccc7', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#ff4d4f' }}>刪除</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: 12, padding: 28, width: 420 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>🗂️ 新增自定義分類</h2>
            {[
              { label: '分類名稱', key: 'name' as const, ph: '如：凍乾零食' },
              { label: 'Slug (URL 標籤)', key: 'slug' as const, ph: '如：freeze-dried' },
              { label: '圖示 (Emoji)', key: 'icon' as const, ph: '🥩' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#6b7280' }}>{f.label}</label>
                <input value={newCat[f.key]} onChange={e => setNewCat(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 14 }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 20px', border: '1px solid #d9d9d9', borderRadius: 8, background: 'white', cursor: 'pointer' }}>取消</button>
              <button onClick={() => { setCats(p => [...p, { _id: `custom_${Date.now()}`, name: newCat.name, slug: newCat.slug, icon: newCat.icon, sortOrder: p.length + 1, defaultCommissionRate: 0.15, isSystem: false, isActive: true }]); setShowModal(false); setNewCat({ name: '', slug: '', icon: '📦' }); }} style={{ padding: '8px 20px', border: 'none', borderRadius: 8, background: '#1890FF', color: 'white', cursor: 'pointer', fontWeight: 600 }}>新增分類</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
