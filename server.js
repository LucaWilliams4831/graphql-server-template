const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const faker = require('faker');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const http = require('http');

const NEW_BLOCK = 'NEW_BLOCK';
const NEW_TRANSACTION = 'NEW_TRANSACTION';
const VALIDATOR_UPDATED = 'VALIDATOR_UPDATED';
const GREETING_SUBSCRIPTION = 'HELLO LUCA!';

const app = express();
const { default: playground } = require('graphql-playground-middleware-express');

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    proposerBlocks: [Block!]!
    transactions: [Transaction!]!
    validators: [Validator!]!
    hello: String
  }

  type Block {
    height: Int!
    proposer: String!
    time: String!
  }

  type Transaction {
    hash: ID!
    type: String!
    from: String!
    to: String!
    totalAmount: Float!
    time: String!
  }

  type Validator {
    name: String!
    stakedPriceCoin: Float!
    status: String!
  }

  type Subscription {
    blockAdded: Block!
    transactionAdded: Transaction!
    validatorUpdated: Validator!
    greeting: String!
  }
`;

const mocks = {
  Query: () => ({
    proposerBlocks: () =>
      new Array(10).fill(null).map(() => ({
        height: faker.datatype.number(),
        proposer: faker.random.uuid(),
        time: faker.date.recent().toISOString(),
      })),
    transactions: () =>
      new Array(10).fill(null).map(() => ({
        hash: faker.random.uuid(),
        type: faker.finance.transactionType(),
        from: faker.random.uuid(),
        to: faker.random.uuid(),
        totalAmount: parseFloat(faker.finance.amount()),
        time: faker.date.recent().toISOString(),
      })),
    validators: () =>
      new Array(10).fill(null).map(() => ({
        name: faker.internet.userName(),
        stakedPriceCoin: parseFloat(faker.finance.amount()),
        status: faker.random.arrayElement(['Active', 'Inactive']),
      })),
    hello: () => 'Hello World!',
  }),
};

const resolvers = {
  Query: {
    proposerBlocks: () => [],
    transactions: () => [],
    validators: () => [],
    hello: () => 'Hello World!'
  },
  Subscription: {
    blockAdded: {
      subscribe: () => pubsub.asyncIterator([NEW_BLOCK]),
    },
    transactionAdded: {
      subscribe: () => pubsub.asyncIterator([NEW_TRANSACTION]),
    },
    validatorUpdated: {
      subscribe: () => pubsub.asyncIterator([VALIDATOR_UPDATED]),
    },
    greeting: {
      subscribe: () => pubsub.asyncIterator(GREETING_SUBSCRIPTION),
      resolve: (payload) => {
        return payload.greeting;
      },
    },
  },
};

// Publish mock data to subscriptions at regular intervals
function publishMockData() {
  setInterval(() => {
    const block = {
      height: faker.datatype.number(),
      proposer: faker.random.uuid(),
      time: faker.date.recent().toISOString(),
    };
    pubsub.publish(NEW_BLOCK, { blockAdded: block });

    const transaction = {
      hash: faker.random.uuid(),
      type: faker.finance.transactionType(),
      from: faker.random.uuid(),
      to: faker.random.uuid(),
      totalAmount: parseFloat(faker.finance.amount()),
      time: faker.date.recent().toISOString(),
    };
    pubsub.publish(NEW_TRANSACTION, { transactionAdded: transaction });

    const validator = {
      name: faker.internet.userName(),
      stakedPriceCoin: parseFloat(faker.finance.amount()),
      status: faker.random.arrayElement(['Active', 'Inactive']),
    };
    pubsub.publish(VALIDATOR_UPDATED, { validatorUpdated: validator });
  }, 5000);
}

publishMockData();

const { makeExecutableSchema } = require('graphql-tools');
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Start the server and subscription server
const startServer = async () => {
const server = new ApolloServer({
    typeDefs,
    resolvers,
    mocks,
    mockEntireSchema: true,
  });

  await server.start();
  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);

  const port = process.env.PORT || 5000;
  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`
  );
};

startServer();