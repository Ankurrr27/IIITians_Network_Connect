import mongoose from 'mongoose';
import DiscussAccount from './src/models/discussAccount.model.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const accounts = await DiscussAccount.find({}).sort({ createdAt: -1 }).limit(10);
  console.log('--- LATEST 10 DISCUSS ACCOUNTS ---');
  accounts.forEach(a => {
    console.log(`Club: ${a.clubName} | POC: ${a.contactName} | Handle: ${a.email} | Pass: ${a.password}`);
  });
  mongoose.connection.close();
}

run();
