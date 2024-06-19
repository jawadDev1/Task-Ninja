import { Router } from "express";
import {
  getCurrentUser,
  logout,
  signin,
  signup,
  verifyUserAccount,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/verifyUser.middleware.js";

const router = Router();

router.route("/signup").post(signup);

router.route("/signin").post(signin);

router.route("/verify/:id").post(verifyUserAccount);

router.route("/current").get(verifyUser, getCurrentUser);

router.route("/logout").get(logout);

export default router;
