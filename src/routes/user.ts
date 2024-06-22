import { Router } from "express";
import { UserControllers } from "../controllers";
import { AuthenticationMiddleware } from "../middlewares";

const router = Router();

const { register, login, details, findAllUsers, updateUser, deleteUser } =
  UserControllers;

router.post("/register", register);
router.post("/login", login);
router.get("/all", AuthenticationMiddleware, findAllUsers);
router.get("/", AuthenticationMiddleware, details);
router.patch("/", AuthenticationMiddleware, updateUser);
router.delete("/", AuthenticationMiddleware, deleteUser);

export default router;
