import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/PETPA";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('PETPA');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
