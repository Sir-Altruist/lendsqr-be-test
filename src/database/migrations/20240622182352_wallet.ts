import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', 
        (table: Knex.TableBuilder) => {
            table.uuid('id').primary().notNullable().unique();
            table.string('accountNumber').notNullable();
            table.uuid('userId').references('id').inTable('users').onDelete('CASCADE');
            table.decimal('balance').defaultTo(0);
            table.timestamps(true, true)
        }
    )
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('wallets')
}

