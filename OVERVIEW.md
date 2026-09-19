# 🐾 Petpa 寵物補給站 - 合作貓舍一頁式電商企劃書 (Executive Overview)

## 📌 一、企劃核心概念 (Core Concept)

**Petpa 寵物補給站** 旨在打造一個**以「合作貓舍」為核心**的一頁式電商購物平台。

當新手家長向合作貓舍帶回幼貓時，貓舍會提供附有專屬 **QR Code** 的「新家嫁妝包」或推薦卡。家長掃碼後，即可直接進入**該貓舍的專屬商城頁面**，方便購買貓咪習慣使用的貓砂、分裝飼料與凍乾零食。

本平台巧妙串聯「貓咪交付」與「家長後續日常用品回購」，讓貓舍獲得長期分潤收益，同時為家長提供極簡、信任度高的回購管道，平台則統一負責商品、庫存、金流與物流出貨。

---

## 💻 二、技術選型與視覺風格總覽 (Tech Stack & Design Styles)

1. **核心架構 (Core Stack)**：**Node.js + Next.js (App Router)** 全棧架構，支援動態 SSR 與高並發處理。
2. **資料庫層 (Database Layer)**：
   - **MongoDB**：儲存貓舍資料、商品目錄、訂單與分潤紀錄。
   - **Redis**：處理購物車 Session、貓舍 QR Code 對照快取、庫存原子扣減（防超賣）。
3. **後台管理端風格 (Admin UI Style)**：**螞蟻金融風格 (Ant Design Pro)** — 專業深藍/白數據圖表看板、高效率對帳表格與權限管理。
4. **前台一頁式商城風格 (Storefront UI Style)**：**新潮活潑 (Trendy Modern UI)** — 行動端優先 (Mobile-First)、玻璃擬態卡片 (Glassmorphism)、暖色調活力漸層、極簡 30 秒下單體驗。

---

## 🔄 三、整體營運流程 (End-to-End Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor Cattery as 🐱 合作貓舍
    actor Owner as 👨‍👩‍👧 貓咪家長
    participant Platform as 🏪 Petpa 平台 (shop.petpa)
    participant Warehouse as 📦 平台倉庫/物流

    Cattery->>Owner: 1. 交付貓咪 + 贈送嫁妝包 (附專屬 QR Code)
    Owner->>Platform: 2. 手機掃描 QR Code / 點擊連結
    Platform-->>Owner: 3. 展示貓舍專屬一頁式商城 (Logo/簡介/推薦商品)
    Owner->>Platform: 4. 選購商品 (貓砂/分裝糧/凍乾) 並完成一頁式付款
    Platform->>Warehouse: 5. 系統記錄訂單來源貓舍，觸發出貨
    Warehouse->>Owner: 6. 宅配/超商快速送達家長家中
    Platform->>Cattery: 7. 系統自動計算合作分潤，發送月結報表
```

---

## 🏠 四、合作貓舍專屬頁面 (Cattery Custom Storefront)

每一家合作貓舍皆擁有**獨立的專屬頁面與專屬 QR Code**，提升貓舍的專業品牌形象：
- **專屬品牌展示**：自訂貓舍名稱、Logo、介紹與育種理念。
- **貓舍主打/推薦商品**：貓舍可選出專屬推薦清單（如幼貓銜接飼料組合、指定貓砂）。
- **專屬 QR Code 與網址**：例如 `shop.petpa/?cattery=meow_house`，讓貓舍感覺這是自己的專屬線上商城。

---

## 🥩 五、初期商品規劃 (Product Focus)

第一階段聚焦於高頻回購之核心貓用消耗品，並針對行動裝置進行最佳化購買設計：
1. **貓砂 (Cat Litter)**：豆腐砂、礦砂、木屑砂等大宗回購品項。
2. **分裝飼料 (Portioned Cat Food)**：提供適口性佳、小包裝鮮採分裝之幼貓與成貓主糧。
3. **凍乾零食 (Freeze-Dried Treats)**：高蛋白、單一肉源零食與獎勵品。
4. *（未來擴充）*：罐頭、貓抓板、日常清潔保健用品。

---

## 💳 六、購物流程與金流規劃 (Checkout & Payment)

- **最少步驟購物**：掃碼進入 ➔ 點選數量 ➔ 填寫收件資訊 ➔ 付款，全程在單頁 30 秒內完成。
- **靈活金流支援**：支援信用卡、LINE Pay、超商代碼/條碼與貨到付款，降低下單阻力。

---

## 📊 七、後台與分潤機制 (Referral & Backoffice)

- **權責分工**：
  - **合作貓舍**：負責精準導流、推薦與品質背書。
  - **Petpa 平台**：負責商品備貨、倉儲包裝、金流收款、發票開立與物流配送。
- **訂單來源追蹤**：系統於 Redis / Cookie / 資料庫中永久綁定貓舍代碼（`catteryId`），即使家長未來直接回購，仍能正確歸屬至原貓舍並計算分潤。

---

## 🎯 八、第一階段 (MVP) 開發重點

先行完成**可實際運作的基本版本**，確保商業閉環能快速上線驗證：
1. **貓舍專屬頁面範本**與 QR Code 帶參路由。
2. **三類核心商品（貓砂、分裝糧、凍乾）展示與一頁購物車**。
3. **金流介接與訂單建立**。
4. **訂單來源追蹤 (Referral Tracking) 與貓舍基礎統計後台**。
