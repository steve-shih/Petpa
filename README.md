# 🐾 Petpa 寵物補給站 | 合作貓舍 & 社群 KOL 一頁式獨立專屬購物平台

> **Petpa (Pet Supply Station)** 是專為合作貓舍、社群網紅 (Influencer KOL) 與特寵業者打造的高奢一頁式品牌購物平台。
> 提供賣家專屬 URL 網址 (`url/shop/:slug`)、獨立帳號密碼、特寵許可字號登錄、社群 KOL 選品開箱、進銷存 (ERP) 庫存流水帳、退貨售後處理、PDF 定型化契約/檢驗證明閱讀器、影音廣告 Header 拖拉積木，以及平台特權級別的 **全站系統操作審計日誌 (Audit Log)**。

---

## 👥 1. 四種使用者角色權限圖 (4 User Roles Hierarchy)

```mermaid
graph TD
    subgraph SuperAdminGroup ["👑 1. 平台總管理員 (SuperAdmin - Root)"]
        SA["最高權限治理 / 稽核 Audit Log / IP與設備安全監控"]
    end

    subgraph AdminGroup ["👨‍💼 2. 一般營運管理員 (Admin)"]
        A1["開通店家與發行 URL slug"]
        A2["商品/種類/特殊價 審核"]
        A3["進銷存 (ERP) 庫存與退貨審核"]
        A4["每月例行對帳與匯款帳號設定"]
    end

    subgraph SellerGroup ["🐱/📱 3. 合作賣家 (Sellers)"]
        S1["🐱 實體合作貓舍 (特寵字號/活體尋家)"]
        S2["📱 社群 KOL 創作者 (網紅開箱選品)"]
        S3["自訂賣場標籤/售價 & 拖拉積木"]
    end

    subgraph BuyerGroup ["🛍️ 4. 消費者 / 買家 (Buyer)"]
        B1["訪客瀏覽專屬賣場 / 閱讀 PDF 合約"]
        B2["加入購物車 (免登入)"]
        B3["結帳下單 (強制登入驗證)"]
    end

    SA -->|控管授權| AdminGroup
    AdminGroup -->|審核與配發| SellerGroup
    SellerGroup -->|展示專屬賣場| BuyerGroup
```

---

## 🔌 ⚡ 前後端分離架構 (Decoupled Architecture & RESTful API)

> **Petpa** 採用嚴格的 **前後端分離 (Decoupled Architecture)** 規範：
> 前端 Client 僅負責介面渲染與 UI 狀態維護，所有數據查詢、異動、進銷存庫存補貨、退貨審核與 Audit Log 紀錄皆經由高層級的 **JSON RESTful API Endpoints** 進行解耦傳輸。

```mermaid
graph LR
    subgraph Frontend ["🎨 前端 Client 視圖層 (Decoupled UI)"]
        ReactUI["React Component / Dynamic Page"]
    end

    subgraph APIBridge ["🔌 JSON RESTful API Gateway"]
        ShopAPI["GET /api/v1/shop/:slug"]
        AdminSellersAPI["POST /api/v1/admin/sellers"]
        AuditLogsAPI["GET /api/v1/admin/audit-logs"]
    end

    subgraph BackendStore ["💾 後端資料服務層 (Backend Service & DB)"]
        CoreDB[(MongoDB / Mock DB)]
        AuditStore[(Audit Trail Store)]
    end

    ReactUI -->|1. fetch(HTTP GET/POST)| APIBridge
    ShopAPI -->|2. JSON Payload| CoreDB
    AdminSellersAPI -->|3. JSON Response| CoreDB
    AuditLogsAPI -->|4. Audit Tracking| AuditStore
```

### 📡 核心 RESTful API 接口清單

