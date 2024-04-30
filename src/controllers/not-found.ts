import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/custom-errors';

const notFoundResource = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемого ресурса не существет'));
};

export default notFoundResource;
