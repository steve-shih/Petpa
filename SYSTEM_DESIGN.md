# 🛠️ Petpa 寵物補給站 - 系統規劃與技術架構設計書 (System Design)

本文檔詳細定義 **Petpa 合作貓舍/賣家自助註冊與分潤平台** 之技術架構、MongoDB Atlas 雲端託管模式、Redis 快取與鎖設計、完整資料庫模型 (Schemas)、螞蟻金融風 Dashboard 與新潮 Glassmorphism 前台 UI 組件架構，以及完整 API 規範。

---

## 🏗️ 1. 系統架構與 Topology (MongoDB Atlas + Redis)

系統採用 Node.js + Next.js 全棧服務，結合 MongoDB Atlas 託管資料庫與 Redis 高速快取：

```mermaid
flowchart TD
    subgraph Clients [📱 客戶端介面 (Next.js App Router)]
        ShopUI[🛍️ 貓咪家長 (新潮一頁式商城)]
        PartnerUI[📊 合作貓舍 (AntD 分潤控制台)]
        AdminUI[⚙️ 平台管理員 (AntD 總管理後台)]
    end

    subgraph ServiceEngine [⚡ Next.js API & Server Actions]
        AuthModule[🔑 身份驗證 & JWT / NextAuth]
        CategoryEngine[📁 動態分類管理模組]
        CommissionEngine[🧮 分潤計算引擎 (Fixed / Category / Tiered / Bounty)]
        OrderEngine[🛒 一頁式下單與金流處理]
    end

    subgraph StorageLayer [☁️ 雲端託管資料與快取層]
        Atlas[(🍃 MongoDB Atlas Cloud Cluster)]
        Redis[(⚡ Redis Cache & Lock)]
    end

    ShopUI --> ServiceEngine
    PartnerUI --> ServiceEngine
    AdminUI --> ServiceEngine

    ServiceEngine --> AuthModule
    ServiceEngine --> CategoryEngine
    ServiceEngine --> CommissionEngine
    ServiceEngine --> OrderEngine

    AuthModule <---> Atlas
    CategoryEngine <---> Atlas
    CommissionEngine <---> Atlas
    OrderEngine <---> Atlas
    OrderEngine <---> Redis
```

---

## 💻 2. 資料庫模型設計 (MongoDB Atlas Mongoose Schemas)

### 2.1 帳號與貓舍模型 (`User` & `Cattery`)
```typescript
interface IUser {
  _id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'cattery_owner';
  catteryProfile?: {
    catteryId: string;       // 專屬識別碼，如 "meow_house"
    name: string;            // 貓舍名稱
    logoUrl?: string;        // 貓舍 Logo 網址
    bannerUrl?: string;      // 形象橫幅網址
    description?: string;     // 貓舍介紹
    qrCodeUrl: string;       // 專屬 QR Code 圖檔網址
    bankAccount: {
      bankName: string;      // 銀行名稱 (例: 中國信託)
      bankCode: string;      // 銀行代碼 (例: 822)
      accountNumber: string; // 帳號
      accountName: string;   // 戶名
    };
    isApproved: boolean;     // 帳號審核狀態
  };
  createdAt: Date;
}
```

### 2.2 動態商品分類模型 (`Category`)
```typescript
interface ICategory {
  _id: string;
  name: string;              // 分類名稱 (例: "飼料", "清潔", "保健品", "貓砂")
  slug: string;              // URL 標籤 (例: "cat-food", "cat-litter")
  icon?: string;             // Lucide Icon 名稱
  sortOrder: number;         // 排序權重
  defaultCommissionRate?: number; // 該分類預設分潤率 (例: 保健品 0.25)
  isSystem: boolean;         // 是否為基本內建分類
  isActive: boolean;
}
```

### 2.3 商品目錄模型 (`Product`)
```typescript
interface IProduct {
  _id: string;
  title: string;             // 商品標題
  categoryId: string;        // 關聯 ICategory _id
  price: number;             // 售價
  originalPrice: number;     // 原價
  stock: number;             // 庫存量
  isRecommended: boolean;    // 是否設為貓舍預設推薦品項
  customCommissionRate?: number | null; // 單品獨立分潤率 (蓋過分類與全站)
  images: string[];          // 商品圖片網址列表
  specifications: { name: string; value: string }[];
  isActive: boolean;
}
```

### 2.4 分潤規則配置模型 (`CommissionRule`)
```typescript
interface ICommissionRule {
  _id: string;
  name: string;              // 規則名稱 (例: "2026 階梯獎勵方案")
  type: 'FIXED' | 'CATEGORY_BASED' | 'TIERED_VOLUME' | 'FIRST_TIME_BOUNTY';
  config: {
    fixedRate?: number;      // FIXED 模式下固定分潤率 (例: 0.15)
    categoryRates?: Record<string, number>; // CATEGORY_BASED 下 categoryId -> rate
    tiers?: { minAmount: number; maxAmount: number; rate: number }[]; // TIERED 下階梯配置
    firstTimeBountyRate?: number; // FIRST_TIME_BOUNTY 下首單分潤率
    defaultRate?: number;    // 預設基礎分潤率
  };
  isActive: boolean;
}
```

