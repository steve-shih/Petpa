// MongoDB Seed Script - 初始化 PETPA 資料庫假資料
// 此腳本在 docker-compose 啟動 MongoDB 容器時自動執行

db = db.getSiblingDB('PETPA');

// ==================== 管理員帳號 ====================
db.users.insertMany([
  {
    email: 'test@petpa.tw',
    password: '$2b$10$PLACEHOLDER_HASH_test1234',
    role: 'admin',
    label: '測試管理員 (含假資料)',
    isActive: true,
    createdAt: new Date(),
  },
  {
    email: 'admin@petpa.tw',
    password: '$2b$10$PLACEHOLDER_HASH_admin2026',
    role: 'admin',
    label: '正式管理員',
    isActive: true,
    createdAt: new Date(),
  },
]);

// ==================== 三方分潤設定 ====================
db.profitSplitConfigs.insertOne({
  name: '全站預設三方分潤',
  scope: 'GLOBAL',
  platformRate: 10.0,
  sellerRate: 15.0,
  operatorRate: 75.0,
  isActive: true,
  createdAt: new Date(),
});

// ==================== 商品分類 ====================
db.categories.insertMany([
  { slug: 'cat-food', name: '飼料', icon: '🍚', sortOrder: 1, defaultCommissionRate: 0.15, isSystem: true, isActive: true },
  { slug: 'cat-litter', name: '貓砂', icon: '🏖️', sortOrder: 2, defaultCommissionRate: 0.10, isSystem: true, isActive: true },
  { slug: 'cleaning', name: '清潔', icon: '🧼', sortOrder: 3, defaultCommissionRate: 0.20, isSystem: true, isActive: true },
  { slug: 'supplement', name: '保健品', icon: '💊', sortOrder: 4, defaultCommissionRate: 0.25, isSystem: true, isActive: true },
  { slug: 'freeze-dried', name: '凍乾零食', icon: '🥩', sortOrder: 5, defaultCommissionRate: 0.18, isSystem: false, isActive: true },
  { slug: 'canned', name: '主食罐頭', icon: '🥫', sortOrder: 6, defaultCommissionRate: 0.16, isSystem: false, isActive: true },
]);

