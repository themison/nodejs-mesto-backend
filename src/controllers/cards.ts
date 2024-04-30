import { NextFunction, Request, Response } from 'express';

import mongoose from 'mongoose';
import ErrorMessages from '../errors/error-messages.enum';
import Card from '../models/card';
import ServerResponseStatutesEnum from '../helpers/server-response-statuses.enum';
import { BadRequestError, NotAllowedError, NotFoundError } from '../errors/custom-errors';

export const getCard = (_req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    res.status(ServerResponseStatutesEnum.SUCCESS).send(cards);
  })
  .catch(next);

export const deleteCard = (_req: Request, res: Response, next: NextFunction) => {
  const { cardId } = _req.params;
  return Card.findById({ _id: cardId }).orFail()
    .then((card) => {
      const sameUser = card?.owner.toString() === _req.user?._id;

      if (sameUser) {
        return Card.findByIdAndDelete(cardId);
      }

      throw new NotAllowedError(ErrorMessages.NOT_ALLOWED_DEL_CARD);
    })
    .then((removableCard) => {
      res.status(ServerResponseStatutesEnum.SUCCESS).send(removableCard);
    })
    .catch((err) => (err instanceof mongoose.Error.DocumentNotFoundError
      ? next(new NotFoundError(ErrorMessages.NOT_FOUND)) : next(err)));
};

export const createCard = (_req: Request, res: Response, next: NextFunction) => {
  const { name, link } = _req.body;
  const { user } = _req;
  return Card.create({ name, link, owner: user?._id })
    .then((card) => res.status(ServerResponseStatutesEnum.POST_SUCCESS).send(card))
    .catch((err) => (err instanceof mongoose.Error.ValidationError
      ? next(new BadRequestError(ErrorMessages.WRONG_DATA))
      : next(err)));
};

export const likeCard = (_req: Request, res: Response, next: NextFunction) => {
  const { cardId } = _req.params;
  const { user } = _req;
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: user?._id } }).orFail()
    .then((card) => res.status(ServerResponseStatutesEnum.POST_SUCCESS).send(card))
    .catch((err) => (err instanceof mongoose.Error.DocumentNotFoundError
      ? next(new NotFoundError(ErrorMessages.NOT_FOUND)) : next(err)));
};

export const dislikeCard = (_req: Request, res: Response, next: NextFunction) => {
  const { cardId } = _req.params;
  const { user } = _req;
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: user?._id } }, { new: true }).orFail()
    .then((card) => res.status(ServerResponseStatutesEnum.POST_SUCCESS).send(card))
    .catch((err) => (err instanceof mongoose.Error.DocumentNotFoundError
      ? next(new NotFoundError(ErrorMessages.NOT_FOUND)) : next(err)));
};
