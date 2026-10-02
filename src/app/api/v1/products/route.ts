import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const { db } = await connectToDatabase();
    
    const query: any = {};
    if (category) {
      query.categoryId = category;
    }
    
    const products = await db.collection('products').find(query).toArray();
    
    return NextResponse.json({ data: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}
