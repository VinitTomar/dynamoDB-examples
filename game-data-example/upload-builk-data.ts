import { DocumentClient, WriteRequests } from 'aws-sdk/clients/dynamodb';
import { readFileSync } from "fs";

const endpoint = 'http://localhost:8000';

const docClient = new DocumentClient({
  endpoint,
  region: 'us-east-1'
});

const batchPomises = JSON.parse(readFileSync('../data/game-data-items.json', 'utf8'))
  .map((item: any) => ({ PutRequest: { Item: item } }))
  .reduce((prev: any[], curr: any, i: number) => {
    const pos = Math.ceil((i + 1) / 25) - 1;
    if (prev[pos]) {
      prev[pos].push(curr)
    } else {
      prev[pos] = [curr]
    }
    return prev;
  }, [])
  .map((putItemRequests: WriteRequests) => {
    return docClient.batchWrite({
      RequestItems: {
        "battle-royale": putItemRequests
      }
    }).promise()
  });

Promise.all(batchPomises).then(res => {
  console.log("batch write successfull", res)
}).catch(err => {
  console.log("batch write error", err)
});