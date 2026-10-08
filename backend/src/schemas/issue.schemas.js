import { z } from 'zod';

const optionalId = z.string().regex(/^[a-f\d]{24}$/i).nullable().optional();
export const issueSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
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
