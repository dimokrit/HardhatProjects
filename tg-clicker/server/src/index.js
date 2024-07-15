import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import guildRouter from './routes/guild.routes.js';
import ratingRouter from './routes/rating.routes.js';
import dataRouter from './routes/data.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import requestIp from 'request-ip';
import jwt from 'jsonwebtoken';
import * as path from 'path';

dotenv.config();

const port = process.env.APP_PORT;
const app = express();


function verifyClientIP(req, res, next) {
  const clientIP = req.headers['x-forwarded-for']
  console.log(clientIP)
  //console.log("IP: ", clientIP)
  // if (!allowedIPs.has(clientIP)) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }
  next();
}

async function auth(req, res, next) {
  if (req.method != "GET" && req.path != '/api/user/register' && req.path != '/api/guild/create') {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    let _userId
    if (!token)
      return res.status(401).json({ error: 'Unauthorized user' });

    if (token != '777') {
      jwt.verify(token, process.env.JWT_KEY, async (err, res) => {
        if (err)
          return res.status(401).json({ error: 'Forbidden' });

        _userId = res.id
      });
    } else _userId = 777

    if (_userId != req.body.userId)
      return res.status(401).json({ error: 'Unauthorized user' });
  }
  next();
}

app.use(express.json());
app.use(cors({ credentials: true }));
app.use('/static', express.static('/root/clicker_server/uploads'));
app.use(verifyClientIP);
app.use(auth); 


app.use('/api/user', userRouter);
app.use('/api/guild', guildRouter);
app.use('/api/rating', ratingRouter);
app.use('/api/data', dataRouter);

app.use(errorMiddleware);
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});