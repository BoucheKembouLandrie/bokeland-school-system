import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

import fs from 'fs';
import path from 'path';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const logPath = path.join(__dirname, '../../debug_log.txt');

    if (!token) {
        fs.appendFileSync(logPath, `[Auth] No token provided for ${req.path}\n`);
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        fs.appendFileSync(logPath, `[Auth] Token verified for user: ${JSON.stringify(decoded)}\n`);
        next();
    } catch (error: any) {
        fs.appendFileSync(logPath, `[Auth] Invalid token error: ${error.message} (Secret used: ${process.env.JWT_SECRET ? 'Env Var' : 'Fallback'})\n`);
        // Return 401 instead of 403 for invalid token to align with standard auth flow, 
        // though API interceptor handles both.
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};
