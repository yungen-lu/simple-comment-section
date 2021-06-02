const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some';
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const Redis = require('ioredis');
const redisClient = new Redis();

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

async function getUserId(req) {
  if (req) {
    const authHeader = req.headers.authorization;
    const cookieString = req.headers.cookie;
    const body = req.body;
    console.log('cookie ', cookieString);
    if (cookieString) {
      const cookieParsed = cookie.parse(cookieString);
      console.log('cookieParsed ', cookieParsed);
      if (cookieParsed.sid) {
        let sidParsed = cookieParser.signedCookie(cookieParsed.sid, 'asd');
        sidParsed = 'sess:' + sidParsed;
        console.log(sidParsed);
        const result = await redisClient.get(sidParsed);
        const parsed = JSON.parse(result);
        return parsed.userId;
      }
    }
    // if (body) {
    //   if (body.email && body.password) {
    //     const prisma = new PrismaClient();
    //   }
    // }
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  }
  console.log('shit');
  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId,
};
