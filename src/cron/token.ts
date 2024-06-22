import { RefreshTokenRepo } from "../repositories";
import { Tools } from "../utils";

async function clearToken() {
    const tokens: any = await RefreshTokenRepo.findAll();
    for (const item of tokens) {
        if (Tools.compareDates(new Date(item?.createdAt), new Date())) {
            await RefreshTokenRepo.remove(item?.id);
        }
    }
}

export default clearToken;
