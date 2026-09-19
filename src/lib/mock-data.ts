// Mock data for Petpa prototype - 假資料模組
// DB: PETPA (本地 MongoDB)

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  defaultCommissionRate: number;
  isSystem: boolean;
  isActive: boolean;
  reviewStatus?: 'Approved' | 'PendingReview' | 'Rejected'; // Admin 審核狀態
  proposedByCatteryId?: string; // 哪家店家提出的分類建議
}

export interface SellerProductConfig {
  catteryId: string;
  customBadge?: string; // 🏷️ 賣家自訂多元標籤 (如：🔥 店長推薦、👑 貓舍血統專用、✨ 降價回饋、必備首選)
  customPrice?: number; // 💰 賣家自訂售價 (不可低於 Admin 建議售價，除非申請特殊價)
  customOriginalPrice?: number; // 🏷️ 劃線打折原價 (計算折扣 % 顯示)
  // 大量採購 / 特殊低價合約申請
  bulkThresholdQty?: number; // 超過此數量 (例如 >50 件) 申請特殊優惠價
  specialDiscountPrice?: number; // 簽訂特殊批發價 (例如 NT$250)
  specialPriceStatus?: 'Approved' | 'PendingReview' | 'Rejected'; // 經 Admin 審批
  specialPriceReason?: string; // 申請原因說明
}

export interface Product {
  _id: string;
  title: string;
  categoryId: string;
  categorySlug: string;
  costPrice: number;
  sellingPrice: number; // 管理員預設底價 / 建議售價
  originalPrice: number;
  taxRate: number;
  taxAmount: number;
  netProfit: number;
  marginRate: number;
  stock: number;
  images: string[];
  pdfUrl?: string; // 📄 可選的合約/相關文件 PDF 連結
  pdfTitle?: string; // 📄 PDF 文件標題 (如：飼料檢驗報告、合約書)
  targetCatteries?: string[]; // 🏬 由 Admin 決定上架到哪些貓舍 (若包含 'all' 或未指定則全上架)
  sellerConfigs?: Record<string, SellerProductConfig>; // 各貓舍賣家的客製化標籤、售價與特殊價合約
  specifications: { name: string; value: string }[];
  isRecommended: boolean;
  isActive: boolean;
  reviewStatus?: 'Approved' | 'PendingReview' | 'Rejected'; // 賣家自行修改/新增商品經 Admin 審核
  proposedByCatteryId?: string; // 申請修改/新增的貓舍
}

export interface Kitten {
  _id: string;
  catteryId: string;
  name: string;
  breed: string;
  gender: '公' | '母';
  birthday: string;
  fatherName?: string;
  motherName?: string;
  vaccines: string[];
  dewormed: boolean;
  microchipNumber?: string;
  price: number;
  status: 'Available' | 'Reserved' | 'Sold'; // 待預定 | 已預定 | 已售出
  description: string;
  images: string[];
  pdfUrl?: string; // 📄 可選的活體定型化契約 / 晶片移轉 PDF 檔案
  pdfTitle?: string; // 📄 PDF 文件顯示名稱 (例如：寵物買賣定型化契約.pdf)
}

export interface Cattery {
  _id: string;
  catteryId: string;
  slug: string; // url/shop/:slug (例如：meow-house, golden-paw)
  name: string;
  sellerType?: 'cattery' | 'influencer'; // 🐱 實體貓舍 / 📱 社群KOL賣家
  socialPlatform?: string; // IG, YouTube, FB 粉絲頁
  followerCount?: string; // 粉絲數量
  logoUrl: string;
  bannerUrl?: string;
  bannerPreset?: string;
  themeColor?: string;
  description: string;
  isApproved: boolean;
  // 帳號與密碼
  loginEmail?: string;
  initialPassword?: string;
  // 特寵特定登記許可證 (社群 KOL 免填)
  licenseNumber?: string; // 特定寵物業許可證字號
  enableKittens?: boolean;
  contactPhone?: string;
  address?: string;
  // 頁面動態媒體與組件設定
  videoUrl?: string;
  enableVideoAd?: boolean;
  headerVideoTitle?: string;
  activeWidgets?: string[];
}

// ==================== 進銷存 (ERP) 異動紀錄 ====================
export interface InventoryLog {
  _id: string;
  productId: string;
  productTitle: string;
  catteryId: string;
  type: 'Inbound' | 'Outbound' | 'ReturnRestock' | 'Adjustment'; // 進貨 | 銷貨出庫 | 退貨入庫 | 盤點微調
  qtyChange: number; // 正數代表增加，負數代表減少
  beforeStock: number;
  afterStock: number;
  reason: string;
  operatorRole: 'super_admin' | 'admin' | 'seller';
  operatorName: string;
  createdAt: string;
}

