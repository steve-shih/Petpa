import { NextResponse } from 'next/server';
import { catteries, products, kittens } from '@/lib/mock-data';

// GET /api/v1/shop/[slug] - 買家專屬賣場 API (前後端分離 RESTful API)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. 比對 Slug 或 catteryId 獲取賣家資料
  const cattery = catteries.find(c => c.slug === slug || c.catteryId === slug) || catteries[0];

  // 2. 獲取該賣家專屬活體幼貓展示
  const catteryKittens = kittens.filter(k => k.catteryId === cattery.catteryId);

  // 3. 獲取管理員指定上架至該賣場之商品 (並帶入該賣家客製標籤與售價)
  const catteryProducts = products
    .filter(p => p.isActive)
    .filter(p => {
      const targets = p.targetCatteries;
      return !targets || targets.length === 0 || targets.includes('all') || targets.includes(cattery.catteryId) || targets.includes(cattery.slug);
    })
    .map(p => {
      const sellerConfig = p.sellerConfigs ? p.sellerConfigs[cattery.catteryId] : undefined;
      return {
        ...p,
        effectiveBadge: sellerConfig?.customBadge || (p.isRecommended ? '🔥 店長推薦' : undefined),
        effectivePrice: sellerConfig?.customPrice || p.sellingPrice,
        effectiveOriginalPrice: sellerConfig?.customOriginalPrice || p.originalPrice,
      };
    });

  return NextResponse.json({
    success: true,
    code: 200,
    timestamp: new Date().toISOString(),
    data: {
      cattery,
      kittens: catteryKittens,
      products: catteryProducts,
    },
  });
}
