import { Request, Response, NextFunction } from 'express';


export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number){
        super(message)
        this.statusCode = statusCode;
        this.isOperational = true;


        Error.captureStackTrace(this, this.constructor);
    }
}


export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    });
};