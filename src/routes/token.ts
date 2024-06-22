import { Router } from "express";
import { TokenControllers } from "../controllers";
import * as cron from "node-cron";
import { Logger } from "../libs";
import * as CronJob from "../cron";

const router = Router();

{
    /** Cron job runs every 6 minutes */
}
cron.schedule("*/6 * * * *", () => {
    Logger.info("Running token job...");
    CronJob.clearToken();
});

const { generateAccessToken } = TokenControllers;

router.post("/refresh", generateAccessToken);

export default router;
