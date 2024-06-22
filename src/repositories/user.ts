import { db } from "../datasources"
import { IUser } from "../interfaces";

const User = db('users')

class UserRepo {
    async create(payload: IUser): Promise<object> {
        return await User.insert(payload);
    }

    async findOne(parameter: string): Promise<object> {
        return await User.select()
        .where({ id: parameter })
        .orWhere({ email: parameter })
        .orWhere({ phoneNumber: parameter })
        .then(user => user[0])
    }
}

export default new UserRepo();
