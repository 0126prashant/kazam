import { Request, Response } from 'express';
import Task from '../models/Task';

// Create Task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const query: any = { user: req.user._id };

    // Filter by status
    if (status && ['pending', 'completed'].includes(status as string)) {
      query.status = status;
    }

    // Search in title and description
    if (search) {
      query.$text = { $search: search as string };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Single Task
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  console.log('Updating task:', req.params.id);
  console.log('Update data:', req.body);
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      console.log('Task not found');
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    console.log('Task updated successfully:', task);
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
