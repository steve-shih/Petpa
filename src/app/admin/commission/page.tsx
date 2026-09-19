'use client';

import { useState } from 'react';
import { profitSplitConfig, adminBankAccount } from '@/lib/mock-data';

export default function AdminCommissionPage() {
  const [platform, setPlatform] = useState(profitSplitConfig.platformRate);
  const [seller, setSeller] = useState(profitSplitConfig.sellerRate);
  const operator = Math.round((100 - platform - seller) * 10) / 10;
  const [mode, setMode] = useState<'fixed' | 'category' | 'tiered' | 'bounty'>('fixed');

  const snap = (v: number) => Math.round(v * 2) / 2; // 0.5% step

  // Demo calc
  const demoPrice = 500, demoCost = 200, demoTaxRate = 0.05;
  const demoTax = Math.round(demoPrice * demoTaxRate * 10) / 10;
  const demoNet = demoPrice - demoCost - demoTax;
  const demoPlatform = Math.round(demoNet * platform / 100 * 10) / 10;
  const demoSeller = Math.round(demoNet * seller / 100 * 10) / 10;
  const demoOperator = Math.round((demoNet - demoPlatform - demoSeller) * 10) / 10;

  const [bankForm, setBankForm] = useState(adminBankAccount);
  const [bankSaved, setBankSaved] = useState(false);

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setBankSaved(true);
    setTimeout(() => setBankSaved(false), 3000);
    alert(`✅ 已成功更新管理員指定收款與對帳匯款帳號！\n銀行：${bankForm.bankName}\n分行：${bankForm.branchName}\n帳號：${bankForm.accountNumber}\n戶名：${bankForm.accountName}`);
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>🧮 三方分潤與管理員指定匯款帳號設定</h1>

      {/* 管理員指定收款與匯款帳號設定區塊 */}
      <div className="kpi-card" style={{ marginBottom: 20, border: '1px solid #BFDBFE', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              🏛️ 管理員指定收款與月度匯款銀行帳號
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              此帳號將顯示於買家 ATM/轉帳說明，並作為對帳結算撥款給合作賣家的指定主要對帳號碼
            </p>
          </div>
          <button className="btn-primary" onClick={handleSaveBank} style={{ padding: '8px 18px', fontSize: 13 }}>
            {bankSaved ? '✓ 已成功儲存！' : '💾 儲存帳號變更'}
          </button>
        </div>

        <form onSubmit={handleSaveBank} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>銀行名稱與代碼 *</label>
            <input type="text" required value={bankForm.bankName} onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })} className="form-input" style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>分行名稱</label>
            <input type="text" value={bankForm.branchName} onChange={e => setBankForm({ ...bankForm, branchName: e.target.value })} className="form-input" style={{ fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>銀行帳號 *</label>
            <input type="text" required value={bankForm.accountNumber} onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })} className="form-input" style={{ fontSize: 13, fontFamily: 'monospace' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>戶名 / 公司抬頭 *</label>
            <input type="text" required value={bankForm.accountName} onChange={e => setBankForm({ ...bankForm, accountName: e.target.value })} className="form-input" style={{ fontSize: 13 }} />
          </div>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: Settings */}
        <div>
          <div className="kpi-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>💰 淨利潤三方分配比例</h3>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>最小調整單位：0.5%。管理員利潤 = 100% - 平台費 - 賣家分潤（自動計算剩餘）</p>

            {/* Platform Rate */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 500 }}>🏢 平台系統費率</label>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>{platform.toFixed(1)}%</span>
              </div>
              <input type="range" min={0} max={50} step={0.5} value={platform} onChange={e => setPlatform(snap(parseFloat(e.target.value)))} style={{ width: '100%', accentColor: '#3b82f6' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>0%</span><span>50%</span></div>
            </div>

            {/* Seller Rate */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 14, fontWeight: 500 }}>🐱 賣家推廣分潤率</label>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#f59e0b' }}>{seller.toFixed(1)}%</span>
              </div>
              <input type="range" min={0} max={50} step={0.5} value={seller} onChange={e => setSeller(snap(parseFloat(e.target.value)))} style={{ width: '100%', accentColor: '#f59e0b' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}><span>0%</span><span>50%</span></div>
            </div>

            {/* Operator (auto) */}
            <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#6b7280' }}>👨‍💼 管理員實際利潤（自動剩餘）</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: operator >= 0 ? '#10b981' : '#ef4444', margin: '8px 0' }}>{operator.toFixed(1)}%</div>
              {operator < 0 && <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 500 }}>⚠️ 比例總和超過 100%，請調整！</div>}
            </div>

            <button style={{ marginTop: 16, width: '100%', padding: 12, background: operator >= 0 ? '#1890FF' : '#d9d9d9', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: operator >= 0 ? 'pointer' : 'not-allowed' }}>
              儲存分潤設定
            </button>
          </div>

          {/* Commission Mode Selection */}
          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📋 賣家分潤模式</h3>
            {([
              { key: 'fixed', label: '固定百分比', desc: '全站統一固定分潤率', icon: '📌' },
              { key: 'category', label: '按商品分類差異', desc: '不同分類不同分潤比例', icon: '🗂️' },
              { key: 'tiered', label: '階梯累計獎勵', desc: '月導流越高分潤越高', icon: '📈' },
              { key: 'bounty', label: '新客首單高額', desc: '新家長首單高分潤獎勵', icon: '🎁' },
            ] as const).map(m => (
              <label key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `2px solid ${mode === m.key ? '#1890FF' : '#f0f0f0'}`, marginBottom: 8, cursor: 'pointer', background: mode === m.key ? '#e6f7ff' : 'white', transition: 'all 0.2s' }}>
                <input type="radio" name="mode" checked={mode === m.key} onChange={() => setMode(m.key)} style={{ accentColor: '#1890FF' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.icon} {m.label}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        <div>
          <div className="kpi-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>🔢 即時試算預覽</h3>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>以售價 NT$500 / 成本 NT$200 / 稅率 5% 試算</p>
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span>售價</span><span>NT$ {demoPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, color: '#ef4444' }}>
                <span>➖ 進貨成本</span><span>NT$ {demoCost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, color: '#6b7280' }}>
                <span>➖ 估算稅金 ({(demoTaxRate * 100)}%)</span><span>NT$ {demoTax}</span>
              </div>
              <div style={{ borderTop: '2px solid #e5e7eb', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700 }}>
                <span>淨利潤</span><span style={{ color: '#10b981' }}>NT$ {demoNet}</span>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              {[
                { label: '🏢 平台系統費', value: demoPlatform, pct: platform, color: '#3b82f6' },
                { label: '🐱 賣家推廣分潤', value: demoSeller, pct: seller, color: '#f59e0b' },
                { label: '👨‍💼 管理員實際利潤', value: demoOperator, pct: operator, color: '#10b981' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{item.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>NT$ {item.value}</div>
                  </div>
                  <div style={{ background: `${item.color}20`, borderRadius: 8, padding: '4px 12px', fontSize: 14, fontWeight: 600, color: item.color }}>
                    {item.pct.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Bar */}
          <div className="kpi-card">
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📊 利潤分配視覺化</h3>
            <div style={{ display: 'flex', height: 36, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${platform}%`, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 600, minWidth: platform > 5 ? 40 : 0 }}>
                {platform > 5 && `${platform}%`}
              </div>
              <div style={{ width: `${seller}%`, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 600, minWidth: seller > 5 ? 40 : 0 }}>
                {seller > 5 && `${seller}%`}
              </div>
              <div style={{ flex: 1, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 600 }}>
                {operator.toFixed(1)}%
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', fontSize: 12 }}>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#3b82f6', marginRight: 4 }} />平台</span>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#f59e0b', marginRight: 4 }} />賣家</span>
              <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: '#10b981', marginRight: 4 }} />管理員</span>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: 12, background: '#fffbeb', borderRadius: 8, fontSize: 12, color: '#92400e', border: '1px solid #fde68a' }}>
            ⚠️ 稅金為估算參考值，實際稅務申報請依當地稅法與會計師建議辦理。
          </div>
        </div>
      </div>
    </div>
  );
}
