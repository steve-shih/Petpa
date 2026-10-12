'use client';

import { useState, useEffect } from 'react';
import { kittens as initialKittens, catteries, type Kitten } from '@/lib/mock-data';

export default function SellerKittensPage() {
  const currentCattery = catteries[0];
  const [kittenList, setKittenList] = useState<Kitten[]>(initialKittens.filter(k => k.catteryId === currentCattery.catteryId));
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 從 API (MongoDB Atlas) 載入最新貓咪列表
  useEffect(() => {
    fetch(`/api/v1/kittens?catteryId=${currentCattery.catteryId}`)
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          setKittenList(json.data);
        }
      })
      .catch(() => {});
  }, [currentCattery.catteryId]);

  // 新增幼貓表單狀態
  const [newKitten, setNewKitten] = useState({
    name: '',
    breed: '英國短毛貓 (藍白)',
    gender: '母' as '公' | '母',
    birthday: '2026-07-01',
    fatherName: '威廉男爵 (CFA 冠軍組)',
    motherName: '露露 (純血種母)',
    price: 38000,
    microchipNumber: '',
    description: '',
    themeStyle: 'polaroid' as 'polaroid' | 'pedigree' | 'reel' | 'macaron',
    imagesText: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800\nhttps://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    traitsText: '🐾 天使呼嚕怪, 💖 極度親人討摸, 🧸 柔軟抱抱小貓',
    awardsText: '🏆 父親榮獲 CFA 2025 賽季分區冠軍, 🛡️ 通過 HCM/PKD 基因雙檢陰性',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfTitle: '📜 寵物買賣定型化契約與健康保證書.pdf',
  });

  const handleAddKitten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const images = newKitten.imagesText
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(Boolean);

    const traits = newKitten.traitsText
      .split(/[,，]/)
      .map(s => s.trim())
      .filter(Boolean);

    const awards = newKitten.awardsText
      .split(/[,，]/)
      .map(s => s.trim())
      .filter(Boolean);

    const kittenPayload: Kitten = {
      _id: `kit_${Date.now()}`,
      catteryId: currentCattery.catteryId,
      name: newKitten.name,
      breed: newKitten.breed,
      gender: newKitten.gender,
      birthday: newKitten.birthday,
      fatherName: newKitten.fatherName || '登錄種公',
      motherName: newKitten.motherName || '登錄種母',
      vaccines: ['三合一第一劑', '三合一第二劑'],
      dewormed: true,
      microchipNumber: newKitten.microchipNumber || `900138000${Math.floor(100000 + Math.random() * 900000)}`,
      price: Number(newKitten.price),
      status: 'Available',
      description: newKitten.description || '活潑親人健康純種幼貓，附國際血統與健康檢查。',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'],
      videoUrl: newKitten.videoUrl || undefined,
      themeStyle: newKitten.themeStyle,
      traits: traits.length > 0 ? traits : undefined,
      awards: awards.length > 0 ? awards : undefined,
      pdfUrl: newKitten.pdfUrl || undefined,
      pdfTitle: newKitten.pdfTitle || undefined,
    };

    try {
      await fetch('/api/v1/kittens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kittenPayload),
      });
    } catch (err) {
      console.warn('API POST error:', err);
    }

    setKittenList([kittenPayload, ...kittenList]);
    setShowAddModal(false);
    setLoading(false);
  };

  const updateStatus = (id: string, status: 'Available' | 'Reserved' | 'Sold') => {
    setKittenList(prev => prev.map(k => k._id === id ? { ...k, status } : k));
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 頂部標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>
            🐱 特寵幼貓相簿牆與影音管理
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
            特定寵物業許可字號：<strong style={{ color: 'var(--color-brand-600)' }}>{currentCattery.licenseNumber || '特寵業字第 A1130888 號'}</strong>
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', fontSize: 14 }}>
          + 新增幼貓展示卡片 (上傳照片牆與短片)
        </button>
      </div>

      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 20, color: '#334155', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          💡 <strong>樣式切換小技巧：</strong>每隻貓咪可自訂專屬展示風格（📷 拍立得日常實拍 / 👑 賽級尊榮金卡 / 🎞️ 膠捲動態短片 / 🧁 粉彩馬卡龍），在前台點擊即可放大查看全高清照片牆與生活短片！
        </div>
        <a href={`/shop/${currentCattery.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button className="btn-admin btn-admin-outline" style={{ padding: '4px 12px', fontSize: 12 }}>
            👁️ 前往專屬前台預覽 ➔
          </button>
        </a>
      </div>

      {/* 幼貓卡片管理網格 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {kittenList.map(kitten => {
          const firstImg = (kitten.images && kitten.images[0]) || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800';
          const styleBadge = {
            polaroid: { label: '📷 拍立得風格', color: '#B45309', bg: '#FEF3C7' },
            pedigree: { label: '👑 賽級金卡風格', color: '#D97706', bg: '#FEF9C3' },
            reel: { label: '🎞️ 膠捲短片風格', color: '#0284C7', bg: '#E0F2FE' },
            macaron: { label: '🧁 馬卡龍萌系', color: '#DB2777', bg: '#FCE7F3' },
          }[kitten.themeStyle || 'polaroid'];

          return (
            <div key={kitten._id} className="kpi-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', borderRadius: 16 }}>
              {/* 照片首頁 */}
              <div style={{ height: 200, width: '100%', position: 'relative', background: '#F1F5F9' }}>
                <img src={firstImg} alt={kitten.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 10, left: 10, background: styleBadge.bg, color: styleBadge.color, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
                  {styleBadge.label}
                </span>
                <span style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(0,0,0,0.65)', color: 'white', padding: '2px 8px', borderRadius: 6, fontSize: 11 }}>
                  📸 {kitten.images?.length || 1} 張照片 {kitten.videoUrl ? '· 🎬 附短片' : ''}
                </span>
                <span className={`badge ${kitten.status === 'Available' ? 'badge-hot' : 'badge-discount'}`} style={{ position: 'absolute', top: 10, right: 10, background: kitten.status === 'Available' ? '#10B981' : kitten.status === 'Reserved' ? '#F59E0B' : '#64748B' }}>
                  {{ Available: '開放尋家', Reserved: '已受預訂', Sold: '已交付' }[kitten.status]}
                </span>
              </div>

              {/* 內容資訊 */}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--color-text)' }}>{kitten.name}</h3>
                  <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--color-danger)', fontFamily: "'Outfit', sans-serif" }}>
                    NT$ {kitten.price.toLocaleString()}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  {kitten.breed} · {kitten.gender}孩 · 生日 {kitten.birthday}
                </div>

                {/* 特徵 Tags */}
                {kitten.traits && kitten.traits.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                    {kitten.traits.slice(0, 2).map((t, idx) => (
                      <span key={idx} style={{ background: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: 11.5, color: '#94A3B8', marginBottom: 12 }}>
                  晶片：{kitten.microchipNumber}
                </div>

                {/* 狀態切換按鈕組 */}
                <div style={{ display: 'flex', gap: 6, borderTop: '1px solid var(--color-border-light)', paddingTop: 12 }}>
                  {(['Available', 'Reserved', 'Sold'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(kitten._id, s)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 6,
                        border: kitten.status === s ? 'none' : '1px solid #CBD5E1',
                        background: kitten.status === s ? (s === 'Available' ? '#10B981' : s === 'Reserved' ? '#F59E0B' : '#64748B') : 'white',
                        color: kitten.status === s ? 'white' : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      {{ Available: '開放中', Reserved: '已預訂', Sold: '已交付' }[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 新增幼貓彈窗 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                ➕ 新增活體幼貓相簿牆與合約檔案
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddKitten}>
              {/* 卡片風格選擇 */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>
                  🎨 專屬展示卡片風格 *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { id: 'polaroid', label: '📷 拍立得實拍', desc: '文青紙膠帶' },
                    { id: 'pedigree', label: '👑 賽級黑金卡', desc: '尊榮名門證' },
                    { id: 'reel', label: '🎞️ 膠捲動態風', desc: '電影短片感' },
                    { id: 'macaron', label: '🧁 粉彩馬卡龍', desc: '夢幻萌甜系' },
                  ].map(st => (
                    <div
                      key={st.id}
                      onClick={() => setNewKitten({ ...newKitten, themeStyle: st.id as any })}
                      style={{
                        border: newKitten.themeStyle === st.id ? '2px solid var(--color-brand-500)' : '1px solid #CBD5E1',
                        borderRadius: 8,
                        padding: '8px 6px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: newKitten.themeStyle === st.id ? '#FFF7ED' : 'white',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 800 }}>{st.label}</div>
                      <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{st.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 基本資料 */}
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

              {/* 照片牆 URL 輸入 (多張) */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, marginBottom: 4, color: '#1E293B' }}>
                  📸 幼貓寫真照片牆 (支援多張 URL，以換行或逗號隔開) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newKitten.imagesText}
                  onChange={e => setNewKitten({ ...newKitten, imagesText: e.target.value })}
                  placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                  className="form-input"
                  style={{ fontSize: 12, fontFamily: 'monospace' }}
                />
              </div>

              {/* 短片 URL */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  🎬 幼貓玩耍動態短片 URL (mp4 或串流網址)
                </label>
                <input
                  type="url"
                  value={newKitten.videoUrl}
                  onChange={e => setNewKitten({ ...newKitten, videoUrl: e.target.value })}
                  placeholder="https://...mp4"
                  className="form-input"
                  style={{ fontSize: 12 }}
                />
              </div>

              {/* 特徵與賽事認證 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>個性特徵標籤 (以逗號隔開)</label>
                  <input type="text" value={newKitten.traitsText} onChange={e => setNewKitten({ ...newKitten, traitsText: e.target.value })} placeholder="天使呼嚕怪, 極度親人" className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>賽級與基因篩檢 (以逗號隔開)</label>
                  <input type="text" value={newKitten.awardsText} onChange={e => setNewKitten({ ...newKitten, awardsText: e.target.value })} placeholder="CFA 冠軍組, PKD陰性" className="form-input" />
                </div>
              </div>

              {/* 血統與晶片 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>父親名稱</label>
                  <input type="text" value={newKitten.fatherName} onChange={e => setNewKitten({ ...newKitten, fatherName: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>母親名稱</label>
                  <input type="text" value={newKitten.motherName} onChange={e => setNewKitten({ ...newKitten, motherName: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>晶片號碼</label>
                  <input type="text" value={newKitten.microchipNumber} onChange={e => setNewKitten({ ...newKitten, microchipNumber: e.target.value })} placeholder="900138..." className="form-input" />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>預定價格 (NT$) *</label>
                <input type="number" required value={newKitten.price} onChange={e => setNewKitten({ ...newKitten, price: Number(e.target.value) })} className="form-input" />
              </div>

              {/* PDF 定型化契約 */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: 12, borderRadius: 8, marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>
                  📄 寵物買賣定型化契約 / 健康保證書 PDF
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input type="url" value={newKitten.pdfUrl} onChange={e => setNewKitten({ ...newKitten, pdfUrl: e.target.value })} placeholder="PDF 網址" className="form-input" style={{ fontSize: 12 }} />
                  <input type="text" value={newKitten.pdfTitle} onChange={e => setNewKitten({ ...newKitten, pdfTitle: e.target.value })} placeholder="文件標題" className="form-input" style={{ fontSize: 12 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowAddModal(false)}>取消</button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '8px 24px', fontSize: 13 }}>
                  {loading ? '儲存中...' : '確定上架並同步至前台相簿牆'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
