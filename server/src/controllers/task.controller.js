import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import moment from "moment";
import cron from "node-cron";
import { Expo } from "expo-server-sdk";
import { getToken } from "../FirebaseServices.js";

const expo = new Expo();

// Schedual a notification with cron
const schedualNotification = (dueDateString, userId, task) => {
  const dueDate = moment(dueDateString);

  const cronExpression = `${dueDate.minutes()} ${dueDate.hours()} ${dueDate.date()} ${
    dueDate.month() + 1
  } *`;

  let job = cron.schedule(
    cronExpression,
    async () => {
      const { token } = await getToken(userId);

      await expo.sendPushNotificationsAsync([
        {
          to: token,
          title: "Due Date has reached",
          body: task,
        },
      ]);

      job.stop();
    },
    { scheduled: true }
  );
};

// Create a new task
const createTask = asyncHandler(async (req, res) => {
  const { task, details, priority, dueDate, category } = req.body;

  if (
    [task, details, priority, dueDate].some(
      (field) => field == "" || field == undefined
    )
  ) {
    throw new ApiError("All fields are required");
  }

  const newTask = await Task.create({
    task,
    details,
    category,
    dueDate,
    priority,
    createdBy: req.user?._id,
  });

  schedualNotification(dueDate, req.user?._id, task);

  res
    .status(200)
    .json(
      new ApiResponse(true, "Task created successsfully", { task: newTask })
    );
});

// Get a specific task
const getSingleTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({ _id: id });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json(new ApiResponse(true, "Task found", task));
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { task, details, priority, dueDate, category } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      task,
      details,
      priority,
      dueDate,
      category,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(true, "Task updated successfully", updatedTask));
});

// Delete a single task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTask = await Task.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(true, "Task deleted successfully", { deletedTask }));
});

// Mark a task Completed
const toggleTaskCompleted = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  if (task.isCompleted) {
    task.isCompleted = false;
  } else {
    task.isCompleted = true;
  }

  await task.save();

  res
    .status(200)
    .json(new ApiResponse(true, "Task Completed successfylly", { task }));
});

// Get 10 recent tasks
const getRecentTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    createdBy: req.user?._id,
    isCompleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json(new ApiResponse(true, "10 recent tasks", { tasks }));
});

// Get tasks which have Last Date today
const getLastDateTasks = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const tasks = await Task.find({
    dueDate: { $gt: startOfDay.toISOString(), $lt: endOfDay.toISOString() },
    isCompleted: false,
  });

  if (!tasks || tasks.length == 0) {
    return res
      .status(200)
      .json(new ApiResponse(true, "No tasks with today due date", { tasks }));
  }

  res
    .status(200)
    .json(new ApiResponse(true, "Today Due Date tasks", { tasks }));
});

// Get Tasks status Completed and pending tasks
const getTasksStatus = asyncHandler(async (req, res) => {
  const completedTasks = await Task.find({
    isCompleted: true,
    createdBy: req.user?._id,
  });

  const pendingTasks = await Task.find({
    isCompleted: false,
    createdBy: req.user?._id,
  });

  res.status(200).json(
    new ApiResponse(true, "Completed and pending tasks", {
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
    })
  );
});

export {
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
  getRecentTasks,
  getLastDateTasks,
  getTasksStatus,
};
