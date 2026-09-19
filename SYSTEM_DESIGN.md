# 🛠️ Petpa 寵物補給站 - 系統規劃設計 (System Design & Architecture)

本文檔詳細說明 **Petpa 合作貓舍一頁式購物平台** 的系統架構、Node.js + Next.js 全棧選型、MongoDB + Redis 架構、螞蟻金融風後台、新潮前台 UI 風格以及免費設計資源推薦。

---

## 🏗️ 1. 系統整體架構 (System Architecture)

系統採用現代化雙資料庫架構（MongoDB 持久化 + Redis 高效快取與 Session 追蹤）：

```mermaid
flowchart TD
    subgraph Client [📱 前台與後端使用者]
        User[👨‍👩‍👧 貓咪家長 (新潮一頁式商城)] -->|shop.petpa/?cattery=CAT001| NextApp[🌐 Next.js 全棧應用 / API Routes]
        Admin[👨‍💼 平台管理員 / 貓舍 (螞蟻金服後台)] -->|shop.petpa/admin| NextApp
    end

    subgraph Infrastructure [☸️ K8s Cluster (Namespace: petpa)]
        Ingress[🚪 NGINX Ingress Controller] --> NextApp
        
        subgraph Data_Layer [🗄️ 資料與快取層]
            NextApp <---> Redis[(⚡ Redis Cache & Lock & Session)]
            NextApp <---> Mongo[(🍃 MongoDB Primary Database)]
            NextApp <---> PVC[(💾 PVC Storage 1Gi)]
        end
    end
```

---

## 💻 2. 技術棧與元件選型 (Tech Stack Specifications)

| 元件類型 | 選型 / 技術 | 職責與用途 |
|---|---|---|
| **核心框架 (Core Framework)** | **Node.js + Next.js (App Router)** | 全棧 React 框架，提供 SSR 快速首頁載入、SEO 最佳化與 API Routes 邏輯處理 |
| **持久化資料庫 (Primary DB)** | **MongoDB (Mongoose ORM)** | 儲存貓舍資訊 (`Cattery`)、商品目錄 (`Product`)、訂單與分潤 (`Order`) |
| **快取與記憶體資料庫 (Cache DB)** | **Redis (ioredis / Upstash)** | 1. 貓舍 Referral Code 高速對照快取<br>2. 一頁式購物車與 Session 快取<br>3. 熱門商品庫存快取與防超賣分散式鎖 (Distributed Lock) |
| **後台 UI (Admin UI)** | **螞蟻金融風格 (Ant Design Pro / Antd)** | 專業數據大盤、對帳表格、權限管理、報表匯出 |
| **前台 UI (Storefront UI)** | **新潮活潑 (Trendy Glassmorphism UI)** | 玻璃擬態、動態漸層、卡片化選購、微動畫 (Framer Motion) |
| **容器與部署** | Docker + K8s (`petpa` namespace) | GitOps 自動化部署 (`prod/petpa.yaml` & ArgoCD) |

---

## 🎨 3. UI/UX 設計風格與免費資源參考 (Design Styles & Resources)

### 3.1 後台管理端：螞蟻金融風格 (Ant Design Style)
- **視覺特色**：沉穩深藍主色 (`#001529` / `#1890FF`)、簡潔高密度數據表格、清晰圖表看板、響應式側邊導覽欄。
- **元件庫建議**：[Ant Design for React](https://ant.design/) / [Ant Design Pro Components](https://procomponents.ant.design/)。

### 3.2 前台一頁式商城：新潮風格 (Trendy Modern UI)
- **視覺特色**：
  - **玻璃擬態 (Glassmorphism)**：半透明卡片、柔和陰影與背景模糊 (`backdrop-blur-md`)。
  - **暖色調活力漸層**：琥珀橘 (`#F59E0B`)、萌粉橘 (`#FF7E5F`) 與清新白，展現寵物溫馨活力感。
  - **極簡微卡片 (Micro-Cards)**：商品規格一鍵切換、浮動購物車欄與 30 秒快速結帳按鈕。

### 3.3 免費資源參考與推薦清單 (Free Resource Recommendations)

| 資源類別 | 推薦名稱 | 連結與說明 |
|---|---|---|
| **圖標庫 (Icons)** | **Lucide Icons** | [lucide.dev](https://lucide.dev/) — 免費開源、極簡現代風格 SVG 圖標 |
| **圖標庫 (Icons)** | **Tabler Icons** | [tabler-icons.io](https://tabler-icons.io/) — 超過 4000+ 免費向量圖標 |
| **現代字型 (Fonts)** | **Google Fonts Outfit** | [Outfit Font](https://fonts.google.com/specimen/Outfit) — 科技感與現代簡潔兼具的前體字型 |
| **現代字型 (Fonts)** | **Plus Jakarta Sans** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — 新潮電商首選圓潤字型 |
| **UI 元件庫 (UI Framework)** | **Shadcn UI** | [ui.shadcn.com](https://ui.shadcn.com/) — 基於 Tailwind 的可客製化新潮 UI 元件庫 |
| **高品質圖片 (Photos)** | **Unsplash Pet Collection** | [unsplash.com/s/photos/cat](https://unsplash.com/) — 高畫質免費商業可用貓咪圖片 |
| **微動畫 (Animations)** | **LottieFiles** | [lottiefiles.com](https://lottiefiles.com/) — 免費可愛貓咪載入與購物車向量動畫 |
| **配色工具 (Palette)** | **Coolors** | [coolors.co](https://coolors.co/) — 快速生成與對比潮流電商色系 |

---

## 🗄️ 4. 資料庫 Schema 與 Redis 設計 (Data & Cache Models)

### 4.1 Redis Key 規劃
- **貓舍代碼快取**：`cattery:code:{catteryId}` ➔ JSON (過期時間 24h)
- **熱門商品庫存快取**：`stock:prod:{productId}` ➔ Integer (Redis `DECRBY` 防超賣)
- **顧客購物車暫存**：`cart:session:{sessionId}` ➔ Hash (過期時間 7 天)

### 4.2 MongoDB Schema (核心模型)
- **`Cattery`** (貓舍資料): 包含 `catteryId`, `name`, `logoUrl`, `bannerUrl`, `commissionRate`, `qrCodeUrl`
- **`Product`** (商品目錄): 包含 `title`, `category` (`cat_litter`, `portioned_food`, `freeze_dried`), `price`, `stock`
- **`Order`** (訂單與來源): 包含 `orderNumber`, `catteryId`, `customer`, `items`, `totalAmount`, `commissionAmount`, `status`

---

## 🔌 5. API 介面規格 (API Specifications)

| HTTP Method | API 路徑 | 說明 | 快取處理 (Redis) |
|---|---|---|---|
| `GET` | `/api/v1/cattery/:catteryId` | 取得貓舍專屬 UI 設定與推薦商品 | 快取於 Redis (24h) |
| `GET` | `/api/v1/products` | 取得貓砂、分裝糧、凍乾商品列表 | 快取於 Redis (1h) |
| `POST` | `/api/v1/orders` | 一頁式下單 (鎖定 Redis 庫存，寫入 MongoDB) | Redis 庫存扣減原子操作 |
| `GET` | `/api/v1/admin/dashboard` | 螞蟻金服風後台：總銷售額與貓舍分潤大盤 | 即時聚合計算 |
