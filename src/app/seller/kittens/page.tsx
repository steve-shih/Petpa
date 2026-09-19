'use client';

import { useState } from 'react';
import { kittens as initialKittens, catteries, type Kitten } from '@/lib/mock-data';

export default function SellerKittensPage() {
  const currentCattery = catteries[0];
  const [kittenList, setKittenList] = useState<Kitten[]>(initialKittens.filter(k => k.catteryId === currentCattery.catteryId));
  const [showAddModal, setShowAddModal] = useState(false);

  // New kitten form state
  const [newKitten, setNewKitten] = useState({
    name: '',
    breed: '英國短毛貓 (藍白)',
    gender: '母' as '公' | '母',
    birthday: '2026-07-01',
    fatherName: '',
    motherName: '',
    price: 35000,
    microchipNumber: '',
    description: '',
    pdfUrl: '',
    pdfTitle: '',
  });

  const handleAddKitten = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Kitten = {
      _id: `kit_${Date.now()}`,
      catteryId: currentCattery.catteryId,
      name: newKitten.name,
      breed: newKitten.breed,
      gender: newKitten.gender,
      birthday: newKitten.birthday,
      fatherName: newKitten.fatherName || '登錄種公',
      motherName: newKitten.motherName || '登錄種母',
      vaccines: ['三合一第一劑'],
      dewormed: true,
      microchipNumber: newKitten.microchipNumber || `900138000${Math.floor(100000 + Math.random() * 900000)}`,
      price: Number(newKitten.price),
      status: 'Available',
      description: newKitten.description || '可愛健康的貓咪，等待有緣家長引退帶回。',
      images: ['/images/kitten-01.jpg'],
      pdfUrl: newKitten.pdfUrl || undefined,
      pdfTitle: newKitten.pdfTitle || (newKitten.pdfUrl ? '📜 寵物買賣定型化契約書.pdf' : undefined),
    };

    setKittenList([created, ...kittenList]);
    setShowAddModal(false);
    setNewKitten({
      name: '',
      breed: '英國短毛貓 (藍白)',
      gender: '母',
      birthday: '2026-07-01',
      fatherName: '',
      motherName: '',
      price: 35000,
      microchipNumber: '',
      description: '',
      pdfUrl: '',
      pdfTitle: '',
    });
  };

  const updateStatus = (id: string, status: 'Available' | 'Reserved' | 'Sold') => {
    setKittenList(prev => prev.map(k => k._id === id ? { ...k, status } : k));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🐱 幼貓活體與合約文件管理</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
            特定寵物業字號：<strong style={{ color: 'var(--color-brand-600)' }}>{currentCattery.licenseNumber || '特寵業字第 A1130888 號'}</strong>
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', fontSize: 14 }}>
          + 新增活體幼貓卡片與合約
        </button>
      </div>

      {!currentCattery.enableKittens && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 20, color: '#92400E', fontSize: 13 }}>
          ⚠️ 提示：平台管理員目前尚未為您的貓舍啟用「活體專區」。您在此新增的貓咪資訊完成儲存後，將在開啟後自動展示於前台。
        </div>
      )}

      {/* Kitten Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {kittenList.map(kitten => (
          <div key={kitten._id} className="kpi-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
            {/* Image Placeholder */}
            <div style={{
              height: 180,
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 54,
              position: 'relative',
            }}>
              🐱
              <span className={`status-badge status-${kitten.status === 'Available' ? 'completed' : kitten.status === 'Reserved' ? 'paid' : 'pending'}`} style={{ position: 'absolute', top: 12, right: 12 }}>
                {{ Available: '✨ 待預定 (尋家)', Reserved: '🔒 已預訂', Sold: '🏠 已找到新家' }[kitten.status]}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--color-text)' }}>{kitten.name}</h3>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>
                  NT$ {kitten.price.toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span className="spec-tag" style={{ background: '#F1F5F9', color: '#475569' }}>{kitten.breed}</span>
                <span className="spec-tag" style={{ background: '#F1F5F9', color: '#475569' }}>{kitten.gender}孩</span>
                <span className="spec-tag" style={{ background: '#FEF3C7', color: '#D97706' }}>🎂 {kitten.birthday}</span>
              </div>

              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, background: 'var(--color-bg)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                <div><strong>父親：</strong>{kitten.fatherName}</div>
                <div><strong>母親：</strong>{kitten.motherName}</div>
                <div><strong>晶片號碼：</strong><code style={{ fontSize: 11 }}>{kitten.microchipNumber}</code></div>
                <div><strong>驅蟲與疫苗：</strong>{kitten.dewormed ? '已完成驅蟲' : '未驅蟲'} · {kitten.vaccines.join('/')}</div>
              </div>

              {/* PDF 檢視小區 */}
              {kitten.pdfUrl && (
                <div style={{ marginTop: 10, background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '6px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#1E40AF', fontWeight: 700 }}>📄 PDF 定型化契約檔</span>
                  <a href={kitten.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>預覽 →</a>
                </div>
              )}

              {/* Status Switcher */}
              <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
                <button
                  onClick={() => updateStatus(kitten._id, 'Available')}
                  style={{ flex: 1, padding: '6px 0', fontSize: 11.5, fontWeight: 700, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: kitten.status === 'Available' ? '#ECFDF5' : 'white', color: kitten.status === 'Available' ? '#047857' : 'var(--color-text-secondary)' }}
                >
                  待預定
                </button>
                <button
                  onClick={() => updateStatus(kitten._id, 'Reserved')}
                  style={{ flex: 1, padding: '6px 0', fontSize: 11.5, fontWeight: 700, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: kitten.status === 'Reserved' ? '#FEF3C7' : 'white', color: kitten.status === 'Reserved' ? '#B45309' : 'var(--color-text-secondary)' }}
                >
                  已預訂
                </button>
                <button
                  onClick={() => updateStatus(kitten._id, 'Sold')}
                  style={{ flex: 1, padding: '6px 0', fontSize: 11.5, fontWeight: 700, borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: kitten.status === 'Sold' ? '#F1F5F9' : 'white', color: kitten.status === 'Sold' ? '#475569' : 'var(--color-text-secondary)' }}
                >
                  已售出
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Kitten Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 540 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>➕ 新增活體幼貓展示檔案與合約</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddKitten}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>貓咪呼名 / 小名 *</label>
                  <input type="text" required value={newKitten.name} onChange={e => setNewKitten({ ...newKitten, name: e.target.value })} placeholder="例如：雪球" className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>品種花色 *</label>
                  <input type="text" required value={newKitten.breed} onChange={e => setNewKitten({ ...newKitten, breed: e.target.value })} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>性別 *</label>
                  <select value={newKitten.gender} onChange={e => setNewKitten({ ...newKitten, gender: e.target.value as any })} className="form-input">
                    <option value="母">母 (Girl)</option>
                    <option value="公">公 (Boy)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>出生日期 *</label>
                  <input type="date" required value={newKitten.birthday} onChange={e => setNewKitten({ ...newKitten, birthday: e.target.value })} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>父親登錄血統名稱</label>
                  <input type="text" value={newKitten.fatherName} onChange={e => setNewKitten({ ...newKitten, fatherName: e.target.value })} placeholder="爸爸賽級名稱" className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>母親登錄血統名稱</label>
                  <input type="text" value={newKitten.motherName} onChange={e => setNewKitten({ ...newKitten, motherName: e.target.value })} placeholder="媽媽登錄名稱" className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>預定價格 (NT$) *</label>
                  <input type="number" required value={newKitten.price} onChange={e => setNewKitten({ ...newKitten, price: Number(e.target.value) })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>微晶片號碼</label>
                  <input type="text" value={newKitten.microchipNumber} onChange={e => setNewKitten({ ...newKitten, microchipNumber: e.target.value })} placeholder="900138..." className="form-input" />
                </div>
              </div>

              {/* PDF 定型化契約欄位 (可放可不放) */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: 12, borderRadius: 8, marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>📄 寵物買賣定型化契約 / 健康保證書 PDF 檔 (可選)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input
                    type="url"
                    value={newKitten.pdfUrl}
                    onChange={e => setNewKitten({ ...newKitten, pdfUrl: e.target.value })}
                    placeholder="PDF 網址 (可不填)"
                    className="form-input"
                    style={{ fontSize: 12 }}
                  />
                  <input
                    type="text"
                    value={newKitten.pdfTitle}
                    onChange={e => setNewKitten({ ...newKitten, pdfTitle: e.target.value })}
                    placeholder="標題 (例: 定型化契約書.pdf)"
                    className="form-input"
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>貓咪性格與詳細介紹</label>
                <textarea value={newKitten.description} onChange={e => setNewKitten({ ...newKitten, description: e.target.value })} rows={3} className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowAddModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>確定上架展示</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
