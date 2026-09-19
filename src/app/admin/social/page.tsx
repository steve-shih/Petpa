'use client';

import { useState } from 'react';
import { products, categories } from '@/lib/mock-data';

const templates = [
  { id: 'fb_feed', platform: 'Facebook', type: '動態貼文', width: 1200, height: 630, ratio: '1.91:1' },
  { id: 'fb_story', platform: 'Facebook', type: '限時動態', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'fb_cover', platform: 'Facebook', type: '封面照片', width: 820, height: 312, ratio: '2.63:1' },
  { id: 'ig_square', platform: 'Instagram', type: '方形貼文', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'ig_portrait', platform: 'Instagram', type: '直式貼文', width: 1080, height: 1350, ratio: '4:5' },
  { id: 'ig_story', platform: 'Instagram', type: '限時動態', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'line_rich', platform: 'LINE', type: '圖文訊息', width: 1040, height: 1040, ratio: '1:1' },
];

export default function AdminSocialPage() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const cat = categories.find(c => c._id === selectedProduct.categoryId);
  const previewScale = Math.min(400 / selectedTemplate.width, 400 / selectedTemplate.height);
  const previewW = Math.round(selectedTemplate.width * previewScale);
  const previewH = Math.round(selectedTemplate.height * previewScale);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>📱 社群行銷快速製圖</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Left Panel */}
        <div>
          <div className="kpi-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>1️⃣ 選擇商品</h3>
            <select
              value={selectedProduct._id}
              onChange={e => setSelectedProduct(products.find(p => p._id === e.target.value)!)}
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #d9d9d9', borderRadius: 8, fontSize: 13 }}
            >
              {products.filter(p => p.isActive).map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="kpi-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>2️⃣ 選擇平台與尺寸</h3>
            {templates.map(t => (
              <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, border: `2px solid ${selectedTemplate.id === t.id ? '#1890FF' : '#f0f0f0'}`, marginBottom: 6, cursor: 'pointer', background: selectedTemplate.id === t.id ? '#e6f7ff' : 'white', transition: 'all 0.2s', fontSize: 13 }}>
                <input type="radio" name="tpl" checked={selectedTemplate.id === t.id} onChange={() => setSelectedTemplate(t)} style={{ accentColor: '#1890FF' }} />
                <span style={{ fontWeight: 500 }}>{t.platform}</span>
                <span style={{ color: '#9ca3af' }}>{t.type}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{t.width}×{t.height}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ flex: 1, padding: '10px 0', background: '#1890FF', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              📥 下載圖片
            </button>
            <button style={{ flex: 1, padding: '10px 0', background: '#52c41a', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              📦 批次匯出 ZIP
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="kpi-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, alignSelf: 'flex-start' }}>
            3️⃣ 即時預覽 — {selectedTemplate.platform} {selectedTemplate.type} ({selectedTemplate.width}×{selectedTemplate.height})
          </h3>

          <div style={{
            width: previewW,
            height: previewH,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            position: 'relative',
            background: `linear-gradient(135deg, ${selectedProduct.categoryId === 'cat_food' ? '#fef3c7, #fde68a' : selectedProduct.categoryId === 'cat_litter' ? '#e0f2fe, #bae6fd' : selectedProduct.categoryId === 'supplement' ? '#fdf2f8, #fbcfe8' : '#fff7ed, #fed7aa'})`,
          }}>
            {/* Logo watermark */}
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🐾</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>Petpa 寵物補給站</span>
            </div>

            {/* Product Icon */}
            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: Math.min(previewW, previewH) * 0.25 }}>
              {cat?.icon || '📦'}
            </div>

            {/* Product Info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)', padding: '16px 20px', color: 'white' }}>
              <div style={{ fontSize: Math.max(12, previewW * 0.035), fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
                {selectedProduct.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: Math.max(16, previewW * 0.05), fontWeight: 700, color: '#fbbf24' }}>
                  NT$ {selectedProduct.sellingPrice}
                </span>
                <span style={{ fontSize: Math.max(11, previewW * 0.03), textDecoration: 'line-through', opacity: 0.6 }}>
                  NT$ {selectedProduct.originalPrice}
                </span>
                <span style={{ background: '#ef4444', padding: '2px 8px', borderRadius: 4, fontSize: Math.max(10, previewW * 0.025), fontWeight: 600 }}>
                  省 NT${selectedProduct.originalPrice - selectedProduct.sellingPrice}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>
            尺寸：{selectedTemplate.width} × {selectedTemplate.height} px · 比例 {selectedTemplate.ratio}
          </div>
        </div>
      </div>
    </div>
  );
}
