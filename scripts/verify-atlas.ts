import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function verify() {
  if (!uri) throw new Error("Missing MONGODB_URI");
  console.log("連線至 MongoDB Atlas 驗證資料庫內容...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('PETPA');

    const collections = ['catteries', 'products', 'categories', 'kittens', 'orders', 'returnOrders', 'auditLogs'];
    const results: Record<string, number> = {};

    for (const col of collections) {
      const count = await db.collection(col).countDocuments();
      results[col] = count;
      const sample = await db.collection(col).findOne({});
      console.log(`✅ Collection [${col}]: 總筆數 = ${count}, 範例 ID = ${sample?._id || 'N/A'}`);
    }

    console.log("\n📊 Atlas 資料驗證統計彙整：", JSON.stringify(results, null, 2));
  } finally {
    await client.close();
  }
}

verify().catch(console.error);
