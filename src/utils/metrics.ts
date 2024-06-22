import { Request, Response } from "express";
import client from "prom-client";

export const restResponseTimeHistogram = new client.Histogram({
    name: "framework_api",
    help: "REST API response time in seconds",
    labelNames: ["method", "route", "statusCode"]
});

export const databaseResponseTimeHistogram = new client.Histogram({
    name: "database_response_time_duration_seconds",
    help: "Database response time in seconds",
    labelNames: ["operation", "success"]
});

//collect default metrics
const defaultMetrics = client.collectDefaultMetrics;
defaultMetrics();

const metrics = async (req: Request, res: Response) => {
    // set header
    res.set("Content-Type", client.register.contentType);
    // send metrics
    return res.send(await client.register.metrics());
};

export default metrics;
