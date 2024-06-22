import { Knex } from "knex";
import { db } from "../datasources"
import { IUser } from "../interfaces";

const User = db('users')
let knex: Knex;

class UserRepo {
    async create(payload: IUser): Promise<object> {
        try {
            return await User.insert(payload); 
        } catch (error) {
            throw new Error(error)
        } finally {
            knex.destroy()
        }
    }

    async findOne(id: string): Promise<object> {
        try {
            return await User.select().where({ id }).leftJoin('wallets', 'users.id', 'wallets.userId')
        } catch (error) {
           throw new Error(error) 
        } finally {
            knex.destroy()
        }
    }

    async findByParams(parameter: string): Promise<object> {
        return await User.select()
        .where({ email: parameter })
        .orWhere({ phoneNumber: parameter })
        .then(user => user[0])
    }
}

export default new UserRepo();
