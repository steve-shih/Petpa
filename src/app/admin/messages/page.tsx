'use client';

import { useState } from 'react';
import { products, categories, catteries, returnOrders, type Product, type SellerProductConfig } from '@/lib/mock-data';

export default function AdminMessagesPage() {
  // Aggregate notifications
  const [productProposals, setProductProposals] = useState(products.filter(p => p.reviewStatus === 'PendingReview'));
  const [categoryProposals, setCategoryProposals] = useState(categories.filter(c => c.reviewStatus === 'PendingReview'));
  const [pendingReturns, setPendingReturns] = useState(returnOrders.filter(r => r.status === 'PendingReview'));
  const [pendingSellers, setPendingSellers] = useState(catteries.filter(c => !c.isApproved));

  // Extract special price requests
  const initialPriceRequests: { product: Product; catteryId: string; config: SellerProductConfig }[] = [];
  products.forEach(p => {
    if (p.sellerConfigs) {
      Object.keys(p.sellerConfigs).forEach(cid => {
        if (p.sellerConfigs![cid].specialPriceStatus === 'PendingReview') {
          initialPriceRequests.push({ product: p, catteryId: cid, config: p.sellerConfigs![cid] });
        }
      });
    }
  });
  const [priceRequests, setPriceRequests] = useState(initialPriceRequests);

  const approvePriceRequest = (productId: string, catteryId: string) => {
    setPriceRequests(prev => prev.filter(req => !(req.product._id === productId && req.catteryId === catteryId)));
    alert('✅ 已核准特殊批發價合約！');
  };

  const approveProduct = (id: string) => {
    setProductProposals(prev => prev.filter(p => p._id !== id));
    alert('✅ 已核准商品上架！');
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', margin: '0 0 4px' }}>📬 訊息與審批通知中心</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>集中管理所有來自店家的商品提案、降價合約申請、新店家入駐與退貨單</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        
        {/* 1. 特殊合約降價申請 */}
        <div className="kpi-card">
          <h2 style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>🤝 特殊大量採購/降價合約申請</span>
            <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{priceRequests.length} 筆待辦</span>
          </h2>
          {priceRequests.length === 0 ? <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>目前無待審批的降價申請</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {priceRequests.map(req => {
                const cattery = catteries.find(c => c.catteryId === req.catteryId);
                return (
                  <div key={`${req.product._id}-${req.catteryId}`} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{req.product.title}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>🏠 申請店家：<strong style={{ color: '#0F172A' }}>{cattery?.name}</strong></div>
                    <div style={{ background: '#F8FAFC', padding: 8, borderRadius: 6, fontSize: 12, marginBottom: 10 }}>
                      <div><strong>申請門檻：</strong>超過 {req.config.bulkThresholdQty} 件</div>
                      <div><strong>期望特殊價：</strong><span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>NT${req.config.specialDiscountPrice}</span> (原底價 NT${req.product.sellingPrice})</div>
                      <div style={{ marginTop: 4, color: '#475569' }}><strong>原因：</strong>{req.config.specialPriceReason}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-primary" onClick={() => approvePriceRequest(req.product._id, req.catteryId)} style={{ padding: '6px 14px', fontSize: 12, flex: 1 }}>✅ 簽訂同意</button>
                      <button className="btn-admin-outline" onClick={() => approvePriceRequest(req.product._id, req.catteryId)} style={{ padding: '6px 14px', fontSize: 12, color: '#DC2626', borderColor: '#FECDD3' }}>❌ 駁回</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. 店家商品與分類提案 */}
        <div className="kpi-card">
          <h2 style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>📦 賣家提報新商品與分類</span>
            <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{productProposals.length + categoryProposals.length} 筆待辦</span>
          </h2>
          {productProposals.length === 0 && categoryProposals.length === 0 ? <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>目前無待審批的提案</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {productProposals.map(p => {
                const cattery = catteries.find(c => c.catteryId === p.proposedByCatteryId);
                return (
                  <div key={p._id} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 11, background: '#EFF6FF', color: '#1E40AF', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 4 }}>商品上架提案</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>🏠 提報店家：<strong style={{ color: '#0F172A' }}>{cattery?.name}</strong></div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-primary" onClick={() => approveProduct(p._id)} style={{ padding: '6px 14px', fontSize: 12, flex: 1 }}>✅ 允許上架</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. 退貨審批 */}
        <div className="kpi-card">
          <h2 style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>🔄 買家退貨與售後申請</span>
            <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{pendingReturns.length} 筆待辦</span>
          </h2>
          {pendingReturns.length === 0 ? <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>目前無退貨申請</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingReturns.map(r => (
                <div key={r._id} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.returnNumber}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>商品：{r.productTitle} (x{r.qty})</div>
                  <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 700, marginBottom: 8 }}>原因：{r.reason}</div>
                  <button className="btn-primary" onClick={() => setPendingReturns(prev => prev.filter(x => x._id !== r._id))} style={{ padding: '6px 14px', fontSize: 12, width: '100%' }}>✅ 同意退貨並入庫</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. 新註冊賣家審批 */}
        <div className="kpi-card">
          <h2 style={{ fontSize: 16, fontWeight: 800, borderBottom: '1px solid #E2E8F0', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>🚪 新店家入駐審核</span>
            <span style={{ background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{pendingSellers.length} 筆待辦</span>
          </h2>
          {pendingSellers.length === 0 ? <div style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: 20 }}>目前無待審核店家</div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingSellers.map(s => (
                <div key={s._id} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>類型：{s.sellerType === 'influencer' ? '📱 社群 KOL' : '🐱 實體貓舍'}</div>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>證照：{s.licenseNumber || '無'}</div>
                  <button className="btn-primary" onClick={() => setPendingSellers(prev => prev.filter(x => x._id !== s._id))} style={{ padding: '6px 14px', fontSize: 12, width: '100%' }}>✅ 核准並開通賣場</button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
