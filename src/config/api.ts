import axios, { AxiosInstance } from "axios"
import env from "./env";

const config: AxiosInstance = axios.create({
    baseURL: env.LENDSQR_API_BASE_URL,
    headers: {
        Authorization: `Bearer ${env.LENDSQR_SECRET_KEY}`
    }
});


export default config;