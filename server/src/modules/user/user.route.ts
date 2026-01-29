import { Router } from 'express';
import { userController } from './user.controller';
import { verifyJWT } from '../../middleware/verifyJWT';

export const router = Router();


router.get('/profile/:userId', verifyJWT, userController.getUserProfile);

router.get('/posts', verifyJWT, userController.getUserPosts);

