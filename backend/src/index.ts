import 'dotenv/config';
import express, { Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Env } from './config/env.config';
import { asyncHandler } from './middlewares/asyncHandler.middleware';
import { HTTPSTATUS } from './config/http.config';
import { error } from 'console';
import { errorHandler } from './middlewares/error.midddlerware';
import connectDatabase from './config/database.config';
import passport, { initialize } from 'passport';
import router from './routes';
import { initializeSocket } from './lib/socket';

const app = express();
const server = http.createServer(app);

//socket initialization
initializeSocket(server);

app.use(express.json({limit : "10mb"})); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(passport.initialize()); // passport initialization


app.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Server is healthy",
      status: "OK",
    });
  })
);
 
app.use('/api', router)

if (process.env.NODE_ENV === "production") {
  const clientPath = require("path").resolve(__dirname, "../../client/dist");

  // Serve static files
  app.use(require("express").static(clientPath));

  app.get(/^(?!\/api).* /, (req, res) => {
    res.sendFile(require("path").join(clientPath, "index.html"));
  });
}

app.use(errorHandler)

server.listen(Env.PORT, async () => {
    await connectDatabase();
  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
