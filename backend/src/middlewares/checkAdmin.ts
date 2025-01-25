import { Request, Response, NextFunction } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

// Middleware to check if the user is an admin
export const checkAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized: No User ID found" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }

        next(); // User is an admin, proceed to the next middleware or route
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
