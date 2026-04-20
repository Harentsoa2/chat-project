import 'dotenv/config';
import express, { Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDatabase from './config/database.config';
import { Env } from './config/env.config';


const app = express();
const server = http.createServer(app);


app.use(express.json({limit : "10mb"})); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);


server.listen(Env.PORT, async () => {
    await connectDatabase();
  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
