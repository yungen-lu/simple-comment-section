const assert = require('assert').strict;
const SESSION_SECRET = process.env.SESSION_SECRET;
const APP_PORT = process.env.APP_PORT;
const POST_LINK = 'POST_LINK';
let REDIS_HOST = null;
if (process.env.NODE_ENV == 'production') {
  REDIS_HOST = process.env.REDIS_HOST;
  assert.ok(REDIS_HOST, 'REDIS_HOST is required');
}
assert.ok(SESSION_SECRET, 'SESSION_SECRET is required');
assert.ok(APP_PORT, 'APP_PORT is required');
module.exports = {
  SESSION_SECRET,
  APP_PORT,
  POST_LINK,
  REDIS_HOST,
};
