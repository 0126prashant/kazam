import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate: Date;
  user: mongoose.Types.ObjectId;
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a task description'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide a due date'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

// Index for better search performance
taskSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<ITask>('Task', taskSchema);
