import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import ErrorMessages from '../errors/error-messages.enum';
import User from '../models/user';
import ServerResponseStatutesEnum from '../helpers/server-response-statuses.enum';
import UniqueDataError, { BadRequestError, NotAuthorizedError, NotFoundError } from '../errors/custom-errors';

export const getUsers = (_req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(ServerResponseStatutesEnum.SUCCESS).send(users))
  .catch(() => next());

export const getMe = (_req: Request, res: Response, next: NextFunction) => {
  const { user } = _req;

  User.findById(user?._id).orFail()
    .then((u) => res.status(ServerResponseStatutesEnum.SUCCESS).send(u))
    .catch((err) => (err instanceof mongoose.Error.DocumentNotFoundError
      ? next(new NotFoundError(ErrorMessages.NOT_FOUND))
      : next(err)));
};

export const getSingleUser = (_req: Request, res: Response, next: NextFunction) => {
  const { userId } = _req.params;
  return User.find({ _id: userId }).orFail()
    .then((u) => res.status(ServerResponseStatutesEnum.SUCCESS).send(u))
    .catch((err) => (err instanceof mongoose.Error.DocumentNotFoundError
      ? next(new NotFoundError(ErrorMessages.NOT_FOUND))
      : next(err)));
};

export const createUser = (_req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = _req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, password: hash, email,
    }))
    .then((u) => res.status(ServerResponseStatutesEnum.SUCCESS).send({
      name: u.name,
      about: u.about,
      avatar: u.avatar,
      email: u.email,
      _id: u._id,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(ErrorMessages.WRONG_DATA));
      }

      if (err.code === 11000) {
        return next(new UniqueDataError(ErrorMessages.EMAIL_EXIST));
      }
      next(err);
    });
};

export const updateProfile = (_req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = _req.body;
  const { user } = _req;
  return User.findByIdAndUpdate(user?._id, { name, about, avatar }).orFail()
    .then((u) => res.status(ServerResponseStatutesEnum.POST_SUCCESS).send(u))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(ErrorMessages.WRONG_DATA));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(ErrorMessages.NOT_FOUND));
      }
      next(err);
    });
};

export const updateAvatar = (_req: Request, res: Response, next: NextFunction) => {
  const { avatar } = _req.body;
  const { user } = _req;
  return User.findByIdAndUpdate(user?._id, { avatar }).orFail()
    .then((u) => res.status(ServerResponseStatutesEnum.POST_SUCCESS).send(u))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(ErrorMessages.WRONG_DATA));
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError(ErrorMessages.NOT_FOUND));
      }
      next(err);
    });
};

export const login = (_req: Request, res: Response, next: NextFunction) => {
  const { email, password } = _req.body;
  return User
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthorizedError(ErrorMessages.NOT_AUTH);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new NotAuthorizedError(ErrorMessages.BAD_AUTH);
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY ?? '312312312', {
          expiresIn: '1d',
        });
        return res
          .cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3600000 * 24,
            sameSite: true,
          })
          .send({ token });
      });
    })
    .catch(next);
};
