import { NextResponse } from 'next/server';
import { kittens as mockKittens } from '@/lib/mock-data';
import { connectToDatabase } from '@/lib/mongodb';

// GET /api/v1/kittens - 獲取特寵幼貓清單 (優先 MongoDB Atlas)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const catteryId = searchParams.get('catteryId');

  try {
    const { db } = await connectToDatabase();
    const query = catteryId ? { catteryId } : {};
    const kittens = await db.collection('kittens').find(query).toArray();
    
    return NextResponse.json({
      success: true,
      code: 200,
      source: 'mongodb_atlas',
      timestamp: new Date().toISOString(),
      data: kittens.length > 0 ? kittens : (catteryId ? mockKittens.filter(k => k.catteryId === catteryId) : mockKittens),
    });
  } catch (err) {
    return NextResponse.json({
      success: true,
      code: 200,
      source: 'fallback_memory',
      timestamp: new Date().toISOString(),
      data: catteryId ? mockKittens.filter(k => k.catteryId === catteryId) : mockKittens,
    });
  }
}

// POST /api/v1/kittens - 新增活體幼貓卡片與多圖相簿
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newKitten = {
      _id: `kit_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    try {
      const { db } = await connectToDatabase();
      await db.collection('kittens').insertOne(newKitten);
    } catch (dbErr) {
      console.warn('寫入 MongoDB Atlas 失敗，寫入本地記憶體備援:', dbErr);
      mockKittens.unshift(newKitten as any);
    }

    return NextResponse.json({
      success: true,
      code: 201,
      message: `成功新增幼貓【${newKitten.name}】檔案`,
      data: newKitten,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      code: 400,
      error: err.message || '格式不符',
    }, { status: 400 });
  }
}