| 方法 | Endpoint | 權限角色 | 功能說明 |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/shop/:slug` | 🛍️ 買家 / 訪客 | 獲取賣家專屬頁面、客製標籤售價、活體幼貓與商品列表 |
| `POST` | `/api/v1/admin/sellers` | 👨‍💼 管理員 | 前後端分離開通新賣家 (發行 Slug, Email, 密碼與特寵字號) |
| `GET` | `/api/v1/admin/audit-logs` | 👑 總管理員 | 獲取全站操作軌跡日誌 (含 IP、使用設備與 API 詳細內容) |

---

## 📸 2. 系統總體架構圖 (System Architecture Diagram)

```mermaid
graph TD
    subgraph ClientLayer ["📱 前端展示層 (Client Layer)"]
        B["🛍️ 買家購物端 (/shop/:slug)"]
        S["🐱/📱 賣家控制台 (/seller/*)"]
        A["🛡️ 管理員與審計後台 (/admin/*)"]
    end

    subgraph AppRouter ["⚡ RESTful API Bridge / Engine Core"]
        AuthGate["🔒 買家結帳 / 賣家登入驗證 (Auth Gate)"]
        SlugRouter["🔗 動態品牌路由 /shop/[slug]"]
        ReviewEngine["⏳ 商品/種類/特殊價 審核引擎 (Review Engine)"]
        ERPEngine["🏬 進銷存 (ERP) 庫存與退貨異動引擎"]
        AuditEngine["🛡️ 全站操作審計日誌監控 (Audit Log Engine)"]
    end

    subgraph DataStore ["💾 本地 / 雲端資料庫 (Mock DB / MongoDB)"]
        CatteriesDB[(catteries - 貓舍/KOL 與專屬 Slug)]
        ProductsDB[(products - 商品/底價/客製標籤)]
        InventoryDB[(inventoryLogs - ERP 庫存流水號)]
        ReturnsDB[(returns - 售後退貨單與補庫存)]
        AuditDB[(auditLogs - IP/設備/API 審計軌跡)]
    end

    B -->|REST API fetch| SlugRouter
    B -->|買家下單結帳| AuthGate
    S -->|REST API 提報商品| ReviewEngine
    S -->|申請進銷存補貨與退貨| ERPEngine
    A -->|REST API 開通賣家| CatteriesDB
    A -->|審核特殊批發價與退貨| ReviewEngine
    A -->|REST API 稽核日誌| AuditEngine

    ReviewEngine --> ProductsDB
    ERPEngine --> InventoryDB
    ERPEngine --> ReturnsDB
    AuditEngine --> AuditDB
