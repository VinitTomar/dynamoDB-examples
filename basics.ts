import { DynamoDB, DynamoDBClient, GetItemCommand, } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const endpoint = 'http://localhost:8000';

const bbClient = new DynamoDBClient({
  endpoint
});

const bbDocClient = DynamoDBDocumentClient.from(bbClient);

const client = new DynamoDB({
  endpoint
});

const docClient = new DocumentClient({
  endpoint,
  region: 'us-east-1'
});

async function describeTable(tableName: string) {
  const output = await client.describeTable({
    TableName: tableName,
  });

  console.log(JSON.stringify(output, null, 2));
}

async function getItems() {
  const getItemsCommand: GetItemCommand = new GetItemCommand({
    TableName: 'ProductCatalog',
    Key: {
      Id: {
        "N": "101"
      }
    },
    ConsistentRead: true,
    ProjectionExpression: "ProductCategory, Price, Title",
    ReturnConsumedCapacity: "TOTAL"
  });

  const output = await client.send(getItemsCommand);
  console.log(output);
}

// getItems();

async function getItems2() {
  const output = await docClient.get({
    TableName: 'ProductCatalog',
    Key: {
      Id: 101
    },
    ConsistentRead: true,
    ProjectionExpression: "ProductCategory, Price, Title",
    ReturnConsumedCapacity: "TOTAL"
  }).promise();

  console.log(output);
}

getItems2();

async function getItems3() {
  console.log(
    await bbDocClient.send(
      new GetCommand({
        TableName: 'ProductCatalog',
        Key: {
          Id: 101
        },
        ConsistentRead: true,
        ProjectionExpression: "ProductCategory, Price, Title",
        ReturnConsumedCapacity: "TOTAL"
      })
    )
  )
}

// getItems3();

async function queryReplies() {
  const output = await docClient.query({
    TableName: 'Reply',
    KeyConditionExpression: 'Id = :Id and ReplyDateTime > :ts',
    ExpressionAttributeValues: {
      ":Id": 'Amazon DynamoDB#DynamoDB Thread 1',
      ":ts": '2015-09-21'
    },
    ReturnConsumedCapacity: "TOTAL",
    ConsistentRead: false,
  }).promise();

  console.log(output);
}

// queryReplies();

async function scanReply() {
  const output = await docClient.scan({
    TableName: 'Reply',
    FilterExpression: "PostedBy = :user",
    ExpressionAttributeValues: {
      ":user": "User A"
    },
    ReturnConsumedCapacity: "TOTAL",
  }).promise();

  console.log(output)
}

// scanReply();

async function oldestReply() {
  const output = await docClient.query({
    TableName: 'Reply',
    KeyConditions: {
      Id: {
        ComparisonOperator: "EQ",
        AttributeValueList: ["Amazon DynamoDB#DynamoDB Thread 1"]
      }
    },
    ScanIndexForward: true,
    Limit: 1,
    ReturnConsumedCapacity: "TOTAL",
  }).promise();

  console.log(output);
}

// oldestReply();

async function latestReply() {
  const output = await docClient.query({
    TableName: 'Reply',
    KeyConditions: {
      Id: {
        ComparisonOperator: "EQ",
        AttributeValueList: ["Amazon DynamoDB#DynamoDB Thread 1"]
      }
    },
    ScanIndexForward: false,
    Limit: 1,
    ReturnConsumedCapacity: "TOTAL",
  }).promise();

  console.log(output);
}

// latestReply();

async function insetReply() {
  console.log(
    await docClient.put({
      TableName: 'Reply',
      Item: {
        Id: "Amazon DynamoDB#DynamoDB Thread 3",
        ReplyDateTime: "2021-04-27T17:47:30Z",
        Message: "DynamoDB Thread 2 Reply 3 text",
        PostedBy: "User D"
      },
      ReturnConsumedCapacity: "total",
    }).promise()
  )
}

// insetReply();

async function updateForum() {
  console.log(
    await docClient.update(
      {
        TableName: 'Forum',
        Key: {
          Name: 'Amazon DynamoDB'
        },
        UpdateExpression: "SET Messages = :newMessages",
        ConditionExpression: "Messages = :oldMessages",
        ExpressionAttributeValues: {
          ":newMessages": 5,
          ":oldMessages": 4
        },
        ReturnConsumedCapacity: "total",
        ReturnValues: "ALL_NEW",
      }
    ).promise()
  )
}

