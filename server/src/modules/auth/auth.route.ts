import { Router } from 'express';
import { authController } from './auth.controller';
import { upload } from '../../middleware/multer';


export const router = Router();

router.post('/signup', upload.single('image'), authController.createUserAccount);