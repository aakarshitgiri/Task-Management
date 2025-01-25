import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Session from '../models/Session';
import { getSocketInstance } from '../socket/taskSocket';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, role } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role: role || "user",
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

        await new Session({ userId: user._id, status: "login" }).save();

        getSocketInstance().emit("user_session_update", { userId: user._id, status: "login" });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};

export const logoutUser = async (req: AuthRequest, res: Response): Promise<any> => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    await new Session({ userId: req.userId, status: "logout" }).save();
    getSocketInstance().emit("user_session_update", { userId: req.userId, status: "logout" });

    res.json({ message: "User logged out successfully" });
};

export const getLoggedInUser = async (req: AuthRequest, res: Response): Promise<any> => {
    if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");
    res.json(user || { message: "User not found" });
};