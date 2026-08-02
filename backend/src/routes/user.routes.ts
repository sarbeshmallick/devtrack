import { Router } from 'express'; import { updateProfile } from '../controllers/user.controller.js'; import { authenticate } from '../middlewares/auth.middleware.js';
export const userRouter = Router(); userRouter.patch('/me', authenticate, updateProfile);
