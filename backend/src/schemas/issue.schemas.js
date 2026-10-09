import { z } from 'zod';

const optionalId = z.string().regex(/^[a-f\d]{24}$/i).nullable().optional();
export const issueSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).trim().min(1, 'Title is required').max(120, 'Title must be 120 characters or fewer'),
  description: z.string().trim().min(1).max(2000, 'Description must be 2000 characters or fewer'),
  status: z.enum(['Todo', 'In Progress', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  assignee: optionalId,
  dueDate: z.string().datetime({ offset: true }).nullable().optional()
});
export const issueQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(['Todo', 'In Progress', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'dueDate', 'title', 'priority', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});
