import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo', index: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  dueDate: { type: Date, default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

issueSchema.index({ createdAt: -1 });

export const Issue = mongoose.model('Issue', issueSchema);
