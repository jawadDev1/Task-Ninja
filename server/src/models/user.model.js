import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "full name is required"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiry: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isCorrectPassword = async function (
  password,
  hashedPassword
) {
  return await bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model("User", userSchema);

export  {User};
