import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bokeland-affiliate-secret';

export const verifyAffiliate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'affiliate') {
            return res.status(403).json({ error: 'Accès non autorisé.' });
        }

        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide ou expiré.' });
    }
};
