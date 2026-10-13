/**
 * 伺服器端存取守門員 (Next.js 16 proxy，舊名 middleware)
 *
 * 白話說明：
 * - 展示站 (staging)：不擋任何路徑，方便展示。
 * - 正式站 (production)：真實登入 (realAuth) 完成以前，
 *     1. /admin/*、/seller/* 後台頁面一律導回 /login
 *     2. /api/v1/admin/* 管理 API 一律 403
 *     3. 所有會寫入資料的 API (POST/PUT/PATCH/DELETE) 一律 403
 *   這樣就算有人直接打網址，也進不了後台、改不了資料。
 * - 之後 realAuth 完成時，要在這裡改成「檢查 JWT Cookie + 角色」，而不是整個擋掉。
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isProduction, isCapabilityReady } from '@/lib/env';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function proxy(request: NextRequest) {
  // 展示站或正式站登入已完成：放行
  if (!isProduction || isCapabilityReady('realAuth')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl; // 已自動去掉 basePath (/shop)

  // 後台頁面：導回登入頁
  if (pathname.startsWith('/admin') || pathname.startsWith('/seller')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 管理 API 或任何寫入 API：拒絕
  if (pathname.startsWith('/api/v1/admin') || (pathname.startsWith('/api/') && WRITE_METHODS.has(request.method))) {
    return NextResponse.json(
      { success: false, code: 403, message: '正式站登入驗證尚未開通，暫不開放此操作' },
      { status: 403 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/seller/:path*', '/api/:path*'],
};
