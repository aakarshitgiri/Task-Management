import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserSessions } from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";
import { checkAdmin } from "../middlewares/checkAdmin";


const router = express.Router();

// Public Routes
// Create a new user (Admin only)
router.post("/", authenticate, checkAdmin, createUser);

// Admin Routes (require Admin role)
// Get all users (with filtering, sorting, pagination)
router.get("/", authenticate, checkAdmin, getAllUsers);

// Get a specific user by ID (Admin only)
router.get("/:id", authenticate, checkAdmin, getUserById);

// Update a user's information (Admin only)
router.put("/:id", authenticate, checkAdmin, updateUser);

// Delete a user (Admin only)
router.delete("/:id", authenticate, checkAdmin, deleteUser);

// Get a user's session logs (Admin only)
router.get("/:id/sessions", authenticate, checkAdmin, getUserSessions);

export default router;
