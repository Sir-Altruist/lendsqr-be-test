import knex from "knex";
import { dbConfig } from "../config";

// const config = dbConfig[env.NODE_ENV || 'development']

const db = knex(dbConfig);

export default db;
