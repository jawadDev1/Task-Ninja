import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import {
  createTask,
  deleteTask,
  getLastDateTasks,
  getRecentTasks,
  getSingleTask,
  getTasksStatus,
  toggleTaskCompleted,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyUser);

router.route("/status").get(getTasksStatus);
router.route("/create").post(createTask);
router.route("/recent").get(getRecentTasks);
router.route("/last-date").get(getLastDateTasks);

router.route("/update/:id").put(updateTask);
router.route("/delete/:id").delete(deleteTask);
router.route("/toggle/:id").put(toggleTaskCompleted);
router.route("/single-task/:id").get(getSingleTask);

export default router;
