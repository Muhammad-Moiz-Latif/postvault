import { Router } from 'express';
import { authController } from './auth.controller';
import { upload } from '../../middleware/multer';


export const router = Router();

router.post('/signup', upload.single('image'), authController.createUserAccount);

router.post('/verify/:tokenId', authController.verifyEmailOTP);

router.post('/resend-email-token/:tokenId', authController.resendEmailToken);

router.post('/login', authController.loginUser);

router.get('/refresh', authController.verifyRefreshToken);

router.get('/logout', authController.handleLogout);