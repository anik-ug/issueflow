import { Router } from 'express';
import { listUsers } from '../controllers/issue.controller.js';

export const userRouter = Router();
userRouter.get('/', listUsers);
