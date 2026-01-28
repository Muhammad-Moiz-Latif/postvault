import { Router } from 'express';
import { authController } from './auth.controller';
import { upload } from '../../middleware/multer';
import passport from "passport";



export const router = Router();

router.post('/signup', upload.single('image'), authController.createUserAccount);

router.post('/verify/:tokenId', authController.verifyEmailOTP);

// Initiates Google OAuth flow
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false // We're using JWT, not sessions
    }));

// Google redirects here after authentication
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login?error=google_auth_failed"
    }),
    authController.googleAuthCallback);

router.post('/resend-email-token/:tokenId', authController.resendEmailToken);

router.post('/login', authController.loginUser);

router.get('/refresh', authController.verifyRefreshToken);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

router.get('/logout', authController.handleLogout);