import { Request, Response, NextFunction } from 'express';
import ServerResponseStatutesEnum from '../helpers/server-response-statuses.enum';
import ErrorMessages from '../errors/error-messages.enum';

interface Err extends Error {
  statusCode: number;
}

const errorMiddleware = (
  err: Err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = ServerResponseStatutesEnum.SERVER_ERROR } = err;
  const message = statusCode === ServerResponseStatutesEnum.SERVER_ERROR ? `${ErrorMessages.SERVER_ERROR}` : err.message;
  res.status(statusCode).send({
    message,
  });
  next();
};

export default errorMiddleware;
