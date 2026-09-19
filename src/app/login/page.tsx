'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('test@petpa.tw');
  const [password, setPassword] = useState('test1234');
  const [role, setRole] = useState<'admin' | 'seller'>('admin');

  return (
    <div className="login-bg">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-accent))', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: 'var(--shadow-md)', marginBottom: 12 }}>
            🐾
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Petpa 寵物補給站</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {isRegister ? '合作貓舍 / 賣家註冊申請' : '平台管理員與賣家控制台登入'}
          </p>
        </div>

        {/* Role Toggle Switch */}
        {!isRegister && (
          <div style={{ display: 'flex', background: 'var(--color-bg)', padding: 4, borderRadius: 'var(--radius-md)', marginBottom: 20, border: '1px solid var(--color-border-light)' }}>
            <button
              type="button"
              onClick={() => { setRole('admin'); setEmail('test@petpa.tw'); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'admin' ? 'white' : 'transparent',
                color: role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: role === 'admin' ? 800 : 500,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              👨‍💼 平台管理員
            </button>
            <button
              type="button"
              onClick={() => { setRole('seller'); setEmail('seller@meow.tw'); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: role === 'seller' ? 'white' : 'transparent',
                color: role === 'seller' ? 'var(--color-brand-600)' : 'var(--color-text-secondary)',
                fontWeight: role === 'seller' ? 800 : 500,
                fontSize: 12.5,
                cursor: 'pointer',
                boxShadow: role === 'seller' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              🐱 貓舍賣家控制台
            </button>
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>電子郵件 Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="form-input" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>密碼 Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="form-input" />
        </div>

        {isRegister && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>貓舍 / 品牌名稱</label>
              <input type="text" placeholder="例：喵喵萌寵專業貓舍" className="form-input" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-secondary)' }}>特定寵物業許可證字號</label>
              <input type="text" placeholder="例：特寵業字第 A1130888 號" className="form-input" />
            </div>
          </>
        )}

        <Link href={role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'} style={{ textDecoration: 'none', display: 'block' }}>
          <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 'var(--radius-md)' }}>
            {isRegister ? '提交註冊申請 →' : '確認登入 →'}
          </button>
        </Link>

        {/* Google OAuth Simulation Button */}
        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={() => alert('🌐 已成功透過 Google One-Tap 登入 Petpa 系統！')}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'white',
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: 13.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            使用 Google 快速登入
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            {isRegister ? '已有帳號？返回登入' : '我是合作貓舍，立即申請入駐 →'}
          </button>
        </div>
      </div>
    </div>
  );
}

