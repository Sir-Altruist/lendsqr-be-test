import express, { Express, Response } from "express";
import { env } from "./config";
import cors from "cors";
import routes from "./routes";
import { Logger } from "./libs";
import morgan from "morgan";

const app: Express = express();
const port = env.PORT || 5000;

// Cross-origin resource sharing
app.use(cors());
app.use(morgan("dev"));

// parses body request
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));

app.use("/v1.0/api", routes);

app.get("/", (_, res: Response) => {
    res.send("Lendsqr backend interview test");
});

app.all('*', (req, res) => res.send({ message: 'route not found' }));

const server = app.listen(port, () => {
    Logger.info(`server running on port: ${port}`)
})

export default server;
