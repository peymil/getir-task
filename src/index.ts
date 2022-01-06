import dotenv from 'dotenv';
import connectToMongo from './connections/mongodb';
import createServer from './server';

dotenv.config();
connectToMongo(process.env.MONGODB_URL).then(createServer).catch(console.error);
