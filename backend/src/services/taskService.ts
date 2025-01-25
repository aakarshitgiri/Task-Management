import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response } from "express";

// Secret key for JWT (ensure to keep this safe in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Register new user
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateJWT(user._id as string, user.role);

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Generate JWT token
export const generateJWT = (userId: string, role: string) => {
    return jwt.sign(
        { userId, role },
        JWT_SECRET,
        { expiresIn: "1d" } // Token expires in 1 day
    );
};

// Verify JWT token (to be used in middleware)
export const verifyJWT = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};

// Get user from JWT token (use this in authenticate middleware)
export const getUserFromToken = async (token: string) => {
    const decoded = verifyJWT(token);
    const user = await User.findById((decoded as jwt.JwtPayload).userId);
    return user;
};
