# 🛠️ Petpa 寵物補給站 - 系統規劃設計 (System Design & Technical Architecture)

本文檔詳細說明 **Petpa 合作貓舍一頁式購物平台** 的系統架構、Kubernetes 容器化配置、網域路由、資料庫 Schema（包含貓舍分潤與來源追蹤）以及 API 介面規格。

---

## 🏗️ 1. 系統整體架構 (System Architecture)

系统採用微服務架構，結合前台一頁式購物體驗與後台貓舍來源追蹤：

```mermaid
flowchart TD
    subgraph Client [📱 客戶端 (家長 / 貓舍)]
        QRCode[📷 掃描貓舍專屬 QR Code] -->|shop.petpa/?cattery=CAT001| FrontEnd[🌐 Petpa 一頁式前端 UI]
    end

    subgraph Infrastructure [☸️ K8s Cluster (Namespace: petpa)]
        Ingress[🚪 NGINX Ingress Controller] -->|shop.petpa| Svc[🔌 Petpa Service :3000]
        Svc --> Pod[🐳 Petpa Application Pod]
        Pod <---> DB[(🗄️ Database: MongoDB / Embedded)]
        Pod <---> Storage[(💾 Storage: PVC 1Gi)]
    end

    FrontEnd -->|1. 帶入 catteryId 下單| Ingress
    Pod -->|2. 紀錄 catteryId 歸屬| DB
    Pod -->|3. 計算貓舍分潤報表| DB
```

---

## 💻 2. 技術棧與元件職責 (Tech Stack & Responsibilities)

| 元件類型 | 選型 / 技術 | 職責與用途 |
|---|---|---|
| **前端 (Frontend)** | React / Next.js / HTML5 + Tailwind CSS | 一頁式購物體驗、行動端優先 (Mobile-First)、帶參 QR Code 辨識與動態購物車 |
| **後端 (Backend)** | Node.js Express | 提供 API 服務、處理訂單成立、來源貓舍綁定、分潤計算邏輯 |
| **資料庫 (Database)** | MongoDB / PostgreSQL | 儲存 `Cattery` (貓舍)、`Product` (商品)、`Order` (訂單與分潤紀錄) |
| **容器部署** | Docker + Kubernetes (`petpa` namespace) | 部署檔 `prod/petpa.yaml`，透過 ArgoCD GitOps 自動同步 |
| **金流介接** | 綠界 ECPay / LINE Pay SDK | 提供信用卡、ATM 轉帳、超商條碼與貨到付款選項 |

---

## 🗄️ 3. 資料庫 Schema 設計 (Data Models)

### 3.1 合作貓舍模型 (`Cattery`)
```json
{
  "_id": "cat_001",
  "catteryId": "meow_house",
  "name": "喵喵萌寵專業貓舍",
  "logoUrl": "https://shop.petpa/cattery/meow_logo.png",
  "bannerUrl": "https://shop.petpa/cattery/meow_banner.jpg",
  "description": "致力於育養健康活潑小貓，提供專屬優質幼貓飼料與用品。",
  "qrCodeUrl": "https://shop.petpa/qrcode/meow_house.png",
  "commissionRate": 0.15,
  "bankAccount": {
    "bankCode": "822",
    "accountNumber": "123456789012"
  },
  "isActive": true,
  "createdAt": "2026-09-19T00:00:00Z"
}
```

### 3.2 商品模型 (`Product`)
重點涵蓋貓砂、分裝飼料、凍乾零食：
```json
{
  "_id": "prod_catlitter_01",
  "title": "Petpa 專用除臭豆腐貓砂 (6L)",
  "category": "cat_litter",
  "price": 220,
  "originalPrice": 280,
  "stock": 500,
  "isRecommended": true,
  "images": ["https://shop.petpa/images/litter.jpg"],
  "specifications": [{ "name": "容量", "value": "6L" }]
}
```

### 3.3 訂單與來源追蹤模型 (`Order`)
包含 `catteryId` 與 `commissionAmount` 分潤計算欄位：
```json
{
  "_id": "ord_20260919_1001",
  "orderNumber": "PETPA-20260919-9921",
  "catteryId": "meow_house",
  "customer": {
    "name": "林小姐",
    "phone": "0987654321",
    "address": "新北市板橋區文化路一段 100 號"
  },
  "items": [
    {
      "productId": "prod_catlitter_01",
      "title": "Petpa 專用除臭豆腐貓砂 (6L)",
      "quantity": 3,
      "unitPrice": 220,
      "subtotal": 660
    }
  ],
  "shippingFee": 80,
  "totalAmount": 740,
  "commissionAmount": 99.0,
  "paymentStatus": "Paid",
  "shippingStatus": "Processing",
  "createdAt": "2026-09-19T11:00:00Z"
}
```

---

## 🔌 4. API 介面規格 (API Specifications)

| HTTP Method | API 路徑 | 說明 | 存取權限 |
|---|---|---|---|
| `GET` | `/api/v1/cattery/:catteryId` | 取得貓舍專屬資訊 (Logo, 簡介, 專屬推薦商品) | 公開 (Public) |
| `GET` | `/api/v1/products` | 取得商品列表 (貓砂、分裝糧、凍乾零食) | 公開 (Public) |
| `POST` | `/api/v1/orders` | 一頁式送出訂單 (自動綁定帶入之 `catteryId`) | 公開 (Public) |
| `GET` | `/api/v1/admin/catteries` | 管理後台：檢視所有合作貓舍列表 | 管理員 (Admin) |
| `GET` | `/api/v1/admin/commission-reports` | 管理後台：查詢每家貓舍之訂單統計與分潤報表 | 管理員 (Admin) |
