import type { Knex } from "knex";
import env from "./env";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mysql",
        connection: {
            database: env.DB_NAME,
            user: env.DB_USER,
            password: env.DB_PASSWORD
        },
        useNullAsDefault: true,
        debug: env.NODE_ENV === "development" ? true : false,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            directory: "../database/migrations",
            tableName: "knex_migrations"
        },
        seeds: {
            directory: "../database/seeders"
        }
    }
};

export default config;
// module.exports = config;
