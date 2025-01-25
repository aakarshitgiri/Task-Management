import express from "express";
import { } from "../controllers/taskController";

import { createTask, deleteTask, getTaskById, getUserTasks, updateTask, getTasks } from "../controllers/taskController";
import { authenticate } from "../middlewares/authenticate";
import { checkAdmin } from "../middlewares/checkAdmin";

const router = express.Router();


// Create a new task
router.post("/", authenticate, createTask);

// Fetch all tasks (for logged-in user)
router.get("/", authenticate, getUserTasks);

// Admin Routes (require Admin role)
// Fetch all tasks for admin with sorting and filtering options
router.get("/admin", authenticate, checkAdmin, getTasks);

// Fetch tasks by user (for admin to get all user tasks)
router.get("/user/:userId", authenticate, checkAdmin, getUserTasks);

// Fetch a task by ID (for admin)
router.get("/:id", authenticate, getTaskById);

// Update a task (for user or admin)
router.put("/:id", authenticate, updateTask);

// Delete a task (for user or admin)
router.delete("/:id", authenticate, deleteTask);

export default router;
