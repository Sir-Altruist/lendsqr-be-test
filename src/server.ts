import express, { Express, Request, Response } from "express";
import { env } from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import { Logger } from "./libs";
import { Cloudinary } from "./config";
import morgan from "morgan";
// import { rateLimit } from "express-rate-limit";
import { metrics, restResponseTimeHistogram } from "./utils";
import responseTime from "response-time";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = env.PORT || 8000;

// Cross-origin resource sharing
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
// Cloudinary config
app.use("*", Cloudinary.config);

// parses body request
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

// app.use(
//     rateLimit({
//     // Limit each IP to a certain number of requests every 15 minutes.
//         windowMs: 15 * 60 * 1000,
//         limit: Number(env.RATE_LIMIT),
//         message:
//       "Too many requests from this IP, please try again after 20 minutes.",
//         legacyHeaders: false
//     })
// );

app.use(
    responseTime((req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
            restResponseTimeHistogram.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    statusCode: res.statusCode
                },
                time * 1000
            );
        }
    })
);

app.get("/", (_, res: Response) => {
    res.send("Welcome to fapss backend framework!!!");
});

//metrics
app.get("/metrics", metrics);

app.use("/api", routes);

app.listen(port, () => Logger.info(`server running on port: ${port}`));
