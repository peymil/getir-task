import express from 'express';
import connectToMongo, { MongoCollectionsAndClient } from './connections/mongodb';
import { EMPTY_BODY, MIN_COUNT_GREATER, NO_RESULT, START_DATE_GREATER, SUCCESS } from './constants/errorCodes';
import { RootProjectiledRecordFields } from './types/MongoRecordsFields';
import RootRequest from './types/RootRequest';
import RootResponse from './types/RootResponse';
import isObjectEmpty from './utils/isObjectEmpty';

const createServer = ({ mongoClient, mongoCollections }: MongoCollectionsAndClient) => {
  const app = express();
  app.use(express.json());

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.post<'/', Record<string, never>, RootResponse, RootRequest>('/', async (req, res) => {
    if (!req.body || isObjectEmpty(req.body)) return res.json(EMPTY_BODY);

    const { startDate, endDate, minCount, maxCount } = req.body;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (minCount > maxCount) return res.json(MIN_COUNT_GREATER);
    if (startDateObj > endDateObj) return res.json(START_DATE_GREATER);

    const records = await mongoCollections.records
      .find<RootProjectiledRecordFields>(
        { createdAt: { $gte: startDateObj, $lte: endDateObj } },
        { projection: { _id: 0, totalCount: { $sum: '$counts' }, createdAt: 1, key: 1 } },
      )
      .toArray();

    // I would prefer filtering using aggregation but it was restricted.
    const countFilteredRecords = records.filter((curr) => {
      if (curr.totalCount < minCount || curr.totalCount > maxCount) {
        return false;
      }
      return true;
    });

    if (countFilteredRecords.length > 0) {
      return res.json({ ...SUCCESS, records: countFilteredRecords });
    }
    return res.json(NO_RESULT);
  });

  const server = app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
  return { app, server };
};
export default createServer;
