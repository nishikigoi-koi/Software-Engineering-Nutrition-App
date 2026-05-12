import { NextFunction, Request, Response } from 'express';
import CustomerError from '../models/error.types.ts';

export function handlerError(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof CustomerError) {
        res.status(error.statusCode).json({ statusCode: error.statusCode, message: error.message });
    } else {
        res.status(500).json({ statusCode: 500, message: error.message || 'Internal Server Error' });
    }
}