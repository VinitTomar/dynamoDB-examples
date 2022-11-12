import { CreateGlobalTableCommand, CreateTableCommand, DeleteTableCommand, DescribeLimitsCommand, DescribeTableCommand, DynamoDBClient, ListTablesCommand, TableClass, UpdateTableCommand } from "@aws-sdk/client-dynamodb";


const endpoint = 'http://localhost:8000';

const client = new DynamoDBClient({
  endpoint
});

async function createTable() {

  const command = new CreateTableCommand({
    TableName: 'MyTable',
    AttributeDefinitions: [
      {
        AttributeName: 'PK',
        AttributeType: 'N'
      },
      {
        AttributeName: 'SK',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'PK',
        KeyType: 'HASH'
      },
      {
        AttributeName: 'SK',
        KeyType: 'RANGE'
      }
    ],
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    },
    TableClass: TableClass.STANDARD_INFREQUENT_ACCESS

  });

  const result = await client.send(command);

  console.log(result);

}

// createTable();

async function createMyGlobalTable() {
  const command = new CreateGlobalTableCommand({
    GlobalTableName: "MyBlobTable",
    ReplicationGroup: [
      {
        RegionName: 'us-east-1'
      },
      {
        RegionName: 'us-west-1'
      },
    ]
  });

  console.log(await client.send(command));
}

// createMyGlobalTable(); [Need to check later]

async function describeMyTable() {
  const command = new DescribeTableCommand({
    TableName: 'MyTable'
  });
  const result = await client.send(command);
  console.log(result.Table?.AttributeDefinitions);
}

// describeMyTable();

async function updateMyTable() {
  const command = new UpdateTableCommand({
    TableName: 'MyTable',
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    },
    StreamSpecification: {
      StreamEnabled: true,
      StreamViewType: 'KEYS_ONLY'
    },
  });
  const result = await client.send(command);
  console.log(result);
}

// updateMyTable();

async function deleteMyTable() {
  const command = new DeleteTableCommand({
    TableName: 'MyTable'
  });
  const result = await client.send(command);
  console.log(result);
}
// deleteMyTable();

async function listAllTables() {
  const command = new ListTablesCommand({
    Limit: 2,
    ExclusiveStartTableName: 'ProductCatalog'
  });
  const result = await client.send(command);
  console.log(result);
}
// listAllTables();

async function getProvisionedQuota() {
  const command = new DescribeLimitsCommand({});
  const result = await client.send(command);
  console.log(result);
}
getProvisionedQuota();