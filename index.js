const { ApolloServer, gql } = require('apollo-server'); 
const { buildFederatedSchema } = require('@apollo/federation'); 
const typeDefs = gql` type Chain1Data @key(fields: "id") { id: ID! title: String description: String } type Query { chain1Data: [Chain1Data] } `; 
const chain1Data = [ { id: '1', title: 'Item 1', description: 'Item 1 description' }, { id: '2', title: 'Item 2', description: 'Item 2 description' }, ]; 
const resolvers = { Query: { chain1Data: () => chain1Data, }, Chain1Data: { __resolveReference(ref) { return chain1Data.find((item) => item.id === ref.id); }, }, }; 
const server = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]), }); 
server.listen({ port: 4001 }).then(({ url }) => { console.log(`🚀 Chain1 ready at ${url}`); }); 