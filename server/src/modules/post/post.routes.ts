import { Router } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import { postController } from './post.controllers';
import { upload } from '../../middleware/multer';


export const router = Router();

router.get('/all-posts', postController.getAllPosts);

router.post('/create', verifyJWT, upload.single("image"), postController.createPost);

router.post('/comment/:postId', verifyJWT, postController.commentOnPost);

router.put('/edit/:postId', verifyJWT, upload.single("image"), postController.editPost);

router.put('/edit/:commentId/:postId', verifyJWT, postController.editComment);

router.delete('/delete/:commentId/:postId', verifyJWT, postController.deleteComment);

router.delete('/delete/:postId', verifyJWT, postController.deletePost);