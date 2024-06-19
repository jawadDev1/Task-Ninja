import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.use(verifyUser);

router.route("/get").get(getCategories);
router.route("/create").post(createCategory);
router.route("/delete/:id").delete(deleteCategory);
router.route("/update/:id").put(updateCategory);

export default router;
