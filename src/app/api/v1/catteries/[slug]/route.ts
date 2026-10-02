import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { db } = await connectToDatabase();
    const cattery = await db.collection('catteries').findOne({ slug });

    if (!cattery) {
      return NextResponse.json({ error: '找不到該貓舍或賣場' }, { status: 404 });
    }

    return NextResponse.json({ data: cattery });
  } catch (err) {
    console.error('Error fetching cattery:', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
