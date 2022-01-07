import { Db, MongoClient } from 'mongodb';
import { RecordFields } from '../types/MongoRecordsFields';
import { Awaited } from '../utils/typeUtils';

const getCollections = (mongodb: Db) => {
  return {
    records: mongodb.collection<RecordFields>('records'),
  };
};

const connectToMongo = async (url: string) => {
  const mongoClient = new MongoClient(url);
  await mongoClient.connect();
  const db = mongoClient.db();
  const mongoCollections = getCollections(db);
  return { mongoCollections, mongoClient };
};
export type MongoCollectionsAndClient = Awaited<ReturnType<typeof connectToMongo>>;
export default connectToMongo;
