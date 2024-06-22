import type { Knex } from "knex";
import { v4 } from "uuid"


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', 
        (table: Knex.TableBuilder) => {
            table.uuid('id').primary().unique().defaultTo(knex.raw('(UUID())'));
            table.string('fullName', 255).notNullable();
            table.string('email', 255).notNullable().unique();
            table.string('phoneNumber', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('username', 255).nullable();
            table.timestamps(true, true)
        }
    )
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users')
}

