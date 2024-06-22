import { db } from "../datasources"
import { IWallet } from "../interfaces";

const Wallet = db('wallet')

class WalletRepo {
    async create(payload: IWallet): Promise<object> {
        return await Wallet.insert(payload);
    }

    async update(id: string, payload: IWallet): Promise<number> {
        return await Wallet.update(payload).where({ id })
    }
}

export default new WalletRepo();
