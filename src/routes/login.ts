import { Router } from 'express';
import {
  createUser, login,
} from '../controllers/users';
import { signInValidation, signUpValidation } from '../validation/validation';

const router = Router();
router.post('/signin', signInValidation, login);
router.post('/signup', signUpValidation, createUser);

export default router;