// ==================== 飼料商品 ====================
db.products.insertMany([
  // 飼料
  { title: '皇家幼貓專用鮮採分裝糧 (500g)', categorySlug: 'cat-food', costPrice: 120, sellingPrice: 280, originalPrice: 350, taxRate: 0.05, taxAmount: 14, netProfit: 146, marginRate: 0.521, stock: 200, images: [], specifications: [{ name: '重量', value: '500g' }, { name: '適用', value: '幼貓 2-12月齡' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '渴望六種魚無穀全貓糧 (1kg 分裝)', categorySlug: 'cat-food', costPrice: 200, sellingPrice: 450, originalPrice: 550, taxRate: 0.05, taxAmount: 22.5, netProfit: 227.5, marginRate: 0.506, stock: 150, images: [], specifications: [{ name: '重量', value: '1kg' }, { name: '口味', value: '六種魚' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '巔峰鮮肉貓糧 雞肉口味 (800g)', categorySlug: 'cat-food', costPrice: 280, sellingPrice: 590, originalPrice: 720, taxRate: 0.05, taxAmount: 29.5, netProfit: 280.5, marginRate: 0.475, stock: 80, images: [], specifications: [{ name: '重量', value: '800g' }, { name: '口味', value: '放牧雞' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: 'Petpa 嚴選幼貓銜接糧 組合包 (300g×3)', categorySlug: 'cat-food', costPrice: 150, sellingPrice: 380, originalPrice: 450, taxRate: 0.05, taxAmount: 19, netProfit: 211, marginRate: 0.555, stock: 300, images: [], specifications: [{ name: '內容', value: '3種口味各300g' }, { name: '適用', value: '幼貓轉糧期' }], isRecommended: true, isActive: true, createdAt: new Date() },
  // 貓砂
  { title: 'Petpa 專用除臭豆腐貓砂 (6L)', categorySlug: 'cat-litter', costPrice: 80, sellingPrice: 220, originalPrice: 280, taxRate: 0.05, taxAmount: 11, netProfit: 129, marginRate: 0.586, stock: 500, images: [], specifications: [{ name: '容量', value: '6L' }, { name: '材質', value: '天然豆腐渣' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '礦型凝結貓砂 超強除臭 (10L)', categorySlug: 'cat-litter', costPrice: 60, sellingPrice: 180, originalPrice: 230, taxRate: 0.05, taxAmount: 9, netProfit: 111, marginRate: 0.617, stock: 400, images: [], specifications: [{ name: '容量', value: '10L' }, { name: '材質', value: '天然礦石' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: '松木環保貓砂 崩解型 (8L)', categorySlug: 'cat-litter', costPrice: 70, sellingPrice: 200, originalPrice: 250, taxRate: 0.05, taxAmount: 10, netProfit: 120, marginRate: 0.600, stock: 300, images: [], specifications: [{ name: '容量', value: '8L' }, { name: '材質', value: '松木屑' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: '豆腐砂箱購組合 (6L×3包)', categorySlug: 'cat-litter', costPrice: 200, sellingPrice: 580, originalPrice: 660, taxRate: 0.05, taxAmount: 29, netProfit: 351, marginRate: 0.605, stock: 200, images: [], specifications: [{ name: '內容', value: '6L×3包' }, { name: '優惠', value: '箱購省$80' }], isRecommended: true, isActive: true, createdAt: new Date() },
  // 清潔
  { title: '寵物專用除臭噴霧 (300ml)', categorySlug: 'cleaning', costPrice: 45, sellingPrice: 180, originalPrice: 220, taxRate: 0.05, taxAmount: 9, netProfit: 126, marginRate: 0.700, stock: 250, images: [], specifications: [{ name: '容量', value: '300ml' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '貓咪洗毛精 低敏溫和配方 (500ml)', categorySlug: 'cleaning', costPrice: 65, sellingPrice: 250, originalPrice: 300, taxRate: 0.05, taxAmount: 12.5, netProfit: 172.5, marginRate: 0.690, stock: 180, images: [], specifications: [{ name: '容量', value: '500ml' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: '寵物環境清潔濕紙巾 (80抽)', categorySlug: 'cleaning', costPrice: 30, sellingPrice: 120, originalPrice: 150, taxRate: 0.05, taxAmount: 6, netProfit: 84, marginRate: 0.700, stock: 400, images: [], specifications: [{ name: '數量', value: '80抽/包' }], isRecommended: false, isActive: true, createdAt: new Date() },
  // 保健品
  { title: '貓咪排毛粉 化毛配方 (60g)', categorySlug: 'supplement', costPrice: 80, sellingPrice: 350, originalPrice: 420, taxRate: 0.05, taxAmount: 17.5, netProfit: 252.5, marginRate: 0.721, stock: 120, images: [], specifications: [{ name: '重量', value: '60g' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '寵物益生菌 腸道保健 (30包)', categorySlug: 'supplement', costPrice: 100, sellingPrice: 420, originalPrice: 500, taxRate: 0.05, taxAmount: 21, netProfit: 299, marginRate: 0.712, stock: 100, images: [], specifications: [{ name: '數量', value: '30包/盒' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '深海魚油 Omega-3 軟膠囊 (90粒)', categorySlug: 'supplement', costPrice: 120, sellingPrice: 480, originalPrice: 580, taxRate: 0.05, taxAmount: 24, netProfit: 336, marginRate: 0.700, stock: 90, images: [], specifications: [{ name: '數量', value: '90粒/瓶' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: '離胺酸 L-Lysine 貓咪免疫粉 (100g)', categorySlug: 'supplement', costPrice: 90, sellingPrice: 380, originalPrice: 450, taxRate: 0.05, taxAmount: 19, netProfit: 271, marginRate: 0.713, stock: 110, images: [], specifications: [{ name: '重量', value: '100g' }], isRecommended: false, isActive: true, createdAt: new Date() },
  // 凍乾零食
  { title: '純雞胸肉凍乾 貓咪零食 (50g)', categorySlug: 'freeze-dried', costPrice: 55, sellingPrice: 200, originalPrice: 250, taxRate: 0.05, taxAmount: 10, netProfit: 135, marginRate: 0.675, stock: 350, images: [], specifications: [{ name: '重量', value: '50g' }], isRecommended: true, isActive: true, createdAt: new Date() },
  { title: '鮭魚凍乾 Omega 營養零食 (40g)', categorySlug: 'freeze-dried', costPrice: 70, sellingPrice: 250, originalPrice: 300, taxRate: 0.05, taxAmount: 12.5, netProfit: 167.5, marginRate: 0.670, stock: 200, images: [], specifications: [{ name: '重量', value: '40g' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: '干貝凍乾 頂級獎勵零食 (30g)', categorySlug: 'freeze-dried', costPrice: 90, sellingPrice: 320, originalPrice: 380, taxRate: 0.05, taxAmount: 16, netProfit: 214, marginRate: 0.669, stock: 150, images: [], specifications: [{ name: '重量', value: '30g' }], isRecommended: true, isActive: true, createdAt: new Date() },
  // 主食罐頭
  { title: '鮮燉雞肉主食罐 (170g)', categorySlug: 'canned', costPrice: 35, sellingPrice: 85, originalPrice: 100, taxRate: 0.05, taxAmount: 4.25, netProfit: 45.75, marginRate: 0.538, stock: 600, images: [], specifications: [{ name: '重量', value: '170g' }], isRecommended: false, isActive: true, createdAt: new Date() },
  { title: '白身鮪魚主食罐 (170g)', categorySlug: 'canned', costPrice: 38, sellingPrice: 90, originalPrice: 110, taxRate: 0.05, taxAmount: 4.5, netProfit: 47.5, marginRate: 0.528, stock: 500, images: [], specifications: [{ name: '重量', value: '170g' }], isRecommended: false, isActive: true, createdAt: new Date() },
]);

// ==================== 合作貓舍 ====================
db.catteries.insertMany([
  { catteryId: 'meow_house', name: '喵喵萌寵專業貓舍', description: '致力於育養健康活潑的英國短毛貓與蘇格蘭摺耳貓，提供專屬優質幼貓飼料與用品推薦。', isApproved: true, createdAt: new Date() },
  { catteryId: 'golden_paw', name: '金爪名貓坊', description: '專業布偶貓繁殖，擁有 CFA 認證種貓血統，為每一位新家長提供完善的飼養指導。', isApproved: true, createdAt: new Date() },
  { catteryId: 'whisker_land', name: '鬍鬚樂園貓舍', description: '美國短毛貓與曼赤肯專業貓舍，堅持健康優先、陪伴一生的繁殖理念。', isApproved: true, createdAt: new Date() },
  { catteryId: 'star_cat', name: '星辰貓咪莊園', description: '豹貓與阿比西尼亞貓專業繁育，提供帶毛孩回家後的完整營養銜接方案。', isApproved: false, createdAt: new Date() },
]);

// ==================== 訂單假資料 ====================
db.orders.insertMany([
  { orderNumber: 'PETPA-20260915-0001', catteryId: 'meow_house', customer: { name: '林小姐', phone: '0912345678', address: '台北市大安區' }, items: [{ title: '皇家幼貓專用鮮採分裝糧 (500g)', quantity: 2, unitPrice: 280, costPrice: 120, taxAmount: 14, netProfit: 146 }, { title: 'Petpa 專用除臭豆腐貓砂 (6L)', quantity: 3, unitPrice: 220, costPrice: 80, taxAmount: 11, netProfit: 129 }], subtotal: 1220, shippingFee: 40, totalAmount: 1260, profitBreakdown: { totalNetProfit: 679, platformProfit: 67.9, operatorProfit: 509.25, sellerProfit: 101.85, splitRateSnapshot: { platformRate: 10, operatorRate: 75, sellerRate: 15 } }, paymentStatus: 'Paid', shippingStatus: 'Completed', createdAt: new Date('2026-09-15T10:30:00Z') },
  { orderNumber: 'PETPA-20260915-0002', catteryId: 'golden_paw', customer: { name: '張先生', phone: '0923456789', address: '台中市西區' }, items: [{ title: '渴望六種魚無穀全貓糧 (1kg)', quantity: 1, unitPrice: 450, costPrice: 200, taxAmount: 22.5, netProfit: 227.5 }, { title: '貓咪排毛粉 化毛配方 (60g)', quantity: 1, unitPrice: 350, costPrice: 80, taxAmount: 17.5, netProfit: 252.5 }], subtotal: 800, shippingFee: 90, totalAmount: 890, profitBreakdown: { totalNetProfit: 480, platformProfit: 48, operatorProfit: 360, sellerProfit: 72, splitRateSnapshot: { platformRate: 10, operatorRate: 75, sellerRate: 15 } }, paymentStatus: 'Paid', shippingStatus: 'Completed', createdAt: new Date('2026-09-15T14:20:00Z') },
  { orderNumber: 'PETPA-20260916-0003', catteryId: 'meow_house', customer: { name: '王太太', phone: '0934567890', address: '高雄市左營區' }, items: [{ title: '豆腐砂箱購組合 (6L×3包)', quantity: 2, unitPrice: 580, costPrice: 200, taxAmount: 29, netProfit: 351 }, { title: '寵物益生菌 腸道保健 (30包)', quantity: 1, unitPrice: 420, costPrice: 100, taxAmount: 21, netProfit: 299 }], subtotal: 1580, shippingFee: 0, totalAmount: 2150, profitBreakdown: { totalNetProfit: 1001, platformProfit: 100.1, operatorProfit: 750.75, sellerProfit: 150.15, splitRateSnapshot: { platformRate: 10, operatorRate: 75, sellerRate: 15 } }, paymentStatus: 'Paid', shippingStatus: 'Shipped', createdAt: new Date('2026-09-16T09:15:00Z') },
  { orderNumber: 'PETPA-20260917-0005', catteryId: 'meow_house', customer: { name: '李先生', phone: '0956789012', address: '台北市信義區' }, items: [{ title: '巔峰鮮肉貓糧 雞肉口味 (800g)', quantity: 2, unitPrice: 590, costPrice: 280, taxAmount: 29.5, netProfit: 280.5 }, { title: '純雞胸肉凍乾 貓咪零食 (50g)', quantity: 2, unitPrice: 200, costPrice: 55, taxAmount: 10, netProfit: 135 }], subtotal: 1580, shippingFee: 100, totalAmount: 1680, profitBreakdown: { totalNetProfit: 831, platformProfit: 83.1, operatorProfit: 623.25, sellerProfit: 124.65, splitRateSnapshot: { platformRate: 10, operatorRate: 75, sellerRate: 15 } }, paymentStatus: 'Paid', shippingStatus: 'Processing', createdAt: new Date('2026-09-17T11:00:00Z') },
  { orderNumber: 'PETPA-20260919-0010', catteryId: 'meow_house', customer: { name: '周先生', phone: '0989012345', address: '桃園市中壢區' }, items: [{ title: 'Petpa 嚴選幼貓銜接糧 (300g×3)', quantity: 1, unitPrice: 380, costPrice: 150, taxAmount: 19, netProfit: 211 }, { title: '寵物專用除臭噴霧 (300ml)', quantity: 2, unitPrice: 180, costPrice: 45, taxAmount: 9, netProfit: 126 }], subtotal: 740, shippingFee: 0, totalAmount: 960, profitBreakdown: { totalNetProfit: 463, platformProfit: 46.3, operatorProfit: 347.25, sellerProfit: 69.45, splitRateSnapshot: { platformRate: 10, operatorRate: 75, sellerRate: 15 } }, paymentStatus: 'Paid', shippingStatus: 'Paid', createdAt: new Date('2026-09-19T12:00:00Z') },
]);

print('✅ PETPA 資料庫初始化完成！');
print('  - 2 個管理員帳號（測試 + 正式）');
print('  - 6 個商品分類');
print('  - 20 件商品（飼料/貓砂/清潔/保健品/凍乾/罐頭）');
print('  - 4 家合作貓舍');
print('  - 5 筆訂單（含三方利潤分配明細）');
print('  - 1 組全站分潤設定');
