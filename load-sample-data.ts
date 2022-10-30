import { BatchWriteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { readdirSync, readFileSync } from 'fs';

readdirSync('./data')
  .map(filename => `./data/${filename}`)
  .map(path => JSON.parse(readFileSync(path, 'utf8')))
  .forEach(async data => {
    const client = new DynamoDBClient({
      endpoint: 'http://localhost:8000'
    });

    const output = await client.send(
      new BatchWriteItemCommand({
        RequestItems: data
      })
    );

    console.log({ output })
  });

