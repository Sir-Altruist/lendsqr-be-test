import { StatusCode } from "../interfaces";
import { Response, Router } from "express";

const router = Router();

router.get("/", (_, res: Response) => {
    res.sendStatus(StatusCode.OK);
});

export default router;
