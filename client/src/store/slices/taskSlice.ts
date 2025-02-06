import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { config } from '../../config/env';


export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Create axios instance with auth header
const createAxiosInstance = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('User token:', user?.token);
  return axios.create({
    baseURL: config.apiUrl,
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const api = createAxiosInstance();
  const response = await api.get('/tasks');
  return response.data;
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Omit<Task, '_id' | 'user' | 'createdAt' | 'updatedAt'>) => {
    const api = createAxiosInstance();
    const response = await api.post('/tasks', taskData);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }: { taskId: string; taskData: Partial<Task> }) => {
    console.log('Updating task:', taskId, taskData);
    const api = createAxiosInstance();
    try {
      const response = await api.patch(`/tasks/${taskId}`, taskData);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating task:', error.response?.data || error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    const api = createAxiosInstance();
    await api.delete(`/tasks/${taskId}`);
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create task';
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete task';
      });
  },
});

export const { clearError } = taskSlice.actions;
export default taskSlice.reducer;
