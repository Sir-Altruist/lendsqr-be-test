import { Router } from "express";
import { AuthControllers } from "../controllers";
import { Authentication } from "../middlewares";

const router = Router();

const { signup, signin, userInfo } = AuthControllers;

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/info", Authentication, userInfo);


export default router;
