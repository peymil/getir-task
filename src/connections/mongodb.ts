import { Db, MongoClient } from 'mongodb';
import { RecordFields } from '../types/MongoRecordsFields';
import { Awaited } from '../utils/typeUtils';

const getCollections = (mongodb: Db) => {
  return {
    records: mongodb.collection<RecordFields>('records'),
  };
};

const connectToMongo = async (url: string) => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db();
  const collections = getCollections(db);
  return collections;
};
export type MongoCollections = Awaited<ReturnType<typeof connectToMongo>>;
export default connectToMongo;
