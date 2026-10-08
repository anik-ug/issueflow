import { Issue } from '../models/Issue.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [total, byStatus, byPriority, overdue] = await Promise.all([
    Issue.countDocuments(),
    Issue.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Issue.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Issue.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: 'Done' } })
  ]);
  const mapCounts = (rows) => Object.fromEntries(rows.map((row) => [row._id, row.count]));
  res.json({ total, overdue, byStatus: mapCounts(byStatus), byPriority: mapCounts(byPriority) });
});
