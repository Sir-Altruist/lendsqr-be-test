import knex from "knex";
import { db } from "../datasources"
import { IUser } from "../interfaces";

const User = db('users')

class UserRepo {
    async create(payload: IUser): Promise<object> {
        {/** Transaction allows for atomicity */}
        const result = await db.transaction(async (trx) => {
            const [insertedId] = await trx('users').insert(payload, 'id'); 
            const insertedRecord = await trx('users').where({ id: insertedId }).first()
            return insertedRecord
        })
        return result;
    }

    async findOne(id: string): Promise<object> {
        {/** Eager loading */}
        return await User.select('users.*', 'wallets.*').where('users.id', id).leftJoin('wallets', 'users.id', 'wallets.userId')
    }

    async findByParams(parameter: string): Promise<object> {
        try {
            return await User.select()
            .where({ email: parameter })
            .orWhere({ phoneNumber: parameter })
            .then(user => user[0])  
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default new UserRepo();