// ==================== 退貨 / 售後單 ====================
export interface ReturnOrder {
  _id: string;
  returnNumber: string;
  orderNumber: string;
  catteryId: string;
  catteryName: string;
  customerName: string;
  productTitle: string;
  qty: number;
  refundAmount: number;
  reason: '規格不符' | '包裝破損' | '商品瑕疵' | '買家改意退貨';
  status: 'PendingReview' | 'Approved' | 'Refunded' | 'Rejected'; // 待審核 | 已同意退貨 | 已完成退款 | 已拒絕
  restockInventory: boolean; // 是否完成自動補回進銷存庫存
  createdAt: string;
}

// ==================== 平台特權級別審計日誌 (Audit Log) ====================
export interface AuditLog {
  _id: string;
  timestamp: string;
  role: 'super_admin' | 'admin' | 'seller' | 'buyer'; // 👑 平台最高管理員 | 👨‍💼 管理員 | 🐱/📱 賣家 | 🛍️ 買家
  userEmail: string;
  userName: string;
  ipAddress: string;
  deviceInfo: string; // Browser / OS
  apiEndpoint: string; // 例如: POST /api/v1/admin/products/approve
  actionType: 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVAL' | 'EXPORTS';
  actionDetails: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  catteryId: string;
  catteryName: string;
  customerName: string;
  totalAmount: number;
  sellerProfit: number;
  status: string;
  createdAt: string;
}

// ==================== 商品分類 ====================
export const categories: Category[] = [
  { _id: 'cat_food', name: '飼料', slug: 'cat-food', icon: '🍚', sortOrder: 1, defaultCommissionRate: 0.15, isSystem: true, isActive: true },
  { _id: 'cat_litter', name: '貓砂', slug: 'cat-litter', icon: '🏖️', sortOrder: 2, defaultCommissionRate: 0.10, isSystem: true, isActive: true },
  { _id: 'cleaning', name: '清潔', slug: 'cleaning', icon: '🧼', sortOrder: 3, defaultCommissionRate: 0.20, isSystem: true, isActive: true },
  { _id: 'supplement', name: '保健品', slug: 'supplement', icon: '💊', sortOrder: 4, defaultCommissionRate: 0.25, isSystem: true, isActive: true },
  { _id: 'freeze_dried', name: '凍乾零食', slug: 'freeze-dried', icon: '🥩', sortOrder: 5, defaultCommissionRate: 0.18, isSystem: false, isActive: true },
  { _id: 'canned', name: '主食罐頭', slug: 'canned', icon: '🥫', sortOrder: 6, defaultCommissionRate: 0.16, isSystem: false, isActive: true },
];

