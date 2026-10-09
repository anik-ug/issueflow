import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const populate = (query) => query.populate('assignee', 'name email').populate('createdBy', 'name email');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildIssueFilter = ({ search, status, priority }) => {
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }
  return filter;
};

export const listIssues = asyncHandler(async (req, res) => {
  const { search, status, priority, sort, order, page, limit } = req.query;
  const filter = buildIssueFilter({ search, status, priority });
  const [items, total] = await Promise.all([
    populate(Issue.find(filter).sort({ [sort]: order === 'asc' ? 1 : -1 }).skip((page - 1) * limit).limit(limit)),
    Issue.countDocuments(filter)
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const getIssue = asyncHandler(async (req, res) => {
  const issue = await populate(Issue.findById(req.params.id));
  if (!issue) throw new ApiError(404, 'Issue not found', 'ISSUE_NOT_FOUND');
  res.json({ issue });
});

export const createIssue = asyncHandler(async (req, res) => {
  if (req.body.assignee && !(await User.exists({ _id: req.body.assignee }))) throw new ApiError(400, 'Assignee not found', 'INVALID_ASSIGNEE');
  const issue = await Issue.create({ ...req.body, dueDate: req.body.dueDate || null, createdBy: req.user._id });
  res.status(201).json({ issue: await populate(Issue.findById(issue._id)) });
});

export const updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndUpdate(req.params.id, { ...req.body, dueDate: req.body.dueDate || null }, { new: true, runValidators: true });
  if (!issue) throw new ApiError(404, 'Issue not found', 'ISSUE_NOT_FOUND');
  res.json({ issue: await populate(Issue.findById(issue._id)) });
});

export const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);
  if (!issue) throw new ApiError(404, 'Issue not found', 'ISSUE_NOT_FOUND');
  res.status(204).send();
});

export const listUsers = asyncHandler(async (req, res) => {
  const search = String(req.query.search || '').trim();
  const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
  const users = await User.find(filter).select('name email').sort({ name: 1 }).limit(20);
  res.json({ users });
});
