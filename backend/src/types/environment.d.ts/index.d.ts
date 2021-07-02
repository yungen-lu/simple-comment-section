declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      APP_PORT: string;
      SESSION_SECRET: string;
      REDIS_HOST: string;
    }
  }
}
export {};
