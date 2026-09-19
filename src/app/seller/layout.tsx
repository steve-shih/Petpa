'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { key: '/seller/dashboard', label: '📊 分潤總覽' },
  { key: '/seller/orders', label: '📋 導流訂單' },
  { key: '/seller/withdraw', label: '💳 提現申請' },
  { key: '/seller/page', label: '🖥️ 封面與頁面' },
  { key: '/seller/kittens', label: '🐱 活體貓咪管理' },
  { key: '/seller/products', label: '📦 商品與種類修改' },
  { key: '/seller/qrcode', label: '📲 推廣 QR Code' },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="admin-sidebar" style={{ background: '#0a1929' }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🐱</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>賣家控制台</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>喵喵萌寵專業貓舍</div>
            </div>
          </Link>
        </div>
        <nav style={{ marginTop: 8 }}>
          {menuItems.map(item => (
            <Link key={item.key} href={item.key} className={pathname === item.key ? 'active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/admin/dashboard" style={{ fontSize: 12 }}>🔄 切換至管理員後台</Link>
          <Link href="/login" style={{ fontSize: 12, color: '#ff7875' }}>🚪 登出</Link>
        </div>
      </div>
      <div className="admin-content" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
