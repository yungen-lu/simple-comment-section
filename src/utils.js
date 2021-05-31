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
    console.log('cookie ', cookieString);
    if (cookieString) {
      const cookieParsed = cookie.parse(cookieString);
      console.log('cookieParsed ', cookieParsed);
      if (cookieParsed.sid) {
        let sidParsed = cookieParser.signedCookie(cookieParsed.sid, 'asd');
        sidParsed = 'sess:' + sidParsed;
        console.log(sidParsed);
        return redisClient.get(sidParsed);
        // .then((e) => {
        //   console.log(e);
        //   tmp = JSON.parse(e);
        //   console.log(tmp.userId);
        //   return tmp.userId;
        // })
        // .catch((e) => {
        //   console.error(e);
        // });
      }
    }
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
