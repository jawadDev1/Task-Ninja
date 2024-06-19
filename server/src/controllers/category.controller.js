import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import { Task } from "../models/task.model.js";

// Get Categories
const getCategories  = asyncHandler( async(req, res) => {
  const categories = await Category.find({ createdBy: req.user?._id});

 res.status(200).json(new ApiResponse(true, "All categories", { categories }))

})

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Name field is required");
  }

  const categoryExist = await Category.findOne({ name})

  if(categoryExist){
    throw new ApiError(400, "Category already exists")
  }

  const category = await Category.create({
    name,
    createdBy: req.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(true, "Category created successfully", {category}));
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  await Task.deleteMany({ category: category.name });

  res
    .status(200)
    .json(new ApiResponse(true, "Category deleted Successfully", category));
});

// Update a Category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(id, { name }, { new: true});

  res
    .status(200)
    .json(new ApiResponse(true, "Category updated successfully", category));
});

export { createCategory, updateCategory, deleteCategory, getCategories };
