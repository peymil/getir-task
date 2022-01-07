import { resolve } from 'path/posix';
import request from 'supertest';
import { Server } from 'http';
import { Express } from 'express';
import connectToMongo, { MongoCollectionsAndClient } from '../src/connections/mongodb';
import createServer from '../src/server';
import mockData from './mockData.json';
import RootResponse from '../src/types/RootResponse';
import { SUCCESS, NO_RESULT, EMPTY_BODY, START_DATE_GREATER, MIN_COUNT_GREATER } from '../src/constants/errorCodes';

describe('POST / (get data from mongodb)', () => {
  let mongoCollections: MongoCollectionsAndClient['mongoCollections'];
  let mongoClient: MongoCollectionsAndClient['mongoClient'];
  let app: Express;
  let server: Server;
  beforeAll(async () => {
    const mongo = await connectToMongo(process.env.MONGODB_URL);
    mongoCollections = mongo.mongoCollections;
    mongoClient = mongo.mongoClient;
    ({ app, server } = createServer(mongo));

    const dateParsedMockData = mockData.map(({ createdAt, ...others }) => ({
      createdAt: new Date(createdAt),
      ...others,
    }));
    await mongoCollections.records.insertMany(dateParsedMockData);
  });

  afterAll(async () => {
    server.close();
    await mongoCollections.records.drop();
    await mongoClient.close();
  });

  it('Should return correct results', async () => {
    expect.assertions(3);
    const records = [
      {
        totalCount: 2085,
        createdAt: '2016-06-28T11:47:29.706Z',
        key: 'yCXxhuAu',
      },
      {
        totalCount: 2178,
        createdAt: '2016-03-28T16:49:22.702Z',
        key: 'hCXxagAu',
      },
      {
        totalCount: 2278,
        createdAt: '2016-05-22T12:29:22.702Z',
        key: 'lGXxysAh',
      },
    ];

    const res = await request(app).post('/').send({
      startDate: '2016-01-26',
      endDate: '2016-08-02',
      minCount: 2000,
      maxCount: 2780,
    });

    const body = res.body as RootResponse;

    expect(body.code).toEqual(SUCCESS.code);
    expect(body.msg).toEqual(SUCCESS.msg);
    expect(body.records).toEqual(records);
  });
  it('Should return error message if no results found', async () => {
    expect.assertions(2);
    const res = await request(app).post('/').send({
      startDate: '1990-01-26',
      endDate: '1992-02-02',
      minCount: 2000,
      maxCount: 2780,
    });

    const body = res.body as RootResponse;
    expect(body.code).toEqual(NO_RESULT.code);
    expect(body.msg).toEqual(NO_RESULT.msg);
  });
  it('Should return error message if min count greater than max count', async () => {
    expect.assertions(2);
    const res = await request(app).post('/').send({
      startDate: '1990-01-26',
      endDate: '2010-02-02',
      minCount: 2900,
      maxCount: 2780,
    });

    const body = res.body as RootResponse;
    expect(body.code).toEqual(MIN_COUNT_GREATER.code);
    expect(body.msg).toEqual(MIN_COUNT_GREATER.msg);
  });
  it('Should return error message if start date greater than end date', async () => {
    expect.assertions(2);
    const res = await request(app).post('/').send({
      startDate: '2020-01-26',
      endDate: '2010-02-02',
      minCount: 2000,
      maxCount: 2780,
    });

    const body = res.body as RootResponse;
    expect(body.code).toEqual(START_DATE_GREATER.code);
    expect(body.msg).toEqual(START_DATE_GREATER.msg);
  });
  it('Should return error message if body is empty', async () => {
    expect.assertions(2);
    const res = await request(app).post('/').send();
    const body = res.body as RootResponse;

    expect(body.code).toEqual(EMPTY_BODY.code);
    expect(body.msg).toEqual(EMPTY_BODY.msg);
  });
});
