import { Router } from 'express';
import { userController } from './user.controller';
import { verifyJWT } from '../../middleware/verifyJWT';

export const router = Router();


router.get('/profile/:userId', verifyJWT, userController.getUserProfile);

router.get('/posts', verifyJWT, userController.getUserPosts);

router.get('/saved-posts', verifyJWT, userController.getSavedPosts);

router.get('/followers', verifyJWT, userController.getFollowers);

router.get('/following', verifyJWT, userController.MyFollowings);

router.post('/follow', verifyJWT, userController.FollowUser);

