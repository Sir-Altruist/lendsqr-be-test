import { Router } from "express";
import UserRoutes from "./user";
import HealthCheck from "./healthcheck";

const router = Router();

router.use("/user", UserRoutes);
router.use("/healthcheck", HealthCheck);

export default router;
