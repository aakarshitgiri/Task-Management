import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
    userId?: string;
    role?: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied: No Token Provided" });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as AuthRequest).userId = decoded.userId;

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        (req as AuthRequest).role = user.role;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token", error });
    }
};