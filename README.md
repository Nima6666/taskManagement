### **Instructions to Set Up the Project**

**Client:**

1. Navigate to the `taskManagementClient` directory and run `npm install` to install dependencies.
2. Update the `.env` file in client with `VITE_SERVERAPI = http://localhost:3000`. On default server will be running on port 3000. On server side the `.env` expects `DB_USER DB_PASSWORD DB_PORT DB_HOST DB_NAME JWT_SECRET EMAIL PASS` these values.
3. Start the React project with `npm run dev`.

**Server:**

1. Navigate to the `taskManagementServer` directory and run `npm install` to install dependencies.
2. Update the `.env` file with your database information and credentials (you can use mine for Nodemailer).
3. Run `npm run migrateDb` to migrate database tables.
4. Populate the database with random tasks using `npm run populateDb <your access token>`. Obtain the access token by sending a POST request to `http://localhost:<server port>/user/login` with the body `{"email": "your email", "password": "your password"}`.
5. Start the Express server with `npm start` or `npm run dev`.
