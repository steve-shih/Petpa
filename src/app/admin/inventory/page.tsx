'use client';

import { useState } from 'react';
import { products as initialProducts, inventoryLogs as initialLogs, categories, catteries, type Product, type InventoryLog } from '@/lib/mock-data';

export default function AdminInventoryPage() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [logsList, setLogsList] = useState<InventoryLog[]>(initialLogs);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [adjustForm, setAdjustForm] = useState({
    qtyChange: 50,
    type: 'Inbound' as 'Inbound' | 'Outbound' | 'ReturnRestock' | 'Adjustment',
    reason: '進貨入庫補貨',
  });

  const openAdjustModal = (p: Product) => {
    setSelectedProduct(p);
    setShowAdjustmentModal(true);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const delta = adjustForm.type === 'Outbound' ? -Math.abs(adjustForm.qtyChange) : Math.abs(adjustForm.qtyChange);
    const before = selectedProduct.stock;
    const after = Math.max(0, before + delta);

    // 1. 更新商品庫存數量
    setProductsList(prev => prev.map(p => p._id === selectedProduct._id ? { ...p, stock: after } : p));

    // 2. 寫入進銷存 (ERP) 異動日誌
    const newLog: InventoryLog = {
      _id: `inv_${Date.now()}`,
      productId: selectedProduct._id,
      productTitle: selectedProduct.title,
      catteryId: selectedProduct.targetCatteries?.[0] || 'all',
      type: adjustForm.type,
      qtyChange: delta,
      beforeStock: before,
      afterStock: after,
      reason: adjustForm.reason,
      operatorRole: 'super_admin',
      operatorName: '平台總管理員 (SuperAdmin)',
      createdAt: new Date().toISOString(),
    };

    setLogsList([newLog, ...logsList]);
    setShowAdjustmentModal(false);
    alert(`✅ 已成功完成庫存調整！\n商品：${selectedProduct.title}\n異動數量：${delta > 0 ? '+' : ''}${delta}\n調整後最新庫存：${after} 件`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>🏬 平台全站進銷存 (ERP) 與庫存異動紀錄</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>管理員全權掌管進貨、銷貨扣減、退貨入庫與盤點補貨庫存流水帳</p>
        </div>
      </div>

      {/* 庫存預警 KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div className="kpi-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <div style={{ fontSize: 12, color: '#1E40AF', fontWeight: 600 }}>全站品項總數</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1D4ED8', marginTop: 4 }}>{productsList.length} 項</div>
        </div>
        <div className="kpi-card" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
          <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>低庫存預警 (&lt;100 件)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#D97706', marginTop: 4 }}>
            {productsList.filter(p => p.stock < 100).length} 項商品
          </div>
        </div>
        <div className="kpi-card" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <div style={{ fontSize: 12, color: '#047857', fontWeight: 600 }}>本月累計庫存進貨入庫</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 4 }}>+1,450 件</div>
        </div>
      </div>

      {/* 商品即時庫存清單 */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto', marginBottom: 24 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>📦 即時商品庫存表與進銷存微調</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>商品名稱</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>分類</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>成本</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>售價</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>目前庫存狀態</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map(p => {
              const cat = categories.find(c => c._id === p.categoryId);
              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{p.title}</td>
                  <td style={{ padding: '12px' }}>{cat?.icon} {cat?.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#64748B' }}>NT${p.costPrice}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700 }}>NT${p.sellingPrice}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span className="badge" style={{ background: p.stock < 100 ? '#FEF3C7' : '#ECFDF5', color: p.stock < 100 ? '#D97706' : '#047857', fontWeight: 800, padding: '4px 10px' }}>
                      {p.stock} 件 {p.stock < 100 ? '⚠️ 低庫存' : '🟢 充足'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button className="btn-admin btn-admin-primary" onClick={() => openAdjustModal(p)} style={{ padding: '4px 12px', fontSize: 12 }}>
                      ⚙️ 調整/補貨庫存
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 進銷存 (ERP) 歷史異動流水帳 */}
      <div className="kpi-card" style={{ padding: 0, overflow: 'auto' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-light)' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>📜 進銷存 (ERP) 異動歷史流水紀錄</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>異動時間</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>異動類型</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>商品名稱</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>數量變更</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>異動前後</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>原因說明與操作者</th>
            </tr>
          </thead>
          <tbody>
            {logsList.map(log => (
              <tr key={log._id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '10px 12px', color: '#64748B', fontFamily: 'monospace' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span className="badge" style={{
                    background: log.type === 'Inbound' ? '#ECFDF5' : log.type === 'Outbound' ? '#FEE2E2' : '#EFF6FF',
                    color: log.type === 'Inbound' ? '#047857' : log.type === 'Outbound' ? '#DC2626' : '#1D4ED8',
                    fontSize: 11,
                  }}>
                    {{ Inbound: '📥 採購進貨', Outbound: '📤 銷貨出庫', ReturnRestock: '🔄 退貨入庫', Adjustment: '⚙️ 盤點微調' }[log.type]}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{log.productTitle}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 800, color: log.qtyChange > 0 ? '#059669' : '#DC2626' }}>
                  {log.qtyChange > 0 ? `+${log.qtyChange}` : log.qtyChange}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B' }}>
                  {log.beforeStock} → <strong style={{ color: 'var(--color-text)' }}>{log.afterStock}</strong>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <div>{log.reason}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>👤 {log.operatorName}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {showAdjustmentModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '100%', maxWidth: 460 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>⚙️ 進銷存庫存調整與進貨入庫</h2>
              <button onClick={() => setShowAdjustmentModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSaveAdjustment}>
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12.5, lineHeight: 1.6 }}>
                <div><strong>商品名稱：</strong>{selectedProduct.title}</div>
                <div><strong>目前系統庫存：</strong><strong style={{ color: '#059669' }}>{selectedProduct.stock} 件</strong></div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>異動類型 *</label>
                <select value={adjustForm.type} onChange={e => setAdjustForm({ ...adjustForm, type: e.target.value as any })} className="form-input">
                  <option value="Inbound">📥 採購進貨入庫 (庫存增加)</option>
                  <option value="Outbound">📤 手動銷貨出庫 (庫存扣減)</option>
                  <option value="ReturnRestock">🔄 退貨庫存補回 (庫存增加)</option>
                  <option value="Adjustment">⚙️ 盤點差距微調</option>
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>異動數量 *</label>
                <input type="number" required value={adjustForm.qtyChange} onChange={e => setAdjustForm({ ...adjustForm, qtyChange: Number(e.target.value) })} className="form-input" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>原因說明與進貨單號 *</label>
                <input type="text" required value={adjustForm.reason} onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })} placeholder="例：9月份第二批進貨抵達 200 包" className="form-input" />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn-admin btn-admin-outline" onClick={() => setShowAdjustmentModal(false)}>取消</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13.5 }}>🚀 儲存並寫入 ERP 異動日誌</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
