import { Router } from "express";
import { AuthControllers } from "../controllers";
import { AuthenticationMiddleware, ValidationMiddleware, BlackListMiddleware } from "../middlewares";

const router = Router();

const { signup, signin, userInfo } = AuthControllers;

router.post("/signup", ValidationMiddleware, BlackListMiddleware, signup);
router.post("/signin", signin);
router.get("/info", AuthenticationMiddleware, userInfo);


export default router;
