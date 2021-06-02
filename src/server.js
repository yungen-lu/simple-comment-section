const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { getUserId } = require('./utils');
const { schema } = require('./schema');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
// const cookieParser = require('cookie-parser');
// const cookie = require('cookie');
const pubsub = new PubSub();
const app = express();
const prisma = new PrismaClient();
const PORT = 4000;
const Redis = require('ioredis');
const session = require('express-session');

let RedisStore = require('connect-redis')(session);
const redisClient = new Redis();
app.use(
  session({
    name: 'sid',
    store: new RedisStore({ client: redisClient }),
    secret: 'asd',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
// app.get('/app/home.js', (req, res) => {
//   res.sendFile();
// });
app.use(
  '/app',
  (req, res, next) => {
    console.log('connected to app');
    if (!req.session || !req.session.userId) {
      console.log('no cookie');
      res.redirect('/home');
    } else {
      console.log('OK');
      next();
    }
    // const cookieString = req.headers.cookie;
    // console.log(req.session.userId);
    // let tmp = null;
    // console.log('cookie ', cookieString);
    // if (cookieString) {
    //   const cookieParsed = cookie.parse(cookieString);
    //   console.log('cookieParsed ', cookieParsed);
    // if (cookieParsed.sid) {
    //   let sidParsed = cookieParser.signedCookie(cookieParsed.sid, 'asd');
    //   sidParsed = 'sess:' + sidParsed;
    //   console.log(sidParsed);
    //   redisClient
    //     .get(sidParsed)
    //     .then((e) => {
    //       console.log(e);
    //       tmp = JSON.parse(e);
    //       console.log(tmp);
    //       res.redirect('/test');
    //     })
    //     .catch((e) => {
    //       console.error(e);
    //     });
    // }
    // }
  },
  express.static('public/app')
);

app.use('/home', express.static('public/home'));
app.post('/login', express.json(), async (req, res) => {
  console.log(req.body);
  const bcrypt = require('bcryptjs');
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
    req.session.userId = user.id;
    res.redirect(301, '/app');
  } catch (err) {
    console.log(err);
    throw new Error('server error');
  }
  // prisma.user
  //   .findUnique({
  //     where: { email: req.body.email },
  //   })
  //   .then((user) => {
  //     if (!user) {
  //       console.log('err');
  //       throw new Error('No such user found');
  //     }
  //     // res.sendStatus(200);
  //     return user;
  //   })
  //   .then((user) => {
  //     bcrypt
  //       .compare(req.body.password, user.password)
  //       .then((valid) => {
  //         if (!valid) {
  //           console.log('err');
  //           throw new Error('Invalid password');
  //         }
  //         req.session.userId = user.id;
  //         // res.sendStatus(200);
  //         res.redirect(301, '/app');
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.sendStatus(500);
  //   });
});

app.post('/signup', express.json(), async (req, res) => {
  console.log(req.body);
  const bcrypt = require('bcryptjs');

  //--------------
  //
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: { email: req.body.email, name: req.body.user, password },
    });
    console.log(user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    throw new Error('server error');
  }

  //
  //
  //
  //
});

// app.use('/signup', express.static('public/signup'));
// app.use('/login', express.static('public/login'));
// app.use('/app', (req, res) => {
//   console.log('connected');
//   const cookieString = req.headers.cookie;
//   console.log(req.session.userId);
//   let tmp = null;
//   console.log('cookie ', cookieString);
//   if (cookieString) {
//     const cookieParsed = cookie.parse(cookieString);
//     console.log('cookieParsed ', cookieParsed);
// if (cookieParsed.sid) {
//   let sidParsed = cookieParser.signedCookie(cookieParsed.sid, 'asd');
//   sidParsed = 'sess:' + sidParsed;
//   console.log(sidParsed);
//   redisClient
//     .get(sidParsed)
//     .then((e) => {
//       console.log(e);
//       tmp = JSON.parse(e);
//       console.log(tmp);
//       res.redirect('/test');
//     })
//     .catch((e) => {
//       console.error(e);
//     });
// }
//   }
// });
// app.use('/test', express.static('public/app'));
app.get('*', (req, res) => {
  if (req.session.userId) {
    console.log('logged in');
    res.redirect('/app');
  } else {
    console.log('not logged in');
    res.redirect('/login');
  }
});

const apolloServer = new ApolloServer({
  schema: schema,
  context: ({ req }) => {
    // console.log('id is ', req.session.userId);
    return {
      req,
      prisma,
      pubsub,
      userId: req.session.userId,

      // req && (req.headers.authorization || req.headers.cookie)
      //   ? getUserId(req).then()
      //   : null,
    };
  },
});

apolloServer.applyMiddleware({ app });
const server = createServer(app);
apolloServer.installSubscriptionHandlers(server);

server.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
});
