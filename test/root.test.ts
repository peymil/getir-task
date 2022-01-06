import { resolve } from 'path/posix';
import request from 'supertest';
import { Express } from 'express';
import connectToMongo, { MongoCollections } from '../src/connections/mongodb';
import createServer from '../src/server';
import mockData from './mockData.json';
import RootResponse from '../src/types/RootResponse';
import { ErrorCodes, SUCCESS } from '../src/constants/errorCodes';

describe('root router', () => {
  let mongo: MongoCollections;
  let app: Express;
  beforeAll(async () => {
    mongo = await connectToMongo(process.env.MONGODB_URL);
    app = createServer(mongo);
    //@ts-ignore
    await mongo.records.insertMany(mockData);
  });
  it('Should return correct results', async () => {
    const res = await request(app).post('/').set('Accept', 'application/json').expect('Content-Type', /json/).send({
      startDate: '2016-01-26',
      endDate: '2018-02-02',
      minCount: 2700,
      maxCount: 2780,
    });
    const body = res.body as RootResponse;

    expect(body.code).toEqual(SUCCESS.code);
    expect(body.code).toEqual(SUCCESS.msg);
  });
});
