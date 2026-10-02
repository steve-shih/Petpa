import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    const { db } = await connectToDatabase();
    
    const updateResult = await db.collection('catteries').updateOne(
      { slug },
      { $set: body }
    );

    if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 0) {
      return NextResponse.json({ error: '找不到該貓舍或賣場' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating cattery:', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
