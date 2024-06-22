import { Router } from "express";
import { UserControllers } from "../controllers";
import { Authentication } from "../middlewares";

const router = Router();

const { registration, login, userInfo } = UserControllers;

router.post("/registration", registration);
router.post("/login", login);
router.get("/info", Authentication, userInfo);


export default router;
