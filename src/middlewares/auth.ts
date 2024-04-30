import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/custom-errors';
import ErrorMessages from '../errors/error-messages.enum';

const auth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jwtToken = req.cookies.jwt;

  if (!jwtToken) {
    return next(new NotAuthorizedError(ErrorMessages.NOT_AUTH));
  }
  let payload: any;
  try {
    payload = verify(jwtToken, process.env.JWT_SECRET_KEY as string);
    req.user = payload;
  } catch (err) {
    return next(new NotAuthorizedError(ErrorMessages.BAD_AUTH));
  }
  return next();
};

export default auth;
