import cookieParser from 'cookie-parser';
import cookie from 'cookie';
import Redis from 'ioredis';
import { SESSION_SECRET, REDIS_HOST } from './constants';
const redisClient = new Redis({
  port: 6379,
  host: REDIS_HOST,
});

export async function parseCookie(cookieString: string) {
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
      if (result) {
        const parsed = JSON.parse(result);
        return parsed.userId;
      } else {
        throw Error('JSON parse error');
        return null;
      }
    }
  } else {
    return null;
  }
}
