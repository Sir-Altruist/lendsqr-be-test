const path = require('path')
require('dotenv').config({path: path.join(__dirname,'../../.env')});
// require('ts-node/register');
// require('dotenv').config()

console.log(process.env.DB_NAME)
const config = {
  client: 'mysql2',
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    host: process.env.DB_HOST
  },
  pool: {
    min: 2,
    max: 10
  },
  useNullAsDefault: true,
  // debug: process.env.NODE_ENV === "development" ? true : false,
  migrations: {
    tableName: 'migrations',
    directory: '../database/migrations',
    extension: 'ts'
  },
  timezone: 'UTC'
};

export default config