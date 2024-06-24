import { Router } from "express";
import AuthRoutes from "./auth";
import WalletRoutes from "./wallet";
import HealthCheck from "./healthcheck";
import { Authentication } from "../middlewares";

const router = Router();

router.use("/healthcheck", HealthCheck);
router.use("/auth", AuthRoutes);
router.use("/wallet", Authentication, WalletRoutes);

export default router;
