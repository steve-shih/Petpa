# 🛠️ Petpa 寵物補給站 - 系統規劃設計 (System Design & Architecture)

本文檔詳細說明 **Petpa 合作貓舍/賣家自助註冊與分潤平台** 的系統架構、Node.js + Next.js 全棧選型、MongoDB + Redis 架構、螞蟻金融風分潤控制台、新潮前台 UI 風格以及 API 規格。

---

## 🏗️ 1. 系統整體角色與權限架構 (Role & System Architecture)

系統區分為三大核心角色與對應介面：

```mermaid
flowchart TD
    subgraph Roles [👥 三大系統角色]
        Customer[👨‍👩‍👧 貓咪家長]
        Partner[🐱 合作貓舍/賣家]
        Admin[👨‍💼 Petpa 平台管理員]
    end

    subgraph Frontends [🌐 介面層 (Next.js App Router)]
        StorefrontUI[🛍️ 前台一頁式商城 (新潮 Glassmorphism)]
        PartnerDashboard[📊 貓舍分潤控制台 (螞蟻金服 AntD Style)]
        AdminConsole[⚙️ 平台總管理後台 (螞蟻金服 AntD Style)]
    end

    subgraph Backend [⚡ Next.js API & Node.js Engine]
        API[RESTful APIs / Server Actions]
        Redis[(⚡ Redis Cache & Sessions & Referral)]
        Mongo[(🍃 MongoDB Primary Database)]
    end

    Customer -->|1. 掃碼進站/購物| StorefrontUI
    Partner -->|2. 線上註冊/自訂品牌/看分潤| PartnerDashboard
    Admin -->|3. 上架商品/統一出貨/審核提現| AdminConsole

    StorefrontUI --> API
    PartnerDashboard --> API
    AdminConsole --> API

    API <---> Redis
    API <---> Mongo
```

---

## 💻 2. 貓舍分潤控制台架構設計 (Ant Design Partner Dashboard Design)

貓舍/賣家專屬控制台採用 **螞蟻金融風格 (Ant Design Pro)** 打造，兼具商用質感與數據透明度：

### 2.1 控制台模組與視覺佈局
```
+-----------------------------------------------------------------------------------+
| 🐱 喵喵專業貓舍控制台                           [帳號設定] [推廣工具包] [登出]    |
+-----------------------------------------------------------------------------------+
|  [💰 本月預估分潤]     [💳 可提領餘額]     [📦 累積導流訂單]     [📈 顧客回購率]  |
|     NT$ 24,500           NT$ 18,200             156 筆               68.5%       |
+-----------------------------------------------------------------------------------+
|  📊 每日導流銷售與分潤趨勢折線圖 (Daily Referral Trend Chart)                     |
|  [折線圖：展示過去 30 天每日訂單數與分潤金額增長曲線]                             |
+-----------------------------------------------------------------------------------+
|  📋 最近導流訂單明細 (Referral Orders)  |  💳 分潤提現記錄 (Withdrawal History)    |
|  - 訂單號 / 日期 / 金額 / 分潤 / 狀態   |  - 申請日期 / 提現金額 / 狀態 / 匯款資訊  |
+-----------------------------------------------------------------------------------+
```

### 2.2 核心指標 (KPI Metrics)
1. **本月預估分潤 (Estimated Monthly Earnings)**：當月導流成立之訂單預估累積分潤。
2. **可提領餘額 (Available Balance)**：過 7 天鑑賞期已撥款且可一鍵申請提現至銀行帳戶之金額。
3. **累積導流訂單數 (Total Referral Orders)**：經由該貓舍 QR Code / 網址成交之總訂單數。
4. **專屬推廣工具包 (Referral Toolkit)**：一鍵下載高清專屬 QR Code 圖檔、一鍵複製推廣連結。

---

## 🗄️ 3. 資料庫 Schema 設計 (Data Models)

### 3.1 賣家/貓舍帳號模型 (`User` & `Cattery`)
```json
{
  "_id": "user_cat_001",
  "email": "cattery@meow.com",
  "passwordHash": "$2b$10$e8...",
  "role": "cattery_owner",
  "catteryProfile": {
    "catteryId": "meow_house",
    "name": "喵喵萌寵專業貓舍",
    "logoUrl": "https://shop.petpa/cattery/meow_logo.png",
    "bannerUrl": "https://shop.petpa/cattery/meow_banner.jpg",
    "description": "致力於育養健康活潑小貓，提供專屬優質幼貓飼料與用品。",
    "qrCodeUrl": "https://shop.petpa/qrcode/meow_house.png",
    "commissionRate": 0.15,
    "bankAccount": {
      "bankName": "中國信託",
      "bankCode": "822",
      "accountNumber": "123456789012",
      "accountName": "張大喵"
    },
    "isApproved": true
  },
  "createdAt": "2026-09-19T00:00:00Z"
}
```

### 3.2 分潤提現申請模型 (`WithdrawalRequest`)
```json
{
  "_id": "wd_20260919_001",
  "catteryId": "meow_house",
  "amount": 15000,
  "bankInfo": {
    "bankCode": "822",
    "accountNumber": "123456789012",
    "accountName": "張大喵"
  },
  "status": "Pending", // Pending, Approved, Transferred, Rejected
  "requestedAt": "2026-09-19T10:00:00Z",
  "transferredAt": null
}
```

---

## 🔌 4. API 介面規格 (API Specifications)

| HTTP Method | API 路徑 | 說明 | 存取權限 |
|---|---|---|---|
| `POST` | `/api/v1/auth/register-cattery` | 賣家/貓舍線上自助註冊帳號 | 公開 (Public) |
| `GET` | `/api/v1/partner/dashboard` | 取得貓舍專屬分潤 Dashboard 數據 (KPI, 趨勢圖, 訂單) | 貓舍賣家 (Cattery Owner) |
| `GET` | `/api/v1/partner/qrcode` | 下載貓舍專屬高清 QR Code 與取得推廣連結 | 貓舍賣家 (Cattery Owner) |
| `POST` | `/api/v1/partner/withdraw` | 貓舍申請分潤金額提現轉帳 | 貓舍賣家 (Cattery Owner) |
| `GET` | `/api/v1/admin/withdrawals` | 平台管理員審核與匯款提現紀錄管理 | 平台管理員 (Admin) |
| `POST` | `/api/v1/admin/products` | 平台管理員統一上架/修改商品 (賣家無法修改) | 平台管理員 (Admin) |
