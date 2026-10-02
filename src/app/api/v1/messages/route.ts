import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'admin' or 'seller'
    const sellerId = searchParams.get('sellerId');
    
    const { db } = await connectToDatabase();
    
    const query: any = {};
    if (role === 'seller' && sellerId) {
      query.sellerId = sellerId;
    }
    
    const messages = await db.collection('messages').find(query).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ data: messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    
    const newMessage = {
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, approved, rejected
    };
    
    const result = await db.collection('messages').insertOne(newMessage);
    
    return NextResponse.json({ success: true, messageId: result.insertedId });
  } catch (err) {
    console.error('Error creating message:', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
