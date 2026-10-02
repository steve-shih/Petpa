import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // 'approved' or 'rejected'
    
    const { db } = await connectToDatabase();
    
    // Update the message status
    const updateResult = await db.collection('messages').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date().toISOString() } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: '找不到該訊息或狀態未更改' }, { status: 404 });
    }

    // If approved, we might need to update the actual product price or whatever the message requested
    // This depends on the message type, which we could fetch first
    const message = await db.collection('messages').findOne({ _id: new ObjectId(id) });
    if (status === 'approved' && message && message.type === 'price_change') {
       // Update product's custom config for this seller
       const { productId, sellerId, newPrice } = message.payload;
       await db.collection('products').updateOne(
         { _id: productId },
         { $set: { [`sellerConfigs.${sellerId}.customPrice`]: newPrice } }
       );
    }
    
    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error('Error approving message:', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
