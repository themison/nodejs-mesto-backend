import { Router } from 'express';
import {
  getUsers, getSingleUser, updateAvatar, updateProfile, getMe,
} from '../controllers/users';
import { getUserValidation, updateAvatarValidation, updateUserValidation } from '../validation/validation';

const router = Router();
router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:userId', getUserValidation, getSingleUser);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);
router.patch('/users/me', updateUserValidation, updateProfile);

export default router;
