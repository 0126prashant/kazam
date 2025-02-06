import express from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('pending', 'completed'),
});

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .post(validateRequest(taskSchema), createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTask)
  .put(validateRequest(taskSchema), updateTask)
  .patch(validateRequest(taskSchema), updateTask)
  .delete(deleteTask);

export default router;
