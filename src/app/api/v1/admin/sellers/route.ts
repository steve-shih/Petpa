import { NextResponse } from 'next/server';
import { catteries, products, returnOrders, inventoryLogs, auditLogs } from '@/lib/mock-data';

// GET /api/v1/admin/sellers - 管理員獲取全站賣家與 KOL 清單 RESTful API
export async function GET() {
  return NextResponse.json({
    success: true,
    code: 200,
    timestamp: new Date().toISOString(),
    data: {
      totalSellers: catteries.length,
      catteries,
    },
  });
}

// POST /api/v1/admin/sellers - 管理員開通新賣家 (前後端分離 API)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, sellerType, loginEmail, initialPassword, licenseNumber } = body;

    const cleanedSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');

    const created = {
      _id: `cat_${Date.now()}`,
      catteryId: cleanedSlug.replace(/-/g, '_'),
      slug: cleanedSlug,
      name,
      sellerType: sellerType || 'cattery',
      logoUrl: '',
      bannerPreset: sellerType === 'influencer' ? 'rose-gold' : 'warm-amber',
      themeColor: sellerType === 'influencer' ? '#F43F5E' : '#F97316',
      description: body.description || '合作獨立品牌賣場',
      loginEmail: loginEmail || `${cleanedSlug}@petpa.tw`,
      initialPassword: initialPassword || 'petpa8888password',
      licenseNumber: sellerType === 'cattery' ? licenseNumber : '社群賣家 (免特寵字號)',
      enableKittens: sellerType === 'cattery' && Boolean(licenseNumber),
      contactPhone: '0912-345-678',
      address: '門市/工作室',
      isApproved: true,
    };

    // 寫入審計日誌
    auditLogs.unshift({
      _id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      role: 'super_admin',
      userEmail: 'root@petpa.tw',
      userName: '平台最高系統管理員 (Root)',
      ipAddress: '127.0.0.1 (Localhost REST)',
      deviceInfo: 'REST API Client',
      apiEndpoint: 'POST /api/v1/admin/sellers',
      actionType: 'CREATE',
      actionDetails: `經由 REST API 開通賣家【${created.name}】專屬 URL /shop/${created.slug}`,
    });

    return NextResponse.json({
      success: true,
      code: 201,
      message: `成功創建賣家【${created.name}】`,
      data: created,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      code: 400,
      error: err.message || '格式不符',
    }, { status: 400 });
  }
}
