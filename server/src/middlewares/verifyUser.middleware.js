import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

import dotenv from 'dotenv'

dotenv.config({ path: './.env'})

const verifyUser = async (req, res, next) => {
    
  const token =
    req.cookies?.auth || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(400, "Unauthorized access");
  }

  const isCorrectToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!isCorrectToken) {
    throw new ApiError(400, "Invalid token");
  }

  const user = await User.findOne({ _id: isCorrectToken._id });

  req.user = user;

  next();
};

export { verifyUser };
