import { describe, expect, it } from 'vitest';
import { issueSchema } from '../src/schemas/issue.schemas.js';

const validIssue = {
  title: 'Fix login flow',
  description: 'Allow users to recover their account after a failed login.'
};

describe('issue request validation', () => {
  it('rejects titles longer than 120 characters', () => {
    const result = issueSchema.safeParse({ ...validIssue, title: 'a'.repeat(121) });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.title).toContain('Title must be 120 characters or fewer');
  });

  it('rejects descriptions longer than 2000 characters', () => {
    const result = issueSchema.safeParse({ ...validIssue, description: 'a'.repeat(2001) });

    expect(result.success).toBe(false);
    expect(result.error.flatten().fieldErrors.description).toContain('Description must be 2000 characters or fewer');
  });

  it('accepts an issue at the configured limits', () => {
    const result = issueSchema.safeParse({
      title: 'a'.repeat(120),
      description: 'a'.repeat(2000)
    });

    expect(result.success).toBe(true);
  });
});
