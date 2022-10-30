import { DynamoDB } from "@aws-sdk/client-dynamodb";

const endpoint = 'http://localhost:8000';

const dbClient = new DynamoDB({
  endpoint
});
async function createTable() {
  try {
    await dbClient.createTable({
      TableName: 'battle-royale',
      AttributeDefinitions: [
        {
          AttributeName: "PK",
          AttributeType: "S"
        },
        {
          AttributeName: "SK",
          AttributeType: "S"
        }
      ],
      KeySchema: [
        {
          AttributeName: "PK",
          KeyType: "HASH"
        },
        {
          AttributeName: "SK",
          KeyType: "RANGE"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 100,
        WriteCapacityUnits: 100
      }
    });
    console.log("Table created successfully.")
  } catch (error) {
    console.log("Error while creating table");
    console.log(error)
  }
}

createTable();