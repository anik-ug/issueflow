import { Router } from 'express';
import { createIssue, deleteIssue, getIssue, listIssues, updateIssue } from '../controllers/issue.controller.js';
import { validate } from '../middleware/validate.js';
import { issueQuerySchema, issueSchema } from '../schemas/issue.schemas.js';

export const issueRouter = Router();
issueRouter.get('/', validate(issueQuerySchema, 'query'), listIssues);
issueRouter.post('/', validate(issueSchema), createIssue);
issueRouter.get('/:id', getIssue);
issueRouter.patch('/:id', validate(issueSchema.partial()), updateIssue);
issueRouter.delete('/:id', deleteIssue);
