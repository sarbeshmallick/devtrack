import { Router } from 'express'; import * as c from '../controllers/comment.controller.js'; import { authenticate } from '../middlewares/auth.middleware.js';
export const commentRouter = Router(); commentRouter.use(authenticate); commentRouter.post('/tasks/:taskId/comments', c.createComment); commentRouter.delete('/comments/:commentId', c.deleteComment);
