const fs = require('fs');
const path = require('path');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Post = require('./resolvers/Post');
const DateTime = require('./resolvers/DateTime');
const Subscription = require('./resolvers/Subscription');

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
);

const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  DateTime,
  Subscription,
};

module.exports = {
  typeDefs,
  resolvers,
};
