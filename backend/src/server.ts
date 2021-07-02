import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { typeDefs, resolvers } from './schema';
import { APP_PORT, SESSION_SECRET, REDIS_HOST } from './constants';
import console from 'console';
const prisma = new PrismaClient();
const RedisStore = connectRedis(session);
const redisClient = new Redis({
  port: 6379,
  host: REDIS_HOST,
});
const pubsub = new PubSub();
const app = express();
app.use(
  session({
    name: 'sid',
    secret: SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(
  '/app',
  (req: Request, res: Response, next: NextFunction) => {
    console.log('connected to app');
    if (!req.session || !req.session.userId) {
      res.redirect('/loginsignup');
    } else next();
  },
  express.static('../../frontend/public/app')
);

app.use('/loginsignup', express.static('../../frontend/public/loginsignup'));
app.post('/login', express.json(), async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error('No such user found');
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    req.session.userId = user.id.toString();
    // res.redirect(301, '/app');
    res.status(200).send({ id: user.id, url: '/app' });
  } catch (err) {
    console.log(err);
    throw new Error('server error');
  }
});

app.post('/signup', express.json(), async (req, res) => {
  console.log(req.body);
  const bcrypt = require('bcryptjs');

  try {
    const password = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: { email: req.body.email, name: req.body.user, password },
    });
    console.log(user);
    res.status(200).send({ id: user.id, url: '/app' });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    // throw new Error('server error');
  }
});

app.get('*', (req, res) => {
  if (req.session.userId) {
    console.log('logged in');
    res.redirect('/app');
  } else {
    console.log('not logged in');
    res.redirect('/loginsignup');
  }
});

const apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  subscriptions: {
    onConnect: (_connectionParams, webSocket, _context) => {
      // console.log(webSocket.upgradeReq.headers.cookie);
      console.log(webSocket);
      // return {
      //     userId: parseCookie(webSocket.upgradeReq.headers.cookie),
      // };
    },
  },
  context: ({ req, res, connection }) => {
    // console.log(req.session);
    if (connection) {
      if (!connection.context.userId) {
        res.status(500).send('not authenticated');
      }
      return {
        prisma,
        pubsub,
        userId: connection.context.userId,
      };
    }
    return {
      // req,
      prisma,
      pubsub,
      userId: req.session && req.session.userId ? req.session.userId : null,
    };
  },
});

apolloServer.applyMiddleware({ app });
const server = createServer(app);
apolloServer.installSubscriptionHandlers(server);

server.listen(APP_PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${APP_PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${APP_PORT}${apolloServer.subscriptionsPath}`
  );
  console.log(redisClient.status);
});
