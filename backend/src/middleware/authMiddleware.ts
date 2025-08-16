import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ error: 'Access denied. No token provided.' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { address: string };
        const user = await User.findOne({ address: decoded.address });

        if (!user) {
            res.status(401).json({ error: 'Access denied. User not found.' });
            return;
        }

        // Update last active
        user.lastActive = new Date();
        await user.save();

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

export const optionalAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { address: string };
            const user = await User.findOne({ address: decoded.address });

            if (user) {
                user.lastActive = new Date();
                await user.save();
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without auth for optional auth
        next();
    }
};