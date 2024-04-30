import { Router } from 'express';
import {
  createCard, deleteCard, dislikeCard, getCard, likeCard,
} from '../controllers/cards';
import { createCardValidation, deleteCardValidation, likeCardValidation } from '../validation/validation';

const router = Router();
router.get('/cards', getCard);
router.delete('/cards/:cardId', deleteCardValidation, deleteCard);
router.post('/cards', createCardValidation, createCard);
router.put('/cards/:cardId/likes', likeCardValidation, likeCard);
router.delete('/cards/:cardId/likes', likeCardValidation, dislikeCard);

export default router;
