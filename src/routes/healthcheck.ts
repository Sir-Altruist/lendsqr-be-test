import { StatusCode } from "../interfaces";
import { Response, Router } from "express";

const router = Router();

{/** Returns OK if server is on */}
router.get("/", (_, res: Response) => {
    res.sendStatus(StatusCode.OK);
});

export default router;
