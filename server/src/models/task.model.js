import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, "title is required"],
    },
    details: {
      type: String,
      required: [true, "description is required"],
    },
    priority: {
      type: String,
      required: false,
      default: "low",
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    dueDate: {
      type: Date,
      required: [true, "due date is required"],
    },
    category: {
      type: String,
      required: false,
      default: "Tasks",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "task author is required"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);


export  {Task};
