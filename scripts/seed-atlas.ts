const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// We can just require the TS file if we run via ts-node, but since ts-node might not be installed, 
// let's just write a quick script that reads from mock-data or we can run it via next dev?
// Actually, it's easier to run this via `npx tsx scripts/seed-atlas.ts`

import { catteries, products, categories, returnOrders, inventoryLogs, auditLogs, orders, kittens, adminAccounts, profitSplitConfig, trendData } from '../src/lib/mock-data';

const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) throw new Error("Missing MONGODB_URI");
  console.log("Connecting to", uri.replace(/:[^:]*@/, ':***@'));
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('PETPA');
    
    console.log("Seeding catteries...");
    await db.collection('catteries').deleteMany({});
    await db.collection('catteries').insertMany(catteries);
    
    console.log("Seeding products...");
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(products);

    console.log("Seeding categories...");
    await db.collection('categories').deleteMany({});
    await db.collection('categories').insertMany(categories);

    console.log("Seeding kittens (with photo walls & videos)...");
    await db.collection('kittens').deleteMany({});
    await db.collection('kittens').insertMany(kittens);
    
    console.log("Seeding orders (with logistics tracking)...");
    await db.collection('orders').deleteMany({});
    await db.collection('orders').insertMany(orders);

    console.log("Seeding returnOrders (dual-approval workflow)...");
    await db.collection('returnOrders').deleteMany({});
    await db.collection('returnOrders').insertMany(returnOrders);

    console.log("Seeding messages/auditLogs...");
    await db.collection('messages').deleteMany({});
    await db.collection('auditLogs').deleteMany({});
    await db.collection('auditLogs').insertMany(auditLogs);
    
    console.log("Seed complete! All data successfully synced into MongoDB Atlas!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
