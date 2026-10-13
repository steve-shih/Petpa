import { MongoClient, Db } from 'mongodb';
import { envFeatures } from './env';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/PETPA";

// 資料庫名稱依環境切換：展示站 PETPA / 正式站 PETPA_PROD (設定在 config.json)
// 可用 MONGODB_DB_NAME 環境變數覆寫
const dbName = process.env.MONGODB_DB_NAME || envFeatures.dbName;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
