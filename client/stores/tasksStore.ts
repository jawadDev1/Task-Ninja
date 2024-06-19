import {
  makeHTTPRequest,
  makeHTTPRequestWithBody,
} from "@/utils/makeHTTPRequest";
import { create } from "zustand";

const API_TASK_URL = `${process.env.EXPO_PUBLIC_API_URL}/task`;

interface Task {
  task: string;
  details: string;
  dueDate: string;
  category: string;
  priority: string;
}

interface TasksState {
  tasks: [{}] | any;
  success: string;
  error: string;
  pending: boolean;
  completedTasks: number;
  pendingTasks: number;
  createTask: (values: Task) => void;
  getSingleTask: (taskId: string) => void;
  updateTask: (taskId: string, values: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
  getRecentTasks: () => void;
  getLastDateTasks: () => void;
  getTasksStatus: () => void;
  clearTasks: () => void;
}

const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  success: "",
  error: "",
  pending: false,
  completedTasks: 0,
  pendingTasks: 0,
  createTask: async (values) => {
    set({ pending: true, success: "" });
    const data = await makeHTTPRequestWithBody(
      `${API_TASK_URL}/create`,
      "POST",
      values
    ).finally(() => {
      set({ pending: false });
    });

    if (!data?.success) {
      set({ error: data?.error });
      return `${data?.error}`;
    }

    set((state) => ({
      tasks: [data.data?.task, ...state.tasks],
      pending: false,
      success: data?.message,
      error: "",
    }));

    return `${data.data.message}`;
  },
  getSingleTask: async (taskId) => {},
  updateTask: async (taskId, values) => {},
  deleteTask: async (taskId) => {
    const data = await makeHTTPRequest(
      `${API_TASK_URL}/delete/${taskId}`,
      "DELETE"
    );

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set((state) => ({
      tasks: state.tasks.filter((task: any) => task._id !== taskId),
      success: data?.message,
      error: "",
    }));
  },
  toggleTaskCompleted: async (taskId) => {
    const data = await makeHTTPRequest(
      `${API_TASK_URL}/toggle/${taskId}`,
      "PUT"
    );

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set((state) => ({
      tasks: state.tasks.filter((task: any) => task._id !== taskId),
      pending: false,
      error: "",
      success: data?.message,
    }));
  },
  getRecentTasks: async () => {
    const data = await makeHTTPRequest(`${API_TASK_URL}/recent`, "GET");

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set((state) => ({
      tasks: [...data.data?.tasks],
      pending: false,
      error: "",
    }));
  },
  getLastDateTasks: async () => {
    const data = await makeHTTPRequest(`${API_TASK_URL}/last-date`, "GET");

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set((state) => ({
      tasks: [...data.data?.tasks],
      pending: false,
      error: "",
    }));
  },
  getTasksStatus: async () => {
    const data = await makeHTTPRequest(`${API_TASK_URL}/status`, "GET");

    if (!data?.success) {
      set({ error: data?.error });
      return;
    }

    set({
      completedTasks: data?.data?.completedTasks,
      pendingTasks: data?.data?.pendingTasks,
      pending: false,
      error: "",
      success: data?.message,
    });
  },

  clearTasks: () => {
    set({
      tasks: [],
      success: "",
      error: "",
      pending: false,
      completedTasks: 0,
      pendingTasks: 0,
    });
  },
}));

export default useTasksStore;
