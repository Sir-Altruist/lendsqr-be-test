import { v4 } from "uuid";
import { db } from "../datasources"
import { IWallet } from "../interfaces";

class WalletRepo {
    async create(payload: IWallet): Promise<object> { 
        const result = await db.transaction(async (trx) => {
            payload.id = v4()
            return await trx('wallets').insert(payload, 'id').transacting(trx);
        });
        return result;
    }

    async fund(id: string, balance: number): Promise<number> {
        const result = await db.transaction(async (trx) => {
            return await trx('wallets').where({ id }).increment('balance', balance)
        })
        return result;
    }

    async withdraw(id: string, balance: number): Promise<number> {
        const result = await db.transaction(async (trx) => {
            return await trx('wallets').where({ id }).decrement('balance', balance)
        })
        return result;
    }

    async find(parameter: string): Promise<object> {
        const result = await db.transaction(async (trx) => {
            return await trx('wallets').select().where({ id: parameter }).orWhere({ accountNumber: parameter }).first()
        })
        return result;
    }
}

export default new WalletRepo();
