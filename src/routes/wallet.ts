import { Router } from "express";
import { WalletControllers } from "../controllers";

const router = Router();

const { wallet, fundTransfer } = WalletControllers;

router.patch("/action", wallet);
router.patch("/transfer", fundTransfer);


export default router;
