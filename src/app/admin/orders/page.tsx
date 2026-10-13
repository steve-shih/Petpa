'use client';

import { useState, useMemo, useEffect } from 'react';
import { orders as initialOrders, type Order } from '@/lib/mock-data';
import { envFeatures, isCapabilityReady, capabilityLabel } from '@/lib/env';

// 展示站：可手動派車、手填模擬單號；正式站：必須等物流 API 自動取號
const manualDispatchAllowed = envFeatures.mockLogisticsWebhook || isCapabilityReady('logisticsApi');

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<Order[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [logisticsProviderInput, setLogisticsProviderInput] = useState('黑貓宅急便 (溫控冷藏專車)');

  // 讀取前台買家剛下單之訂單
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const buyerOrders = localStorage.getItem('petpa_buyer_orders');
      if (buyerOrders) {
        try {
          const parsed = JSON.parse(buyerOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // 合併新訂單
            setOrderList(prev => {
              const existingIds = new Set(prev.map(o => o.orderNumber));
              const newItems: Order[] = parsed
                .filter((p: any) => !existingIds.has(p.orderNumber))
                .map((p: any) => ({
                  _id: p._id,
                  orderNumber: p.orderNumber,
                  catteryId: p.catteryId || 'meow_house',
                  catteryName: '喵喵萌寵專業貓舍',
                  customerName: p.buyerName || '陳小美',
                  customerPhone: p.buyerPhone || '0988-123-456',
                  shippingAddress: p.buyerAddress || '台北市信義區忠孝東路五段 100 號',
                  totalAmount: p.totalAmount || 1850,
                  platformProfit: Math.round((p.totalAmount || 1850) * 0.15),
                  sellerProfit: Math.round((p.totalAmount || 1850) * 0.85),
                  costPrice: Math.round((p.totalAmount || 1850) * 0.6),
                  status: 'Paid',
                  logisticsStatus: p.logisticsStatus || 'PendingShipment',
                  logisticsProvider: p.logisticsProvider || '黑貓宅急便',
                  items: [{ productId: 'prod_01', title: '頂級凍乾原肉主食糧 (800g)', qty: 1, sellingPrice: p.totalAmount || 1850 }],
                  createdAt: p.createdAt || new Date().toISOString(),
                }));
              return [...newItems, ...prev];
            });
          }
        } catch (e) {}
      }
    }
  }, []);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orderList;
    return orderList.filter(o => {
      const lStatus = o.logisticsStatus || (o.status === 'Completed' ? 'Completed' : o.status === 'Shipped' ? 'InTransit' : 'PendingShipment');
      return lStatus === filterStatus;
    });
  }, [orderList, filterStatus]);

  // 管理員控制物流狀態 (路上、到貨、完成)
  const updateLogisticsStatus = (
    orderId: string, 
    newStatus: 'PendingShipment' | 'InTransit' | 'Delivered' | 'Completed',
    customTracking?: string,
    customProvider?: string
  ) => {
    setOrderList(prev => prev.map(o => {
      if (o._id !== orderId) return o;
      const updated = {
        ...o,
        logisticsStatus: newStatus,
        status: (newStatus === 'Completed' ? 'Completed' : newStatus === 'InTransit' ? 'Shipped' : o.status) as any,
        trackingNumber: customTracking || o.trackingNumber || `TCAT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        logisticsProvider: customProvider || o.logisticsProvider || '黑貓宅急便 (常溫專車)',
        shippedAt: newStatus === 'InTransit' ? (o.shippedAt || new Date().toISOString()) : o.shippedAt,
        deliveredAt: newStatus === 'Delivered' || newStatus === 'Completed' ? (o.deliveredAt || new Date().toISOString()) : o.deliveredAt,
      };
      return updated;
    }));
  };

  const handleOpenDispatchModal = (order: Order) => {
    setDispatchModalOrder(order);
    setTrackingNumberInput(`TCAT-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmDispatch = () => {
    if (!dispatchModalOrder) return;
    if (!manualDispatchAllowed) {
      alert(`🔒 正式站不允許手填單號：${capabilityLabel('logisticsApi')} 開發中`);
      return;
    }
    updateLogisticsStatus(dispatchModalOrder._id, 'InTransit', trackingNumberInput, logisticsProviderInput);
    setDispatchModalOrder(null);
  };

  // 統計數字
  const stats = {
    all: orderList.length,
    pending: orderList.filter(o => (o.logisticsStatus || 'PendingShipment') === 'PendingShipment').length,
    inTransit: orderList.filter(o => o.logisticsStatus === 'InTransit').length,
    delivered: orderList.filter(o => o.logisticsStatus === 'Delivered').length,
    completed: orderList.filter(o => (o.logisticsStatus === 'Completed' || o.status === 'Completed')).length,
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* 標題與出貨總覽 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text)' }}>
            🚚 總倉出貨與物流狀態調度中心
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
            平台管理員統一掌握實體商品出貨、派發物流黑貓單號、監控在途（路上）進度與到貨簽收
          </p>
        </div>
      </div>

      {/* KPI 統計卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="kpi-card" onClick={() => setFilterStatus('all')} style={{ cursor: 'pointer', borderLeft: '4px solid #3B82F6', background: filterStatus === 'all' ? '#EFF6FF' : 'white' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 600 }}>全部訂單</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{stats.all} 件</div>
        </div>
        <div className="kpi-card" onClick={() => setFilterStatus('PendingShipment')} style={{ cursor: 'pointer', borderLeft: '4px solid #F59E0B', background: filterStatus === 'PendingShipment' ? '#FEF3C7' : 'white' }}>
          <div style={{ fontSize: 12, color: '#D97706', fontWeight: 700 }}>⏳ 待出貨 (等待總倉打包)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#B45309', marginTop: 4 }}>{stats.pending} 件</div>
        </div>
        <div className="kpi-card" onClick={() => setFilterStatus('InTransit')} style={{ cursor: 'pointer', borderLeft: '4px solid #8B5CF6', background: filterStatus === 'InTransit' ? '#F5F3FF' : 'white' }}>
          <div style={{ fontSize: 12, color: '#6D28D9', fontWeight: 700 }}>🚚 路上 (黑貓運送中)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED', marginTop: 4 }}>{stats.inTransit} 件</div>
        </div>
        <div className="kpi-card" onClick={() => setFilterStatus('Delivered')} style={{ cursor: 'pointer', borderLeft: '4px solid #06B6D4', background: filterStatus === 'Delivered' ? '#ECFEFF' : 'white' }}>
          <div style={{ fontSize: 12, color: '#0891B2', fontWeight: 700 }}>📦 到貨 (買家已簽收)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#0E7490', marginTop: 4 }}>{stats.delivered} 件</div>
        </div>
        <div className="kpi-card" onClick={() => setFilterStatus('Completed')} style={{ cursor: 'pointer', borderLeft: '4px solid #10B981', background: filterStatus === 'Completed' ? '#ECFDF5' : 'white' }}>
          <div style={{ fontSize: 12, color: '#047857', fontWeight: 700 }}>✅ 已完成 (分潤已劃撥)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 4 }}>{stats.completed} 件</div>
        </div>
      </div>

      {/* 訂單與物流控制表 */}
      <div className="kpi-card" style={{ padding: 0, overflowX: 'auto', borderRadius: 16 }}>
        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>訂單號 / 日期</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>來源賣家 / 貓舍</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>收件顧客 / 地址</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>訂單總額</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>物流即時狀態</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>黑貓追蹤單號</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>管理員物流控制操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const lStatus = order.logisticsStatus || (order.status === 'Completed' ? 'Completed' : order.status === 'Shipped' ? 'InTransit' : 'PendingShipment');

              const statusBadge = {
                PendingShipment: { bg: '#FEF3C7', color: '#B45309', label: '⏳ 待總倉出貨' },
                InTransit: { bg: '#EDE9FE', color: '#6D28D9', label: '🚚 路上 (運送中)' },
                Delivered: { bg: '#E0F2FE', color: '#0369A1', label: '📦 到貨 (買家簽收)' },
                Completed: { bg: '#DCFCE7', color: '#15803D', label: '✅ 訂單結算完成' },
              }[lStatus] || { bg: '#F1F5F9', color: '#475569', label: lStatus };

              return (
                <tr key={order._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E293B' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600 }}>{order.catteryName}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>賣家分潤: NT$ {order.sellerProfit}</div>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: 220 }}>
                    <div style={{ fontWeight: 600 }}>{order.customerName} ({order.customerPhone || '0988-123-456'})</div>
                    <div style={{ fontSize: 11, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.shippingAddress || '台北市信義區忠孝東路五段 100 號'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#0F172A', fontFamily: "'Outfit', sans-serif" }}>
                    NT$ {order.totalAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{ background: statusBadge.bg, color: statusBadge.color, padding: '4px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>
                    {order.trackingNumber ? (
                      <div>
                        <code style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: 4, fontWeight: 700, color: '#1E40AF' }}>
                          {order.trackingNumber}
                        </code>
                        <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 2 }}>{order.logisticsProvider || '黑貓宅急便'}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>尚未派單</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {/* 待出貨 ➔ 操作實際出貨 (路上) */}
                      {lStatus === 'PendingShipment' && (
                        <button
                          className="btn-primary"
                          onClick={() => handleOpenDispatchModal(order)}
                          style={{ padding: '5px 12px', fontSize: 11.5, borderRadius: 6, whiteSpace: 'nowrap' }}
                        >
                          🚚 派車出貨 (路上)
                        </button>
                      )}

                      {/* 路上 ➔ 操作回報到貨 */}
                      {lStatus === 'InTransit' && (
                        <button
                          className="btn-admin btn-admin-primary"
                          onClick={() => updateLogisticsStatus(order._id, 'Delivered')}
                          style={{ padding: '5px 12px', fontSize: 11.5, borderRadius: 6, background: '#0284C7', color: 'white', whiteSpace: 'nowrap' }}
                        >
                          📦 回報到貨
                        </button>
                      )}

                      {/* 到貨 ➔ 操作訂單完成 */}
                      {lStatus === 'Delivered' && (
                        <button
                          className="btn-admin btn-admin-primary"
                          onClick={() => updateLogisticsStatus(order._id, 'Completed')}
                          style={{ padding: '5px 12px', fontSize: 11.5, borderRadius: 6, background: '#10B981', color: 'white', whiteSpace: 'nowrap' }}
                        >
                          ✅ 結算完成
                        </button>
                      )}

                      <button
                        className="btn-admin btn-admin-outline"
                        onClick={() => setSelectedOrder(order)}
                        style={{ padding: '5px 10px', fontSize: 11.5, borderRadius: 6 }}
                      >
                        明細
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 派車出貨彈窗 (指派黑貓單號) */}
      {dispatchModalOrder && (
        <div className="modal-overlay" onClick={() => setDispatchModalOrder(null)}>
          <div className="modal-content" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 12px', color: '#0F172A' }}>
              🚚 管理員總倉商品派車出貨
            </h2>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>
              為訂單 <strong>{dispatchModalOrder.orderNumber}</strong> 指派物流承運商與追蹤號碼，狀態將變更為「路上 (InTransit)」。
            </p>

            {envFeatures.mockLogisticsWebhook && (
              <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#3730A3', borderRadius: 8, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>
                🧪 展示站：單號為模擬產生，正式站將由物流 API 自動取號並回傳貨態
              </div>
            )}
            {!manualDispatchAllowed && (
              <div className="prod-lock-notice" style={{ marginBottom: 12 }}>
                🔒 正式站需串接物流 API 後才能出貨（{capabilityLabel('logisticsApi')}）
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>物流承運商 *</label>
              <select 
                value={logisticsProviderInput} 
                onChange={e => setLogisticsProviderInput(e.target.value)} 
                className="form-input"
              >
                <option value="黑貓宅急便 (溫控冷藏專車)">黑貓宅急便 (溫控冷藏專車)</option>
                <option value="黑貓宅急便 (常溫快速到貨)">黑貓宅急便 (常溫快速到貨)</option>
                <option value="新竹物流 (大宗寵物糧專車)">新竹物流 (大宗寵物糧專車)</option>
                <option value="台灣宅配通 (速遞專送)">台灣宅配通 (速遞專送)</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>黑貓物流追蹤碼 *</label>
              <input 
                type="text" 
                value={trackingNumberInput} 
                onChange={e => setTrackingNumberInput(e.target.value)} 
                className="form-input" 
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>

            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, fontSize: 12, color: '#64748B', marginBottom: 16 }}>
              <div>📦 <strong>收件人：</strong>{dispatchModalOrder.customerName} ({dispatchModalOrder.customerPhone || '0988-123-456'})</div>
              <div>📍 <strong>地址：</strong>{dispatchModalOrder.shippingAddress || '台北市信義區忠孝東路五段 100 號'}</div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn-admin btn-admin-outline" onClick={() => setDispatchModalOrder(null)}>取消</button>
              <button className="btn-primary" onClick={handleConfirmDispatch} disabled={!manualDispatchAllowed} style={{ opacity: manualDispatchAllowed ? 1 : 0.5 }}>確認出貨 (正式上路)</button>
            </div>
          </div>
        </div>
      )}

      {/* 訂單詳細內容彈窗 */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                📋 訂單與物流完整歷程 #{selectedOrder.orderNumber}
              </h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, marginBottom: 14, fontSize: 13, lineHeight: 1.7 }}>
              <div><strong>來源貓舍：</strong>{selectedOrder.catteryName}</div>
              <div><strong>買家姓名：</strong>{selectedOrder.customerName}</div>
              <div><strong>連絡電話：</strong>{selectedOrder.customerPhone || '0988-123-456'}</div>
              <div><strong>配送地址：</strong>{selectedOrder.shippingAddress || '台北市信義區忠孝東路五段 100 號'}</div>
              <div><strong>物流承運：</strong>{selectedOrder.logisticsProvider || '黑貓宅急便'}</div>
              <div><strong>追蹤單號：</strong><code>{selectedOrder.trackingNumber || '尚未分配'}</code></div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>購買商品清單：</div>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span>• {item.title} x {item.qty}</span>
                    <span style={{ fontWeight: 700 }}>NT$ {(item.sellingPrice * item.qty).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 12.5, color: '#64748B' }}>嚴選寵物食品與用品 (共 NT$ {selectedOrder.totalAmount.toLocaleString()})</div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 12, fontSize: 14, fontWeight: 800 }}>
              <span>總金額：</span>
              <span style={{ color: 'var(--color-danger)' }}>NT$ {selectedOrder.totalAmount.toLocaleString()}</span>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn-admin btn-admin-outline" onClick={() => setSelectedOrder(null)}>關閉視窗</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
