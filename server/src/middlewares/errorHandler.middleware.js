import { ApiError } from "../utils/ApiError.js";

export const errorHandler = async (error, req, res, next) => {
  if (error instanceof ApiError) {
    res
      .status(error.statusCode)
      .json({ success: false, error: error.message });
  } else {
    console.log("Error :: ", error)
    res
      .status(500)
      .json({ success: false, error: "something went wrong" });
  }
};
