const assert = require('assert').strict;
const SESSION_SECRET = process.env.SESSION_SECRET;
const APP_PORT = process.env.APP_PORT;
const POST_LINK = 'POST_LINK';
assert.ok(SESSION_SECRET, 'SESSION_SECRET is required');
assert.ok(APP_PORT, 'APP_PORT is required');
module.exports = {
  SESSION_SECRET,
  APP_PORT,
  POST_LINK,
};
