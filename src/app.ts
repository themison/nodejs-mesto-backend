import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import loginRouter from './routes/login';
import errorMiddleware from './middlewares/error';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string
      }
    }
  }
}

dotenv.config();
const app = express();

const PORT = 3000;

mongoose.connect('mongodb://admin:password@localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use('/', loginRouter);
app.use(auth);
app.use('/', cardsRouter);
app.use('/', usersRouter);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorLogger);
app.use(errorMiddleware);

app
  .listen(PORT, () => {
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
