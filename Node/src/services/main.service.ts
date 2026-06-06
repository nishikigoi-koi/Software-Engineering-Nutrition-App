import { NextFunction, Request, Response } from 'express';

export function sayHello(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({ message: 'Hello from the main service!' });
}
