const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const Redis = require('ioredis');
const { SESSION_SECRET, REDIS_HOST } = require('./constants');
const redisClient = new Redis({
  port: 6379,
  host: REDIS_HOST,
});

async function parseCookie(cookieString) {
  if (cookieString) {
    const cookieParsed = cookie.parse(cookieString);
    console.log('cookieParsed ', cookieParsed);
    if (cookieParsed.sid) {
      let sidParsed = cookieParser.signedCookie(
        cookieParsed.sid,
        SESSION_SECRET
      );
      sidParsed = 'sess:' + sidParsed;
      console.log(sidParsed);
      const result = await redisClient.get(sidParsed);
      const parsed = JSON.parse(result);
      console.log('||', parsed);
      return parsed.userId;
    }
  } else {
    return null;
  }
}

module.exports = {
  parseCookie,
};