### 2.5 訂單與來源模型 (`Order`)
```typescript
interface IOrder {
  _id: string;
  orderNumber: string;       // 訂單編號 (例: "PETPA-20260919-8891")
  catteryId: string;         // 來源貓舍代碼
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: {
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  commissionAmount: number;  // 經分潤引擎計算出的貓舍收益
  commissionRuleApplied: string; // 當時套用之分潤規則類型
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  shippingStatus: 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  createdAt: Date;
}
```

### 2.6 分潤提現申請模型 (`WithdrawalRequest`)
```typescript
interface IWithdrawalRequest {
  _id: string;
  catteryId: string;
  amount: number;            // 提現金額 (最低 NT$ 1,000)
  bankInfo: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  status: 'Pending' | 'Approved' | 'Transferred' | 'Rejected';
  note?: string;             // 管理員備註/交易序號
  requestedAt: Date;
  transferredAt?: Date;
}
```

---

## ⚡ 3. Redis 快取與鎖策略 (Redis Caching & Locking)

| Redis Key 設計 | 資料型別 | 快取用途與 TTL | 作用與優化目的 |
|---|---|---|---|
| `cattery:ref:{code}` | String | JSON (TTL: 24h) | 貓舍 Referral Code 高速快取，避免每次頁面請求讀取 MongoDB |
| `categories:active` | String | JSON (TTL: 1h) | 前台動態商品分類快取，管理員更新時主動清空 |
| `stock:lock:{productId}` | String | Atom Lock (TTL: 5s) | 使用 Redis 實現秒殺與高併發下單防超賣分散式鎖 |
| `cart:sess:{sessionId}` | Hash | Cart Items (TTL: 7d) | 家長未完成結帳前之購物車暫存 |

---

## 🎨 4. UI 視覺組件架構 (Ant Design vs. Glassmorphism)

### 4.1 貓舍分潤控制台 (Ant Design Pro Components)
- **Top Metrics Grid**：使用 `antd.Card` + `Statistic` 展示 **本月預估分潤**、**可提領餘額**、**累積導流訂單** 與 **顧客回購率**。
- **Tier Progress Banner**：若啟用階梯分潤，顯示 `antd.Progress` 條與提示：「距離解鎖 18% 分潤還差 NT$ 8,500」。
- **Referral Trend Chart**：整合 `@ant-design/plots` 或 `recharts` 呈現 30 天每日導流銷售與分潤折線圖。
- **Withdrawal Action Modal**：點擊「一鍵申請提現」彈出 `antd.Modal` 確認銀行資訊與輸入金額。

### 4.2 前台一頁式商城 (Trendy Glassmorphism Components)
- **Cattery Header Banner**：半透明毛玻璃 (`backdrop-blur-md bg-white/70`) 呈現貓舍 Logo、頭像與育種理念標語。
- **Dynamic Category Tabs**：動態 pill 選單（飼料、清潔、保健品、貓砂及自定義分類），點擊滑動過濾商品。
- **Micro Product Card**：顯示商品圖片、標籤、價格與動態加減數量按鈕。
- **Float Sticky Checkout Bar**：底部懸浮購物車條，即時顯示小計與「30 秒極速結帳」按鈕。

---

## 🔌 5. API 介面與 Payload 規範 (API Specifications)

| HTTP Method | Endpoint | 說明 | Request Payload / Query | Response Payload (JSON) |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register-cattery` | 貓舍自助註冊 | `{ email, password, catteryName, bankAccount }` | `{ success: true, catteryId, qrCodeUrl }` |
| `GET` | `/api/v1/categories` | 取得動態商品分類 | `None` | `{ categories: ICategory[] }` |
| `GET` | `/api/v1/partner/dashboard` | 貓舍分潤看板數據 | Header: Bearer Token | `{ kpi, trendChartData, orders, availableBalance }` |
| `POST` | `/api/v1/partner/withdraw` | 貓舍申請提現 | `{ amount: 2000 }` | `{ success: true, requestId, status: "Pending" }` |
| `POST` | `/api/v1/orders` | 一頁式送出訂單 | `{ catteryId, customer, items, paymentMethod }` | `{ orderNumber, totalAmount, paymentUrl }` |
| `POST` | `/api/v1/admin/categories` | 管理員自定義分類 | `{ name: "凍乾零食", slug: "freeze-dried" }` | `{ success: true, category: ICategory }` |
| `PUT` | `/api/v1/admin/commission-rule` | 管理員切換分潤規則 | `{ type: "TIERED_VOLUME", config: {...} }` | `{ success: true, rule: ICommissionRule }` |
