import { MongoClient } from 'mongodb';
import {
  categories,
  products,
  kittens,
  catteries,
  returnOrders,
  inventoryLogs,
  auditLogs,
  orders
} from '../src/lib/mock-data';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/PETPA";
const client = new MongoClient(uri);

async function seed() {
  try {
    console.log('連線至 MongoDB Atlas 中...');
    await client.connect();
    console.log('✅ 成功連線至資料庫！');

    const db = client.db('PETPA');

    // Helper 函數：清空並重新插入資料
    const seedCollection = async (colName: string, data: any[]) => {
      const col = db.collection(colName);
      await col.deleteMany({});
      console.log(`🧹 已清空集合: ${colName}`);
      if (data.length > 0) {
        await col.insertMany(data);
        console.log(`🌱 已成功寫入 ${data.length} 筆資料至 ${colName}！`);
      }
    };

    console.log('\n--- 開始將假資料寫入 MongoDB Atlas ---');
    await seedCollection('categories', categories);
    await seedCollection('products', products);
    await seedCollection('kittens', kittens);
    await seedCollection('catteries', catteries);
    await seedCollection('returnOrders', returnOrders);
    await seedCollection('inventoryLogs', inventoryLogs);
    await seedCollection('auditLogs', auditLogs);
    await seedCollection('orders', orders);

    console.log('\n🎉 所有資料初始化匯入完成！');

  } catch (err) {
    console.error('❌ 寫入資料時發生錯誤：', err);
  } finally {
    await client.close();
    console.log('🔌 關閉資料庫連線。');
  }
}

seed();