```

---

## 💾 3. 系統資料實體關係圖 (Data ER Diagram / Schema)

```mermaid
erDiagram
    CATTERY ||--o{ PRODUCT : "選用/自訂標籤售價 (sellerConfigs)"
    CATTERY ||--o{ KITTEN : "擁有哪些活體幼貓"
    CATTERY ||--o{ ORDER : "導流訂單"
    PRODUCT ||--o{ INVENTORY_LOG : "庫存異動紀錄"
    ORDER ||--o{ RETURN_ORDER : "售後退貨單"
    USER ||--o{ AUDIT_LOG : "操作行為軌跡"

    CATTERY {
        string _id PK
        string slug "專屬 URL 代碼 (如: meow-house)"
        string name "貓舍/KOL 名稱"
        string sellerType "cattery (貓舍) / influencer (KOL)"
        string licenseNumber "特定寵物業許可證字號"
        string loginEmail "獨立賣家 Email"
        boolean enableKittens "是否開啟活體區"
    }

    PRODUCT {
        string _id PK
        string title "商品名稱"
        string categoryId FK
        number costPrice "進貨成本"
        number sellingPrice "管理員建議底價"
        string pdfUrl "PDF 檢驗報告/合約"
        json targetCatteries "指定上架之貓舍清單"
        json sellerConfigs "各賣家客製標籤與自訂售價"
    }

    KITTEN {
        string _id PK
        string catteryId FK
        string name "貓咪呼名"
        string breed "品種"
        string microchipNumber "晶片號碼"
        string status "Available / Reserved / Sold"
        string pdfUrl "定型化買賣契約 PDF"
    }

    INVENTORY_LOG {
        string _id PK
        string productId FK
        string type "Inbound / Outbound / ReturnRestock / Adjustment"
        number qtyChange "庫存異動數量"
        number afterStock "異動後最新庫存"
        string operatorName "操作者全名與角色"
    }

    RETURN_ORDER {
        string _id PK
        string returnNumber "退貨單號"
        string orderNumber FK "原訂單單號"
        number refundAmount "退款金額"
        string reason "包裝破損 / 規格不符"
        string status "PendingReview / Approved / Refunded"
        boolean restockInventory "是否補回 ERP 庫存"
    }

    AUDIT_LOG {
        string _id PK
        string timestamp "時間戳記"
        string role "super_admin / admin / seller / buyer"
        string userEmail "操作者 Email"
        string ipAddress "IP 位置與地理區域"
        string deviceInfo "瀏覽器與裝置資訊"
        string apiEndpoint "呼叫 API"
        string actionDetails "完整操作行為詳情"
    }
```

---

## 🔄 4. 業務資料流向圖 (Data Flow Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 👨‍💼 管理員 (Admin)
    actor Seller as 🐱/📱 賣家 (Seller/KOL)
    actor Buyer as 🛍️ 買家 (Buyer)
    participant App as ⚡ Petpa 系統 Core
    participant DB as 💾 系統資料庫 (DB)

    %% 1. 店家開通與網址發行
    Admin->>App: 1. 創建新合作賣家 (設定 Slug, 帳密, 賣家類型)
    App->>DB: 儲存賣家資料並發行專屬 URL (url/shop/:slug)
    App->>DB: 寫入 Audit Log (IP/設備/操作細節)
    DB-->>Admin: 回傳開通成功與專屬網址

    %% 2. 賣家提報商品與上傳 PDF
    Seller->>App: 2. 提報自訂商品 / 自訂標籤售價 / 上傳 PDF 檢驗報告
    App->>DB: 寫入商品資料 (狀態: ⏳ PendingReview)
    App->>DB: 寫入 Audit Log
    App-->>Admin: 推播待審核通知

    %% 3. 管理員審核與分配
    Admin->>App: 3. 審核商品並勾選上架貓舍
    App->>DB: 更新商品狀態 (✅ Approved) & 上架店家標籤
    App->>DB: 寫入 Audit Log

    %% 4. 買家存取與購物
    Buyer->>App: 4. 存取專屬網址 (url/shop/:slug) 瀏覽貓咪與商品
    App->>DB: 讀取該賣家專屬客製標籤、活體牆與指定商品
    DB-->>Buyer: 呈現獨立高奢賣場 (免登入即可瀏覽/加入購物車/閱讀 PDF)
    Buyer->>App: 5. 前往結帳
    App-->>Buyer: 觸發買家身份登入驗證 (Auth Modal)
    Buyer->>App: 6. 確認下單 (選擇 ATM 轉帳管理員指定帳號)
    App->>DB: 寫入訂單，扣減 ERP 庫存並寫入 Inventory Log
    App->>DB: 寫入 Audit Log (記錄買家 IP 與設備)

    %% 5. 退貨與對帳
    Buyer->>App: 7. 申請售後退貨 (包裝破損)
    Admin->>App: 8. 同意退貨並勾選補回庫存
    App->>DB: 退貨單標註 Approved，ERP 庫存 +1 並寫入 Inventory Log
    Admin->>App: 9. 每月 1 日批次生成對帳月報
    App-->>Seller: 10. 自動寄送月度財務報表 PDF/Excel 至賣家 Email
```

---

## 🔥 已實現最新完整功能 (Implemented Features)

### 1. 📱 社群行銷類賣家 (Influencer / KOL Seller)
* **賣家角色雙軌化**：後台開通時支援選取 **`🐱 實體合作貓舍`**（須填特寵字號、開放幼貓專區）與 **`📱 社群 KOL 賣家`**（連結 IG/YouTube/FB 粉絲專頁與粉絲數，免填特寵字號）。
* **網紅聯名專屬賣場**：社群賣家擁有獨立專屬網址 `/shop/cat-master-ig`，可開箱獨家商品與設定優惠活動。

### 2. 🏬 進銷存 (ERP) 庫存管理與異動歷史流水帳 (`/admin/inventory`)
* **進銷存四大異動類型**：支援 `📥 採購進貨入庫`、`📤 銷貨出庫扣減`、`🔄 退貨庫存補回` 與 `⚙️ 盤點差距微調`。
* **低庫存預警與即時更新**：全站商品庫存低於 100 件時自動跳出 Warning 預警，任何微調皆即時紀錄 **前後庫存對照與操作者全名**。

### 3. 🔄 售後退貨處理與自動補庫存 (`/admin/returns`)
* **完整退貨軟體介面**：提供買家退貨申請清單、退貨原因分析（如：*包裝破損*、*規格不符*）與預估退款總額。
* **一鍵同意並自動補回 ERP 庫存**：管理員核准退貨時，可一鍵勾選 **「自動將商品數量補回進銷存庫存」**，系統將自動於 ERP 寫入 `🔄 退貨入庫` 紀錄。

### 4. 🛡️ 平台特權級別系統操作審計日誌 Audit Log (`/admin/audit-logs`)
* **平台級安全監控**：完整紀錄 `SuperAdmin`、`Admin`、`Seller` 與 `Buyer` 所有操作軌跡。
* **四大權限屬性記錄**：
  1. **時間戳記 (Timestamp)**
  2. **IP 位置與實體地理區域** (如：`220.135.98.112 (台北市)`)
  3. **使用設備與瀏覽器** (如：`Chrome 128.0 (macOS 15.0)`)
  4. **呼叫 API Endpoint & 完整操作行為內容** (如：`POST /api/v1/seller/products/custom-config`)

---

## 🛠️ 運用技術 (Tech Stack)

| 領域 | 使用技術 / 框架 | 說明 |
| :--- | :--- | :--- |
| **核心框架** | **Next.js 16.3.5 (App Router)** | 使用 Turbopack 極速建置、Dynamic Route (`/shop/[slug]`) |
| **語言** | **TypeScript 5.x** | 全站嚴格型別定義與 API 介面約束 |
| **UI 樣式與設計** | **Vanilla CSS (Design Tokens)** | 手繪高奢現代 CSS 主題系統、Glassmorphism 玻璃擬物、現代 Outfit / Inter 字體 |
| **圖表與視覺化** | **Mermaid.js** | 流程圖、ER 模型圖、架構圖與時序圖視覺化呈現 |
| **圖案與媒體** | **Lucide Icons & WebP** | 極速載入優化與高解析度媒體展售 |
| **部署與構建** | **Node.js 20 LTS / Turbopack** | 支援 Server-side Rendering (SSR) 與預渲染 (Prerender) |

---

## 🔗 最新頁面測試路徑彙整

| 頁面分類 | 路由 Path | 功能說明 |
| :--- | :--- | :--- |
| **社群 KOL 賣家賣場** | `/shop/cat-master-ig` | 網紅專屬賣場、開箱用品與主題風格 |
| **進銷存 (ERP) 庫存管理** | `/admin/inventory` | 即時庫存表、進貨補貨與 ERP 異動流水帳 |
| **售後退貨管理** | `/admin/returns` | 買家退貨單審核、退款追蹤與自動補庫存 |
| **平台審計日誌 (Audit Log)** | `/admin/audit-logs` | 最高管理員稽核 IP、設備、API 與全站操作軌跡 |
| **賣家自訂標籤與售價** | `/seller/products` | 賣家自訂專屬標籤、售價與高量批發價合約申請 |
| **管理員匯款帳號設定** | `/admin/commission` | 設定平台收款與對帳主要銀行帳戶 |
