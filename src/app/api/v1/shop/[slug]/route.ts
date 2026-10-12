import { NextResponse } from 'next/server';
import { catteries as mockCatteries, products as mockProducts, kittens as mockKittens } from '@/lib/mock-data';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/v1/shop/[slug] - 買家專屬賣場 API (優先讀取 MongoDB Atlas)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { db } = await connectToDatabase();
    
    // 1. 從 MongoDB Atlas 讀取店家/貓舍資料
    const dbCattery = await db.collection('catteries').findOne({
      $or: [{ slug }, { catteryId: slug }]
    });

    const cattery = dbCattery || mockCatteries.find(c => c.slug === slug || c.catteryId === slug) || mockCatteries[0];

    // 2. 從 MongoDB Atlas 讀取活體幼貓展示 (含照片牆與短片)
    const dbKittens = await db.collection('kittens').find({ catteryId: cattery.catteryId }).toArray();
    const catteryKittens = (dbKittens && dbKittens.length > 0) ? dbKittens : mockKittens.filter(k => k.catteryId === cattery.catteryId);

    // 3. 從 MongoDB Atlas 讀取有效商品
    const dbProducts = await db.collection('products').find({ isActive: true }).toArray();
    const allProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : mockProducts;

    const catteryProducts = allProducts
      .filter((p: any) => {
        const targets = p.targetCatteries;
        return !targets || targets.length === 0 || targets.includes('all') || targets.includes(cattery.catteryId) || targets.includes(cattery.slug);
      })
      .map((p: any) => {
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
      source: dbCattery ? 'mongodb_atlas' : 'fallback_memory',
      timestamp: new Date().toISOString(),
      data: {
        cattery,
        kittens: catteryKittens,
        products: catteryProducts,
      },
    });
  } catch (err) {
    console.warn('MongoDB Atlas 讀取失敗，使用本機記憶體備援:', err);
    const cattery = mockCatteries.find(c => c.slug === slug || c.catteryId === slug) || mockCatteries[0];
    const catteryKittens = mockKittens.filter(k => k.catteryId === cattery.catteryId);
    const catteryProducts = mockProducts.filter(p => p.isActive);

    return NextResponse.json({
      success: true,
      code: 200,
      source: 'fallback_memory',
      timestamp: new Date().toISOString(),
      data: {
        cattery,
        kittens: catteryKittens,
        products: catteryProducts,
      },
    });
  }
}
