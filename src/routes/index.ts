import { Router } from "express";
import UserRoutes from "./user";
import TokenRoutes from "./token";
import HealthCheck from "./healthcheck";

const router = Router();

router.use("/user", UserRoutes);
router.use("/token", TokenRoutes);
router.use("/healthcheck", HealthCheck);

export default router;
