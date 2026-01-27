import {Router} from 'express';
import { commentController } from './comment.controllers';

export const router = Router();

router.post('/')