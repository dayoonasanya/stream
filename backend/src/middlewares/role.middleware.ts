import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const authorizeRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user){
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        if (!roles.includes(req.user.role)){
            return res.status(403).json({
                error: 'You do not have the required permissions'
            });
        }

        next();
    }
}