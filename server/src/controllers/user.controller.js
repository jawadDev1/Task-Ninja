import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getToken } from "../utils/getToken.js";
import { sendMail } from "../utils/sendMail.js";
import { saveToken } from "../FirebaseServices.js";
import { Category } from "../models/category.model.js";

// Generate Random verification code
const generateCode = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 9);
  }

  return code;
};

//  Signup -> create a new account
const signup = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, pushNotificationToken } =
    req.body;

  if (
    [fullName, username, email, password, pushNotificationToken].some(
      (field) => field == "" || field == undefined
    )
  ) {
    throw new ApiError(400, `All fields are required`);
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(401, "User already exists");
  }

  // Current date
  const currentDate = new Date();
  // Code Expiry Date and time
  const expiryDate = new Date(currentDate.getTime() + 15 * 60 * 1000);

  const code = generateCode();

  let user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password: password.toString(),
    verified: false,
    verificationCode: code,
    verificationCodeExpiry: expiryDate,
  });

  await Category.create({
    name: "Tasks",
    createdBy: user._id,
  });
  // Save user pushNotification token in firebase for sending the notifications to user

  await saveToken(user._id, pushNotificationToken);

  // remove fields from user
  user = user.toObject();
  delete user.password;
  delete user.verificationCode;
  delete user.verificationCodeExpiry;

  await sendMail(email, code);

  res.status(200).json(new ApiResponse(true, "Verify your account", user));
});

// Signin
const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field == "" || field == undefined)) {
    throw new ApiError(400, "email and password are required");
  }

  let user = await User.findOne({ email }).select(
    "-verificationCode -verificationCodeExpiry"
  );

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isCorrectPassword = await user.isCorrectPassword(
    String(password),
    user.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(400, "Invalid credentials");
  }

  if (!user.verified) {
    let code = generateCode();
    let currentDate = new Date();
    let expiryDate = new Date(currentDate.getTime() + 15 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      verificationCode: code,
      verificationCodeExpiry: expiryDate,
    });

    await sendMail(user.email, code);

    return res
      .status(200)
      .json(new ApiResponse(true, "Verify your account", { user }));
  }

  const token = getToken(user._id);

  // remove fields from user
  user = user.toObject();
  delete user.password;

  // Cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("auth", token, options)
    .json(new ApiResponse(true, "LoggedIn successfully", { token, user }));
});

// Verify a user
const verifyUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { code } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const expiryTime = new Date(user.verificationCodeExpiry);
  const currentTime = new Date();

  if (currentTime > expiryTime) {
    throw new ApiError(400, "Verification code is expired");
  }

  if (code.toString() != user.verificationCode) {
    throw new ApiError(400, "Invalid code");
  }

  user.verified = true;
  await user.save();

  const token = getToken(user._id);

  // Cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("auth", token, options)
    .json(
      new ApiResponse(true, "Account verified successfully", { user, token })
    );
});

// Get current Logged User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(true, "Current user", { user }));
});

// Logout
const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("auth")
    .json(new ApiResponse(true, "Logged out successfully", {}));
});

export { signup, signin, verifyUserAccount, getCurrentUser, logout };
