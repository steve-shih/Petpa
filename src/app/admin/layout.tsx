'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { key: '/admin/dashboard', label: '📊 營運總覽', },
  { key: '/admin/sellers', label: '🐱 賣家與 KOL 管理', },
  { key: '/admin/products', label: '📦 商品管理與審核', },
  { key: '/admin/inventory', label: '🏬 進銷存 (ERP) 庫存', },
  { key: '/admin/returns', label: '🔄 售後退貨管理', },
  { key: '/admin/categories', label: '🗂️ 分類管理', },
  { key: '/admin/commission', label: '🧮 分潤與匯款帳號', },
  { key: '/admin/orders', label: '📋 訂單管理', },
  { key: '/admin/reports', label: '📅 每月對帳報表', },
  { key: '/admin/social', label: '📱 社群製圖', },
  { key: '/admin/audit-logs', label: '🛡️ 全站審計日誌', },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🐾</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Petpa 管理後台</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>寵物補給站營運管理</div>
            </div>
          </Link>
        </div>
        <nav style={{ marginTop: 8 }}>
          {menuItems.map(item => (
            <Link
              key={item.key}
              href={item.key}
              className={pathname === item.key ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/seller/dashboard" style={{ fontSize: 12 }}>
            🔄 切換至賣家控制台
          </Link>
          <Link href="/login" style={{ fontSize: 12, color: '#ff7875' }}>
            🚪 登出
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
