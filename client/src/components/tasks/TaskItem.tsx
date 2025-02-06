import { useState } from 'react';
import { Task, deleteTask, updateTask } from '../../store/slices/taskSlice';
import { useAppDispatch } from '../../hooks/redux';
import Button from '../ui/Button';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTask(task._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      await dispatch(
        updateTask({
          taskId: task._id,
          taskData: {
            status: task.status === 'completed' ? 'pending' : 'completed',
            title: task.title,
            description: task.description,
            dueDate: task.dueDate
          }
        })
      ).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDueDateColor = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    if (task.status === 'completed') return 'text-green-600';
    if (dueDate < today) return 'text-red-600';
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dueDate <= tomorrow) return 'text-yellow-600';
    
    return 'text-gray-600';
  };

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onClose={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={handleStatusToggle}
              disabled={isUpdating}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <h3 className={`text-lg font-medium ${
              task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          </div>
          
          <p className="mt-1 text-gray-600 whitespace-pre-wrap">
            {task.description}
          </p>
          
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className={`${getDueDateColor()}`}>
              Due: {formatDate(task.dueDate)}
            </span>
            <span className="text-gray-500">
              Created: {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setIsEditing(true)}
            className="!px-3 !py-1"
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="!px-3 !py-1 bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