// updateForum();


async function addColor() {
  console.log(
    await docClient.update({
      TableName: 'ProductCatalog',
      Key: {
        Id: 201
      },
      UpdateExpression: "SET Color = list_append(Color, :c)",
      ExpressionAttributeValues: {
        ":c": ["blue", "yellow"]
      },
      ReturnConsumedCapacity: "total",
      ReturnValues: "ALL_NEW"
    }).promise()
  )
}

// addColor();

async function removeColor() {
  console.log(
    await docClient.update({
      TableName: "ProductCatalog",
      Key: {
        Id: 201
      },
      UpdateExpression: "Remove Color[2], Color[3]",
      ReturnConsumedCapacity: "total",
      ReturnValues: "ALL_NEW"
    }).promise()
  );
}

// removeColor();

async function transaction() {
  console.log(
    await docClient.transactWrite({
      ClientRequestToken: "Transaction1",
      TransactItems: [
        {
          Put: {
            TableName: 'Reply',
            Item: {
              Id: "Amazon DynamoDB#DynamoDB Thread 2",
              ReplyDateTime: "2021-04-27T17:47:30Z",
              Message: "DynamoDB Thread 2 Reply 3 text",
              PostedBy: "User C"
            }
          }
        },
        {
          Update: {
            TableName: "Forum",
            Key: {
              Name: "Amazon DynamoDB"
            },
            UpdateExpression: "ADD Messages :inc",
            ExpressionAttributeValues: {
              ":inc": 1
            }
          }
        }
      ],
      ReturnConsumedCapacity: "total",
      ReturnItemCollectionMetrics: "Size"
    }).promise()
  );
}

// transaction();

async function revTransaction() {
  console.log(
    await docClient.transactWrite({
      ClientRequestToken: "Transaction2",
      TransactItems: [
        {
          Delete: {
            TableName: "Reply",
            Key: {
              Id: "Amazon DynamoDB#DynamoDB Thread 2",
              ReplyDateTime: "2021-04-27T17:47:30Z"
            }
          }
        },
        {
          Update: {
            TableName: "Forum",
            Key: {
              Name: "Amazon DynamoDB"
            },
            UpdateExpression: "ADD Messages :inc",
            ExpressionAttributeValues: {
              ":inc": -1
            }
          }
        }
      ],
      ReturnConsumedCapacity: "total",
      ReturnItemCollectionMetrics: "SIZE"
    }).promise()
  )
}

// revTransaction();

async function createGSI() {
  await client.updateTable({
    TableName: "Reply",
    AttributeDefinitions: [
      {
        AttributeName: "PostedBy",
        AttributeType: "S"
      },
      {
        AttributeName: "ReplyDateTime",
        AttributeType: "S"
      }
    ],
    GlobalSecondaryIndexUpdates: [
      {
        Create: {
          IndexName: "PostedBy-ReplyDateTime-gsi",
          KeySchema: [
            {
              "AttributeName": "PostedBy",
              "KeyType": "HASH"
            },
            {
              "AttributeName": "ReplyDateTime",
              "KeyType": "RANGE"
            }
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        }
      }
    ]
  });

  console.log("GSI created");
}

// createGSI();

// describeTable('Reply');


async function queryReplyByGSI() {
  console.log(
    await docClient.query({
      TableName: 'Reply',
      IndexName: 'PostedBy-ReplyDateTime-gsi',
      KeyConditionExpression: "PostedBy = :user",
      ExpressionAttributeValues: {
        ":user": "User A"
      },
      ReturnConsumedCapacity: "total",
    }).promise()
  );
}

// queryReplyByGSI();

async function deleteGSI() {
  const output = await client.updateTable({
    TableName: "Reply",
    GlobalSecondaryIndexUpdates: [
      {
        Delete: {
          IndexName: 'PostedBy-ReplyDateTime-gsi'
        }
      }
    ]
  });

  console.log(output);
  console.log("GSI deleted");
}

// deleteGSI();