import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller.js';

export const dashboardRouter = Router();
dashboardRouter.get('/stats', getStats);
