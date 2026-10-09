import { describe, expect, it } from 'vitest';
import { buildIssueFilter } from '../src/controllers/issue.controller.js';

describe('issue search filter', () => {
  it('matches partial words in titles and descriptions', () => {
    const { $or } = buildIssueFilter({ search: 'auth' });

    expect($or[0].title.test('Update authentication flow')).toBe(true);
    expect($or[1].description.test('Fix authorization errors')).toBe(true);
    expect($or[0].title.test('Database migration')).toBe(false);
  });

  it('matches without regard to case', () => {
    const { $or } = buildIssueFilter({ search: 'PAYMENTS' });

    expect($or[0].title.test('Fix payments retry logic')).toBe(true);
    expect($or[1].description.test('Payments fail for some users')).toBe(true);
  });

  it('treats regex special characters as literal search terms', () => {
    const { $or } = buildIssueFilter({ search: '.*' });

    expect($or[0].title.test('Support .* wildcard input')).toBe(true);
    expect($or[0].title.test('Support wildcard input')).toBe(false);
  });

  it('combines search with status and priority filters', () => {
    const filter = buildIssueFilter({
      search: 'bug',
      status: 'Todo',
      priority: 'High'
    });

    expect(filter.status).toBe('Todo');
    expect(filter.priority).toBe('High');
    expect(filter.$or).toHaveLength(2);
  });
});
