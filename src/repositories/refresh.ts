import { RefreshToken } from "../models";

class RefreshTokenRepo {
    async create(payload): Promise<object> {
        return await RefreshToken.create(payload);
    }

    async findOne(token: string): Promise<object> {
        return await RefreshToken.findOne({
            where: { token }
        });
    }

    async findAll(): Promise<object> {
        return await RefreshToken.findAll();
    }

    async remove(id: string): Promise<number> {
        return await RefreshToken.destroy({
            where: { id }
        });
    }
}

export default new RefreshTokenRepo();
