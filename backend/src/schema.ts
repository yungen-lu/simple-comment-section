import fs from 'fs';
import path from 'path';
import * as Query from './resolvers/Query';
import * as Mutation from './resolvers/Mutation';
import * as User from './resolvers/User';
import * as Post from './resolvers/Post';
import * as DateTime from './resolvers/DateTime';
import * as Subscription from './resolvers/Subscription';

export const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
);

export const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  DateTime,
  Subscription,
};
