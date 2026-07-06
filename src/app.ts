import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import config from './config';
const app: Application = express()


app.use(cors({
    origin: config.app_url,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
    res.send("Rent_Nest API is running, visit/health for status.");
});

export default app;