import express, { Router } from 'express';
import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import gmailRouter from './routes/gmail.routes.js';
import telegramRouter from './routes/telegram.routes.js';
import discordRouter from './routes/discord.routes.js'
import web3Router from './routes/web3.router.js'
import achivmentsRouter from './routes/achivments.router.js'
import xRouter from './routes/x.router.js'
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(express.static('static'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(session({
    secret: "some secret",
    saveUninitialized: true,
    resave: true,
    cookie: { secure: false }
}))

app.use('/api/gmail', gmailRouter);
app.use('/api/telegram', telegramRouter);
app.use('/api/discord', discordRouter);
app.use('/api/web3', web3Router);
app.use('/api/achivments', achivmentsRouter);
app.use('/api/x', xRouter);

app.use(errorMiddleware);

(async function () {
    try {
        app.listen(port, () => console.info(`INFO: Server start on port: ${port}`));
    } catch (e) {
        console.error(e);
    }
}());
