import dotenv from 'dotenv';
import connectToMongo from './connections/mongodb';
import createServer from './server';

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) dotenv.config();

connectToMongo(process.env.MONGODB_URL).then(createServer).catch(console.error);
