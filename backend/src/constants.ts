import assert from 'assert';
export const SESSION_SECRET: string = process.env.SESSION_SECRET;
export const APP_PORT: string = process.env.APP_PORT;
export const POST_LINK: string = 'POST_LINK';
export const REDIS_HOST: string = process.env.REDIS_HOST;
assert.ok(REDIS_HOST, 'REDIS_HOST is required');
assert.ok(SESSION_SECRET, 'SESSION_SECRET is required');
assert.ok(APP_PORT, 'APP_PORT is required');
