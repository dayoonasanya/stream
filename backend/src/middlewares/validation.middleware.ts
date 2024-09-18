import { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";


export const validate  = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction)=>{
        const { error }= schema.validate(req.body, {abortEarly: false});


        if (error){
            const errors = error.details.map((details) => details.message);
            return res.status(400).json({
                errors
            })
        }

        next();
    };
};