const { ApolloServer } = require('apollo-server'); 
const { ApolloGateway } = require('@apollo/gateway'); 
const gateway = new ApolloGateway({ serviceList: [ { name: 'chain1Data', url: 'http://localhost:4001' }, { name: 'chain2', url: 'http://localhost:4002' }], }); 
const server = new ApolloServer({ gateway, subscriptions: false }); 
server.listen(4000).then(({ url }) => { console.log(`🚀 Gateway ready at ${url}`); }); 