// ==================== 飼料商品 ====================
const foodProducts: Product[] = [
  {
    _id: 'prod_food_01',
    title: '皇家幼貓專用鮮採分裝糧 (500g)',
    categoryId: 'cat_food', categorySlug: 'cat-food',
    costPrice: 120, sellingPrice: 280, originalPrice: 350, taxRate: 0.05,
    taxAmount: 14, netProfit: 146, marginRate: 0.521,
    stock: 200, images: ['/images/food-kitten.jpg'],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfTitle: '📋 皇家幼貓糧 SGS 檢驗報告與成分證明.pdf',
    targetCatteries: ['meow_house', 'golden_paw'], // 僅在喵喵萌寵與金爪名貓坊上架
    specifications: [{ name: '重量', value: '500g' }, { name: '適用', value: '幼貓 2-12月齡' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_food_02',
    title: '渴望六種魚無穀全貓糧 (1kg 分裝)',
    categoryId: 'cat_food', categorySlug: 'cat-food',
    costPrice: 200, sellingPrice: 450, originalPrice: 550, taxRate: 0.05,
    taxAmount: 22.5, netProfit: 227.5, marginRate: 0.506,
    stock: 150, images: ['/images/food-orijen.jpg'],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfTitle: '📄 渴望全貓糧進口防檢疫證明文件.pdf',
    targetCatteries: ['all'], // 全部貓舍皆上架
    specifications: [{ name: '重量', value: '1kg' }, { name: '口味', value: '六種魚' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_food_03',
    title: '巔峰鮮肉貓糧 雞肉口味 (800g)',
    categoryId: 'cat_food', categorySlug: 'cat-food',
    costPrice: 280, sellingPrice: 590, originalPrice: 720, taxRate: 0.05,
    taxAmount: 29.5, netProfit: 280.5, marginRate: 0.475,
    stock: 80, images: ['/images/food-ziwi.jpg'],
    specifications: [{ name: '重量', value: '800g' }, { name: '口味', value: '放牧雞' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_food_04',
    title: 'Petpa 嚴選幼貓銜接糧 組合包 (300g×3)',
    categoryId: 'cat_food', categorySlug: 'cat-food',
    costPrice: 150, sellingPrice: 380, originalPrice: 450, taxRate: 0.05,
    taxAmount: 19, netProfit: 211, marginRate: 0.555,
    stock: 300, images: ['/images/food-combo.jpg'],
    specifications: [{ name: '內容', value: '3種口味各300g' }, { name: '適用', value: '幼貓轉糧期' }],
    isRecommended: true, isActive: true,
  },
];

// ==================== 貓砂商品 ====================
const litterProducts: Product[] = [
  {
    _id: 'prod_litter_01',
    title: 'Petpa 專用除臭豆腐貓砂 (6L)',
    categoryId: 'cat_litter', categorySlug: 'cat-litter',
    costPrice: 80, sellingPrice: 220, originalPrice: 280, taxRate: 0.05,
    taxAmount: 11, netProfit: 129, marginRate: 0.586,
    stock: 500, images: ['/images/litter-tofu.jpg'],
    specifications: [{ name: '容量', value: '6L' }, { name: '材質', value: '天然豆腐渣' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_litter_02',
    title: '礦型凝結貓砂 超強除臭 (10L)',
    categoryId: 'cat_litter', categorySlug: 'cat-litter',
    costPrice: 60, sellingPrice: 180, originalPrice: 230, taxRate: 0.05,
    taxAmount: 9, netProfit: 111, marginRate: 0.617,
    stock: 400, images: ['/images/litter-mineral.jpg'],
    specifications: [{ name: '容量', value: '10L' }, { name: '材質', value: '天然礦石' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_litter_03',
    title: '松木環保貓砂 崩解型 (8L)',
    categoryId: 'cat_litter', categorySlug: 'cat-litter',
    costPrice: 70, sellingPrice: 200, originalPrice: 250, taxRate: 0.05,
    taxAmount: 10, netProfit: 120, marginRate: 0.600,
    stock: 300, images: ['/images/litter-wood.jpg'],
    specifications: [{ name: '容量', value: '8L' }, { name: '材質', value: '松木屑' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_litter_04',
    title: '豆腐砂箱購組合 (6L×3包)',
    categoryId: 'cat_litter', categorySlug: 'cat-litter',
    costPrice: 200, sellingPrice: 580, originalPrice: 660, taxRate: 0.05,
    taxAmount: 29, netProfit: 351, marginRate: 0.605,
    stock: 200, images: ['/images/litter-combo.jpg'],
    specifications: [{ name: '內容', value: '6L×3包' }, { name: '優惠', value: '箱購省$80' }],
    isRecommended: true, isActive: true,
  },
];

// ==================== 清潔商品 ====================
const cleaningProducts: Product[] = [
  {
    _id: 'prod_clean_01',
    title: '寵物專用除臭噴霧 (300ml)',
    categoryId: 'cleaning', categorySlug: 'cleaning',
    costPrice: 45, sellingPrice: 180, originalPrice: 220, taxRate: 0.05,
    taxAmount: 9, netProfit: 126, marginRate: 0.700,
    stock: 250, images: ['/images/clean-spray.jpg'],
    specifications: [{ name: '容量', value: '300ml' }, { name: '成分', value: '天然植萃' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_clean_02',
    title: '貓咪洗毛精 低敏溫和配方 (500ml)',
    categoryId: 'cleaning', categorySlug: 'cleaning',
    costPrice: 65, sellingPrice: 250, originalPrice: 300, taxRate: 0.05,
    taxAmount: 12.5, netProfit: 172.5, marginRate: 0.690,
    stock: 180, images: ['/images/clean-shampoo.jpg'],
    specifications: [{ name: '容量', value: '500ml' }, { name: '適用', value: '全齡貓' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_clean_03',
    title: '寵物環境清潔濕紙巾 (80抽)',
    categoryId: 'cleaning', categorySlug: 'cleaning',
    costPrice: 30, sellingPrice: 120, originalPrice: 150, taxRate: 0.05,
    taxAmount: 6, netProfit: 84, marginRate: 0.700,
    stock: 400, images: ['/images/clean-wipes.jpg'],
    specifications: [{ name: '數量', value: '80抽/包' }, { name: '特色', value: '無酒精配方' }],
    isRecommended: false, isActive: true,
  },
];

// ==================== 保健品商品 ====================
const supplementProducts: Product[] = [
  {
    _id: 'prod_supp_01',
    title: '貓咪排毛粉 化毛配方 (60g)',
    categoryId: 'supplement', categorySlug: 'supplement',
    costPrice: 80, sellingPrice: 350, originalPrice: 420, taxRate: 0.05,
    taxAmount: 17.5, netProfit: 252.5, marginRate: 0.721,
    stock: 120, images: ['/images/supp-hairball.jpg'],
    specifications: [{ name: '重量', value: '60g' }, { name: '功效', value: '化毛排毛' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_supp_02',
    title: '寵物益生菌 腸道保健 (30包)',
    categoryId: 'supplement', categorySlug: 'supplement',
    costPrice: 100, sellingPrice: 420, originalPrice: 500, taxRate: 0.05,
    taxAmount: 21, netProfit: 299, marginRate: 0.712,
    stock: 100, images: ['/images/supp-probiotic.jpg'],
    specifications: [{ name: '數量', value: '30包/盒' }, { name: '功效', value: '腸胃調理' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_supp_03',
    title: '深海魚油 Omega-3 軟膠囊 (90粒)',
    categoryId: 'supplement', categorySlug: 'supplement',
    costPrice: 120, sellingPrice: 480, originalPrice: 580, taxRate: 0.05,
    taxAmount: 24, netProfit: 336, marginRate: 0.700,
    stock: 90, images: ['/images/supp-fishoil.jpg'],
    specifications: [{ name: '數量', value: '90粒/瓶' }, { name: '功效', value: '皮膚毛髮保健' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_supp_04',
    title: '離胺酸 L-Lysine 貓咪免疫粉 (100g)',
    categoryId: 'supplement', categorySlug: 'supplement',
    costPrice: 90, sellingPrice: 380, originalPrice: 450, taxRate: 0.05,
    taxAmount: 19, netProfit: 271, marginRate: 0.713,
    stock: 110, images: ['/images/supp-lysine.jpg'],
    specifications: [{ name: '重量', value: '100g' }, { name: '功效', value: '增強免疫力' }],
    isRecommended: false, isActive: true,
  },
];

// ==================== 凍乾零食 ====================
const freezeDriedProducts: Product[] = [
  {
    _id: 'prod_fd_01',
    title: '純雞胸肉凍乾 貓咪零食 (50g)',
    categoryId: 'freeze_dried', categorySlug: 'freeze-dried',
    costPrice: 55, sellingPrice: 200, originalPrice: 250, taxRate: 0.05,
    taxAmount: 10, netProfit: 135, marginRate: 0.675,
    stock: 350, images: ['/images/fd-chicken.jpg'],
    specifications: [{ name: '重量', value: '50g' }, { name: '成分', value: '100% 雞胸肉' }],
    isRecommended: true, isActive: true,
  },
  {
    _id: 'prod_fd_02',
    title: '鮭魚凍乾 Omega 營養零食 (40g)',
    categoryId: 'freeze_dried', categorySlug: 'freeze-dried',
    costPrice: 70, sellingPrice: 250, originalPrice: 300, taxRate: 0.05,
    taxAmount: 12.5, netProfit: 167.5, marginRate: 0.670,
    stock: 200, images: ['/images/fd-salmon.jpg'],
    specifications: [{ name: '重量', value: '40g' }, { name: '成分', value: '100% 鮭魚' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_fd_03',
    title: '干貝凍乾 頂級獎勵零食 (30g)',
    categoryId: 'freeze_dried', categorySlug: 'freeze-dried',
    costPrice: 90, sellingPrice: 320, originalPrice: 380, taxRate: 0.05,
    taxAmount: 16, netProfit: 214, marginRate: 0.669,
    stock: 150, images: ['/images/fd-scallop.jpg'],
    specifications: [{ name: '重量', value: '30g' }, { name: '成分', value: '100% 日本干貝' }],
    isRecommended: true, isActive: true,
  },
];

// ==================== 主食罐頭 ====================
const cannedProducts: Product[] = [
  {
    _id: 'prod_can_01',
    title: '鮮燉雞肉主食罐 (170g)',
    categoryId: 'canned', categorySlug: 'canned',
    costPrice: 35, sellingPrice: 85, originalPrice: 100, taxRate: 0.05,
    taxAmount: 4.25, netProfit: 45.75, marginRate: 0.538,
    stock: 600, images: ['/images/can-chicken.jpg'],
    specifications: [{ name: '重量', value: '170g' }, { name: '口味', value: '鮮燉雞肉' }],
    isRecommended: false, isActive: true,
  },
  {
    _id: 'prod_can_02',
    title: '白身鮪魚主食罐 (170g)',
    categoryId: 'canned', categorySlug: 'canned',
    costPrice: 38, sellingPrice: 90, originalPrice: 110, taxRate: 0.05,
    taxAmount: 4.5, netProfit: 47.5, marginRate: 0.528,
    stock: 500, images: ['/images/can-tuna.jpg'],
    specifications: [{ name: '重量', value: '170g' }, { name: '口味', value: '白身鮪魚' }],
    isRecommended: false, isActive: true,
  },
];

// ==================== 全部商品 ====================
export const products: Product[] = [
  ...foodProducts,
  ...litterProducts,
  ...cleaningProducts,
  ...supplementProducts,
  ...freezeDriedProducts,
  ...cannedProducts,
];

// ==================== 封面主體預設主題庫 ====================
export const bannerPresets = [
  { id: 'warm-amber', name: '暖陽琥珀 (預設)', gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFECD2 50%, #FFD6A5 100%)', badgeBg: '#FEF3C7', badgeColor: '#D97706', accentColor: '#F97316' },
  { id: 'emerald-forest', name: '森林翡翠', gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #A7F3D0 100%)', badgeBg: '#D1FAE5', badgeColor: '#047857', accentColor: '#10B981' },
  { id: 'lavender-dream', name: '夢幻薰衣草', gradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)', badgeBg: '#EDE9FE', badgeColor: '#6D28D9', accentColor: '#8B5CF6' },
  { id: 'ocean-breeze', name: '海洋湛藍', gradient: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 50%, #BAE6FD 100%)', badgeBg: '#E0F2FE', badgeColor: '#0369A1', accentColor: '#0284C7' },
  { id: 'rose-gold', name: '玫瑰奶茶', gradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%)', badgeBg: '#FFE4E6', badgeColor: '#BE123C', accentColor: '#F43F5E' },
  { id: 'midnight-dark', name: '尊爵奢華黑金', gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #334155 100%)', badgeBg: '#334155', badgeColor: '#F59E0B', accentColor: '#F59E0B', isDark: true },
];

// ==================== 幼貓活體假資料 ====================
export const kittens: Kitten[] = [
  {
    _id: 'kit_001',
    catteryId: 'meow_house',
    name: '珍珠 (Mochi)',
    breed: '英國短毛貓 (藍白)',
    gender: '母',
    birthday: '2026-06-12',
    fatherName: '威廉男爵 (CFA 冠軍組)',
    motherName: '露露 (歐系血統)',
    vaccines: ['三合一第一劑', '三合一第二劑'],
    dewormed: true,
    microchipNumber: '900138000123456',
    price: 38000,
    status: 'Available',
    description: '性格溫和、大眼睛包子臉，特別親人，已學會使用豆腐砂與吃幼貓泡軟乾糧。',
    images: ['/images/kitten-01.jpg'],
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfTitle: '📜 珍珠 (Mochi) 寵物買賣定型化契約與健康保證書.pdf',
  },
  {
    _id: 'kit_002',
    catteryId: 'meow_house',
    name: '奧斯卡 (Oscar)',
    breed: '英國短毛貓 (藍色)',
    gender: '公',
    birthday: '2026-06-12',
    fatherName: '威廉男爵 (CFA 冠軍組)',
    motherName: '露露 (歐系血統)',
    vaccines: ['三合一第一劑'],
    dewormed: true,
    microchipNumber: '900138000123457',
    price: 42000,
    status: 'Reserved',
    description: '圓滾滾的小胖子，骨架大毛量極厚，對玩具反應非常敏捷，已被台北陳先生預訂。',
    images: ['/images/kitten-02.jpg'],
  },
  {
    _id: 'kit_003',
    catteryId: 'golden_paw',
    name: '棉花糖 (Cotton)',
    breed: '布偶貓 (雙色海豹)',
    gender: '母',
    birthday: '2026-05-20',
    fatherName: 'Apollo (TICA 雙料冠軍)',
    motherName: 'Angel (賽級藍雙)',
    vaccines: ['三合一完整兩劑', '狂犬病疫苗'],
    dewormed: true,
    microchipNumber: '900138000123888',
    price: 68000,
    status: 'Available',
    description: '海豹雙色正八字面具、藍寶石般的清澈大眼，極度抱抱貓，適合有小孩的家庭陪伴。',
    images: ['/images/kitten-03.jpg'],
  },
  {
    _id: 'kit_004',
    catteryId: 'meow_house',
    name: '可可 (Coco)',
    breed: '蘇格蘭摺耳貓 (奶油色)',
    gender: '公',
    birthday: '2026-05-01',
    fatherName: 'Milo (英短立耳)',
    motherName: 'Nala (摺耳)',
    vaccines: ['三合一完成'],
    dewormed: true,
    microchipNumber: '900138000123999',
    price: 32000,
    status: 'Sold',
    description: '已找到溫暖的新家。完成絕育與微晶片植入移轉。',
    images: ['/images/kitten-04.jpg'],
  },
];

// ==================== 合作貓舍/賣家假資料 ====================
export const catteries: Cattery[] = [
  {
    _id: 'cat_001',
    catteryId: 'meow_house',
    slug: 'meow-house',
    name: '喵喵萌寵專業貓舍',
    logoUrl: '',
    bannerPreset: 'warm-amber',
    bannerUrl: '/cattery_banner_demo.png',
    themeColor: '#F97316',
    description: '致力於育養健康活潑的英國短毛貓與蘇格蘭摺耳貓，提供專屬優質幼貓飼料與用品推薦。',
    loginEmail: 'meow@petpa.tw',
    initialPassword: 'meow8888password',
    licenseNumber: '特寵業字第 A1130888 號',
    enableKittens: true,
    contactPhone: '0912-345-678',
    address: '新北市板橋區文化路二段 88 號',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    enableVideoAd: true,
    headerVideoTitle: '🎥 喵喵萌寵貓舍 2026 最新賽級英短介紹',
    activeWidgets: ['announcement', 'video_ad', 'kittens_showcase', 'guarantee_badge', 'recommended_products'],
    isApproved: true,
  },
  {
    _id: 'cat_002',
    catteryId: 'golden_paw',
    slug: 'golden-paw',
    name: '金爪名貓坊',
    logoUrl: '',
    bannerPreset: 'lavender-dream',
    themeColor: '#8B5CF6',
    description: '專業布偶貓繁殖，擁有 CFA 認證種貓血統，為每一位新家長提供完善的飼養指導。',
    loginEmail: 'golden@petpa.tw',
    initialPassword: 'golden8888password',
    licenseNumber: '特寵業字第 B1120123 號',
    enableKittens: true,
    contactPhone: '0922-987-654',
    address: '台北市大安區敦化南路一段 168 號',
    isApproved: true,
  },
  {
    _id: 'cat_003',
    catteryId: 'whisker_land',
    slug: 'whisker-land',
    name: '鬍鬚樂園貓舍',
    logoUrl: '',
    bannerPreset: 'emerald-forest',
    themeColor: '#10B981',
    description: '美國短毛貓與曼赤肯專業貓舍，堅持健康優先、陪伴一生的繁殖理念。',
    loginEmail: 'whisker@petpa.tw',
    initialPassword: 'whisker8888password',
    licenseNumber: '',
    enableKittens: false,
    contactPhone: '0933-111-222',
    address: '台中市西屯區台灣大道三段 99 號',
    isApproved: true,
  },
  {
    _id: 'cat_004',
    catteryId: 'star_cat',
    slug: 'star-cat',
    name: '星辰貓咪莊園',
    sellerType: 'cattery',
    logoUrl: '',
    bannerPreset: 'midnight-dark',
    themeColor: '#F59E0B',
    description: '豹貓與阿比西尼亞貓專業繁育，提供帶毛孩回家後的完整營養銜接方案。',
    loginEmail: 'starcat@petpa.tw',
    initialPassword: 'star8888password',
    licenseNumber: '審核中',
    enableKittens: false,
    contactPhone: '0955-666-777',
    address: '高雄市左營區博愛二路 300 號',
    isApproved: false,
  },
  {
    _id: 'cat_005',
    catteryId: 'cat_master_ig',
    slug: 'cat-master-ig',
    name: '貓奴阿金的社群開箱選品',
    sellerType: 'influencer',
    socialPlatform: 'Instagram (@cat_gold_master)',
    followerCount: '12.5 萬粉絲',
    logoUrl: '',
    bannerPreset: 'rose-gold',
    themeColor: '#F43F5E',
    description: '熱門貓咪 YouTuber / IG 創作者阿金的開箱好物推薦，獨家特惠折扣優惠碼聯名賣場！',
    loginEmail: 'gold_master@petpa.tw',
    initialPassword: 'gold8888password',
    licenseNumber: '社群賣家 (免特寵字號)',
    enableKittens: false,
    contactPhone: '0988-777-666',
    address: '社群推廣工作室',
    isApproved: true,
  },
];

// ==================== 退貨單假資料 ====================
export const returnOrders: ReturnOrder[] = [
  {
    _id: 'ret_001',
    returnNumber: 'RET-20260918-01',
    orderNumber: 'PETPA-20260915-0001',
    catteryId: 'meow_house',
    catteryName: '喵喵萌寵專業貓舍',
    customerName: '林小姐',
    productTitle: '皇家幼貓專用鮮採分裝糧 (500g)',
    qty: 1,
    refundAmount: 280,
    reason: '包裝破損',
    status: 'PendingReview',
    restockInventory: false,
    createdAt: '2026-09-18T14:30:00Z',
  },
  {
    _id: 'ret_002',
    returnNumber: 'RET-20260919-02',
    orderNumber: 'PETPA-20260916-0003',
    catteryId: 'golden_paw',
    catteryName: '金爪名貓坊',
    customerName: '王太太',
    productTitle: 'Petpa 專用除臭豆腐貓砂 (6L)',
    qty: 2,
    refundAmount: 440,
    reason: '規格不符',
    status: 'Approved',
    restockInventory: true,
    createdAt: '2026-09-19T09:15:00Z',
  },
];

// ==================== 進銷存 (ERP) 異動紀錄假資料 ====================
export const inventoryLogs: InventoryLog[] = [
  {
    _id: 'inv_001',
    productId: 'prod_food_01',
    productTitle: '皇家幼貓專用鮮採分裝糧 (500g)',
    catteryId: 'meow_house',
    type: 'Inbound',
    qtyChange: 200,
    beforeStock: 0,
    afterStock: 200,
    reason: '採購進貨入庫',
    operatorRole: 'super_admin',
    operatorName: '平台總管理員 (SuperAdmin)',
    createdAt: '2026-09-15T08:00:00Z',
  },
  {
    _id: 'inv_002',
    productId: 'prod_food_01',
    productTitle: '皇家幼貓專用鮮採分裝糧 (500g)',
    catteryId: 'meow_house',
    type: 'Outbound',
    qtyChange: -2,
    beforeStock: 200,
    afterStock: 198,
    reason: '買家訂單 PETPA-20260915-0001 扣減庫存',
    operatorRole: 'seller',
    operatorName: '喵喵萌寵貓舍 (meow@petpa.tw)',
    createdAt: '2026-09-15T10:30:00Z',
  },
];

// ==================== 平台特權級別審計日誌 (Audit Log) 假資料 ====================
export const auditLogs: AuditLog[] = [
  {
    _id: 'log_001',
    timestamp: '2026-09-20T03:35:10Z',
    role: 'super_admin',
    userEmail: 'root@petpa.tw',
    userName: '平台最高系統管理員 (Root)',
    ipAddress: '220.135.98.112 (台北市)',
    deviceInfo: 'Chrome 128.0 (macOS 15.0)',
    apiEndpoint: 'POST /api/v1/super-admin/sellers/approve',
    actionType: 'APPROVAL',
    actionDetails: '核准並開通合作店家【喵喵萌寵專業貓舍】專屬 URL /shop/meow-house 與特寵字號',
  },
  {
    _id: 'log_002',
    timestamp: '2026-09-20T03:30:22Z',
    role: 'seller',
    userEmail: 'meow@petpa.tw',
    userName: '喵喵萌寵專業貓舍',
    ipAddress: '114.34.12.88 (新北市)',
    deviceInfo: 'Safari 17.5 (iPhone iOS 17)',
    apiEndpoint: 'POST /api/v1/seller/products/custom-config',
    actionType: 'UPDATE',
    actionDetails: '更新商品【渴望六種魚全貓糧】的專屬賣場標籤為【🔥 店長推薦】與售價 NT$480',
  },
  {
    _id: 'log_003',
    timestamp: '2026-09-20T03:20:05Z',
    role: 'buyer',
    userEmail: 'may@example.com',
    userName: '買家 陳小美',
    ipAddress: '61.228.105.42 (台中市)',
    deviceInfo: 'Chrome 128.0 (Windows 11)',
    apiEndpoint: 'POST /api/v1/checkout/orders/create',
    actionType: 'CREATE',
    actionDetails: '完成買家身份登入驗證，建立訂單 #ORD-2026-9082 金額 NT$1,260 (選擇 ATM 轉帳)',
  },
];

// ==================== 訂單假資料 ====================
export const orders: Order[] = [
  { _id: 'ord_001', orderNumber: 'PETPA-20260915-0001', catteryId: 'meow_house', catteryName: '喵喵萌寵專業貓舍', customerName: '林小姐', totalAmount: 1260, sellerProfit: 98, status: 'Completed', createdAt: '2026-09-15T10:30:00Z' },
  { _id: 'ord_002', orderNumber: 'PETPA-20260915-0002', catteryId: 'golden_paw', catteryName: '金爪名貓坊', customerName: '張先生', totalAmount: 890, sellerProfit: 68, status: 'Completed', createdAt: '2026-09-15T14:20:00Z' },
  { _id: 'ord_003', orderNumber: 'PETPA-20260916-0003', catteryId: 'meow_house', catteryName: '喵喵萌寵專業貓舍', customerName: '王太太', totalAmount: 2150, sellerProfit: 165, status: 'Shipped', createdAt: '2026-09-16T09:15:00Z' },
  { _id: 'ord_004', orderNumber: 'PETPA-20260916-0004', catteryId: 'whisker_land', catteryName: '鬍鬚樂園貓舍', customerName: '陳小姐', totalAmount: 580, sellerProfit: 45, status: 'Completed', createdAt: '2026-09-16T16:40:00Z' },
  { _id: 'ord_005', orderNumber: 'PETPA-20260917-0005', catteryId: 'meow_house', catteryName: '喵喵萌寵專業貓舍', customerName: '李先生', totalAmount: 1680, sellerProfit: 130, status: 'Processing', createdAt: '2026-09-17T11:00:00Z' },
  { _id: 'ord_006', orderNumber: 'PETPA-20260917-0006', catteryId: 'golden_paw', catteryName: '金爪名貓坊', customerName: '黃小姐', totalAmount: 750, sellerProfit: 58, status: 'Completed', createdAt: '2026-09-17T13:30:00Z' },
  { _id: 'ord_007', orderNumber: 'PETPA-20260918-0007', catteryId: 'meow_house', catteryName: '喵喵萌寵專業貓舍', customerName: '吳太太', totalAmount: 3200, sellerProfit: 248, status: 'Paid', createdAt: '2026-09-18T08:45:00Z' },
  { _id: 'ord_008', orderNumber: 'PETPA-20260918-0008', catteryId: 'whisker_land', catteryName: '鬍鬚樂園貓舍', customerName: '劉先生', totalAmount: 420, sellerProfit: 32, status: 'Completed', createdAt: '2026-09-18T15:20:00Z' },
  { _id: 'ord_009', orderNumber: 'PETPA-20260919-0009', catteryId: 'golden_paw', catteryName: '金爪名貓坊', customerName: '趙小姐', totalAmount: 1100, sellerProfit: 85, status: 'Pending', createdAt: '2026-09-19T10:10:00Z' },
  { _id: 'ord_010', orderNumber: 'PETPA-20260919-0010', catteryId: 'meow_house', catteryName: '喵喵萌寵專業貓舍', customerName: '周先生', totalAmount: 960, sellerProfit: 74, status: 'Paid', createdAt: '2026-09-19T12:00:00Z' },
];

// ==================== 管理員帳號 ====================
export const adminAccounts = {
  test: {
    email: 'test@petpa.tw',
    password: 'test1234',
    role: 'admin' as const,
    label: '測試管理員 (含假資料)',
  },
  production: {
    email: 'admin@petpa.tw',
    password: 'admin@petpa2026',
    role: 'admin' as const,
    label: '正式管理員',
  },
};

// ==================== 管理員指定收款與匯款帳號設定 ====================
export const adminBankAccount = {
  bankName: '玉山商業銀行 (808)',
  branchName: '信義分行',
  accountNumber: '9088-1234-5678-9012',
  accountName: '寵物補給站股份有限公司',
  note: '買家 ATM / 銀行轉帳實收帳戶與賣家月度對帳分潤指定匯款帳號',
};

// ==================== 三方分潤設定 ====================
export const profitSplitConfig = {
  platformRate: 10.0,   // 🏢 平台系統費 10%
  sellerRate: 15.0,     // 🐱 賣家分潤 15%
  operatorRate: 75.0,   // 👨‍💼 管理員利潤 (剩餘) 75%
};

// ==================== 30天銷售趨勢假資料 ====================
export const trendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 8, i + 1);
  const base = 3000 + Math.random() * 5000;
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    sales: Math.round(base),
    profit: Math.round(base * 0.4),
    orders: Math.round(2 + Math.random() * 8),
  };
});
