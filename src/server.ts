//@ts-nocheck
import express from 'express';
import { body, validationResult } from 'express-validator';
import { MongoCollectionsAndClient } from './connections/mongodb';
import {
  EMPTY_BODY,
  MIN_COUNT_GREATER,
  NO_RESULT,
  START_DATE_GREATER,
  SUCCESS,
  INVALID_BODY,
} from './constants/errorCodes';
import { RootProjectiledRecordFields } from './types/MongoRecordsFields';
import RootRequest from './types/RootRequest';
import RootResponse from './types/RootResponse';
import isObjectEmpty from './utils/isObjectEmpty';

const createServer = ({ mongoCollections }: MongoCollectionsAndClient) => {
  const app = express();
  app.use(express.json(), (err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('json');
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) return res.json(INVALID_BODY);
    return next();
  });

  // // Invalid json error handler.
  // app.use();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  app.post<'/', Record<string, never>, RootResponse, RootRequest>(
    '/',
    body('startDate').isDate(),
    body('endDate').isDate(),
    body('minCount').isInt(),
    body('maxCount').isInt(),
    async (req, res) => {
      const errors = validationResult(req);
      // 400
      if (typeof req.body === 'object' && isObjectEmpty(req.body)) return res.json(EMPTY_BODY);
      if (!errors.isEmpty()) return res.json(INVALID_BODY);

      const { startDate, endDate, minCount, maxCount } = req.body;
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // If min count is greater than maxCount
      if (minCount > maxCount) return res.json(MIN_COUNT_GREATER);
      // If startDate is greater than endDate
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

      // If there is data
      if (countFilteredRecords.length > 0) {
        return res.json({ ...SUCCESS, records: countFilteredRecords });
      }

      // If there is no data
      return res.json(NO_RESULT);
    },
  );

  const server = app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
  return { app, server };
};
export default createServer;
