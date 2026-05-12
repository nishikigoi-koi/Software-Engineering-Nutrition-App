import { NextFunction, Request, Response } from 'express';
import CustomerError from '../models/error.types.ts';

export function handlerError(err: CustomerError, req: Request, res: Response, next: NextFunction) {
    res.status(err.statusCode as number).json({ statusCode: err.statusCode, message: err.message });
}