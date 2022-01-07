An app that fetches data from MongoDB collection and returns data.

## Starting project

```
yarn && yarn build && yarn start
```

## Testing project

```
yarn && yarn test
```

Docker should be installed.

## Starting project

```
yarn && yarn build && yarn start
```

## API Reference

`POST /`

**Input example**

```json
{
  "startDate": "2016-01-26",
  "endDate": "2018-02-02",
  "minCount": 2700,
  "maxCount": 3000
}
```

**Output example**

```json
{
  "code": 0, //Error code
  "msg": "Success",
  "records": [
    {
      "key": "TAKwGc6Jr4i8Z487",
      "createdAt": "2017-01-28T01:22:14.398Z",
      "totalCount": 2800
    },
    {
      "key": "NAeQ8eX7e5TEg7oH",
      "createdAt": "2017-01-27T08:19:14.135Z",
      "totalCount": 2900
    }
  ]
}
```

## Error Codes

Error codes and their descriptions are available under src/constants/errorCodes

## Notes

Docker used for testing.

You can fill .env file according to .env.example before starting.

.env file is not loading on production. You should pass env variables manually.
