import { Router } from 'express';
import { verifyJWT } from '../../middleware/verifyJWT';
import { postController } from './post.controllers';
import { upload } from '../../middleware/multer';
import { verify } from 'crypto';


export const router = Router();

router.get('/all-posts', postController.getAllPosts);

router.get('/:postId', verifyJWT, postController.getDetailedPost);

router.post('/create', verifyJWT, upload.single("image"), postController.createPost);

router.put('/edit/:postId', verifyJWT, upload.single("image"), postController.editPost);

router.delete('/delete/:postId', verifyJWT, postController.deletePost);

router.post('/like/:postId', verifyJWT, postController.likePost);

router.post('/comment/:postId', verifyJWT, postController.commentOnPost);

router.post('/reply/:parentId/:postId', verifyJWT, postController.replyToAComment);

router.put('/edit/:commentId/:postId', verifyJWT, postController.editComment);

router.delete('/delete/:commentId/:postId', verifyJWT, postController.deleteComment);

router.post('/like-comment/:commentId', verifyJWT, postController.likeComment);



