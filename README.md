## simple-comment-section

### 簡介

一個需登入／註冊的留言板。

### Build the web page

```shell
yarn install
// for development
yarn workspace frontend run build
// for production
yarn workspace frontend run build-prod
```

### Set up backend

1. Install PostgreSQL and redis

2. Configure Database

   ```shell
   // create .env file at ./backend
   touch ./backend/.env
   ```

   ```shell
   # ./backend/.env
   DATABASE_URL=postgresql://user:pass@hostname:port
   ```

3. Set up prisma

   ```shell
   cd backend
   npx prisma migrate dev
   cd ..
   yarn workspace backend run prisma:gen
   ```

4. Set up environment variable

   ```shell
   export SESSION_SECRET="session_secret"
   export APP_PORT="4000"
   export REDIS_HOST="localhost"
   ```

5. Start server

   ```shell
   yarn workspace backend run server
   ```

   