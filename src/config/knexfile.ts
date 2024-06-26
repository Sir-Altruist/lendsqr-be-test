// const isProduction = process.env.NODE_ENV === 'production';

// if(!isProduction) require('dotenv').config({ path: '../../.env' })
// require('dotenv').config()
import 'dotenv/config'

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
  migrations: {
    tableName: 'migrations',
    directory: '../database/migrations',
    extension: 'ts'
  },
  timezone: 'UTC'
};

export default config