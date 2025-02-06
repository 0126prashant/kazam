import { FormEvent, useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { createTask, updateTask, Task } from '../../store/slices/taskSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSuccess?: () => void;
}

const TaskForm = ({ task, onClose, onSuccess }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState(task?.status || 'pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const taskData = {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        status: status as 'pending' | 'completed',
      };

      if (task) {
        await dispatch(
          updateTask({ taskId: task._id, taskData })
        ).unwrap();
      } else {
        await dispatch(createTask(taskData)).unwrap();
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <Button
          onClick={onClose}
          className="!px-2 !py-1"
        >
          ✕
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Enter task description"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        {task && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
