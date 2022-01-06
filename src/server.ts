import express from 'express';
import connectToMongo, { MongoCollections } from './connections/mongodb';
import { NO_RESULT, SUCCESS } from './constants/errorCodes';
import { RootProjectiledRecordFields } from './types/MongoRecordsFields';
import RootRequest from './types/RootRequest';
import RootResponse from './types/RootResponse';

const createServer = (mongo: MongoCollections) => {
  const app = express();
  app.use(express.json());

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.post<'/', Record<string, never>, RootResponse, RootRequest>('/', async (req, res) => {
    const { startDate, endDate, minCount, maxCount } = req.body;
    console.log('req.body', req.body);

    const records = await mongo.records
      .find<RootProjectiledRecordFields>(
        { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } },
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
      res.json({ ...SUCCESS, records: countFilteredRecords });
    } else {
      res.json({ ...NO_RESULT, records: countFilteredRecords });
    }
  });

  app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'));
  return app;
};
export default createServer;
