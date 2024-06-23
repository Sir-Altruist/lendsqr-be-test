import { Router } from "express";
import UserRoutes from "./user";
import WalletRoutes from "./wallet";
import HealthCheck from "./healthcheck";
import { Authentication } from "../middlewares";

const router = Router();

router.use("/healthcheck", HealthCheck);
router.use("/user", UserRoutes);
router.use("/wallet", Authentication, WalletRoutes);

export default router;
