import { verifyToken } from "../config/jwt.config";
import { Request, Response, NextFunction } from "express";


export interface AuthRequest extends Request{
    user?: {
        userId: string;
        role: string;
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader  = req.headers.authorization;

    if (authHeader){
        const token = authHeader.split(' ')[1];

        try {
            const decoded = verifyToken(token) as {userId: string, role: string};
            req.user = decoded;
            next();  
        }catch (error){
            return res.status(403).json({
                error: 'Invalid Token'
            });
        }
    }else{
        res.status(401).json({
            error: 'Authorization header is missing'
        })
    }
};