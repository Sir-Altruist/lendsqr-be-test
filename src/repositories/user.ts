import { db } from "../datasources"
import { IUser } from "../interfaces";
import { v4 } from "uuid";

class UserRepo {
    async create(payload: IUser): Promise<object> { 
            {/** This returns data after insertion. MYSQL does not support returning(*) method provided by knexjs */}
            const result = await db.transaction(async (trx) => {
                payload.id = v4()
                await trx('users').insert(payload, 'id').transacting(trx);
                const user =await trx('users').where({ id: payload.id }).first()
                return user;
            })
            return result
    }

    async findOne(id: string): Promise<object> {
        {/** Eager loading */}
        const result = await db.transaction(async (trx) => {
            return await trx('users')
            .select('users.*', 'wallets.id as walletId', 'wallets.*')
            .where('users.id', id)
            .leftJoin('wallets', 'users.id', 'wallets.userId')
            .first()
        })

        return result;
    }

    async findByParams(parameter: string): Promise<object> {
        const result = await db.transaction(async (trx) => {
            return await trx('users').select()
            .where({ email: parameter })
            .orWhere({ phoneNumber: parameter })
            .first()
        })
        return result;
    }
}

export default new UserRepo();
