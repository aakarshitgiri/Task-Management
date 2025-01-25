import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Session from "../models/Session";

// **Create a New User (Admin Only)**
export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ message: "Error creating user", error });
    }
};

// **Get All Users (With Filtering, Sorting, and Pagination)**
export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const { role, sortBy, order, page, limit } = req.query;

        const filter: any = {};
        if (role) filter.role = role;

        const sortOptions: any = {};
        if (sortBy) sortOptions[sortBy as string] = order === "desc" ? -1 : 1;

        const users = await User.find(filter)
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .select("-password"); // Exclude password field

        res.json(users);
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
};

// **Get a Specific User by ID**
export const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// **Update a User (Admin Only)**
export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, role } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};

// **Delete a User (Admin Only)**
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
};

// **Get a User's Session Logs (Admin Only)**
export const getUserSessions = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessions = await Session.find({ userId: req.params.id }).sort({ createdAt: -1 });

        res.json(sessions);
    } catch (error) {
        console.error("Get User Sessions Error:", error);
        res.status(500).json({ message: "Error fetching user sessions", error });
    }
};
