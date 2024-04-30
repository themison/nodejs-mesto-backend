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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as customTypes from './custom-types';
import notFoundResource from './controllers/not-found';

dotenv.config();
const app = express();

const PORT = 3000;

const mongoDbUrl = 'mongodb://localhost:27017/mestodb';
mongoose.connect(mongoDbUrl);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use('/', loginRouter);
app.use(auth);
app.use('/', cardsRouter);
app.use('/', usersRouter);
app.all('/*', notFoundResource);
app.use(errors());
app.use(errorLogger);
app.use(errorMiddleware);

app
  .listen(PORT, () => {
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
