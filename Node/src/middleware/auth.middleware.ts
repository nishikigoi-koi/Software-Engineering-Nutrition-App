import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import CustomerError from '../models/error.types.ts';
import { customFoodRepository, foodLogRepository, patientRepository } from '../database/repostitories.ts';
import { GetCustomFoodByIdFromDatabase } from '../helpers/customFood.helper.ts';
import { GetFoodLogByIdFromDatabase } from '../helpers/foodLog.helper.ts';

const JWT_SECRET = process.env.JWT_SECRET as string;


export interface JwtPayload {
    userId: string;
    username: string;
    iat?: number;
    exp?: number;
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing authorization token' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
            (req as any).user = payload;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        next(error);
    }
}

// Middleware to ensure the authenticated user is the owner of the user record being accessed or modified
export function authUser(req: Request, res: Response, next: NextFunction) {
    try{
        const authUser = (req as any).user as JwtPayload;
        if (authUser.userId !== req.params.id) {
            throw new CustomerError(403, 'Forbidden');
        }
        next();
    } catch(error){
        next(error)
    }
}


// Middleware to ensure the authenticated user is the owner of the patient record being created
export function authUserInBody(req: Request, res: Response, next: NextFunction) {
    try{
        const authUser = (req as any).user as JwtPayload;
        if (authUser.userId !== req.body.userId) {
            throw new CustomerError(403, 'Forbidden');
        }
        next();
    } catch(error){
        next(error)
    }
}

// Middleware to ensure the authenticated user is the owner of the patient record being accessed or modified
export async function authPatientIdInParams(req: Request, res: Response, next: NextFunction) {
    try {
        const authUser = (req as any).user as JwtPayload;
        const patientId = req.params.id as string;
        const patient = await patientRepository.findOne({ where: { id: patientId }})
        if (!patient) {
            throw new CustomerError(404, 'Patient not found');
        }
        if (patient.userId !== authUser.userId) {
            throw new CustomerError(403, 'Forbidden');
        }
        next();
    } catch (error) {
        next(error);
    }
}

export async function authPatientIdInBody(req: Request, res: Response, next: NextFunction) {
    try {
        const authUser = (req as any).user as JwtPayload;
        const patientId = req.body.patientId as string;
        const patient = await patientRepository.findOne({ where: { id: patientId }});
        if (!patient) {
            throw new CustomerError(404, 'Patient not found');
        }
        if (patient.userId !== authUser.userId) {
            throw new CustomerError(403, 'Forbidden');
        }
        next();
    } catch (error) {
        next(error);
    }
}

export async function authCustomFoodIdInParams(req: Request, res: Response, next: NextFunction) {
    try {
        const authUser = (req as any).user as JwtPayload;
        const customFoodId = req.params.id as string;
        const customFood = await GetCustomFoodByIdFromDatabase(customFoodId,customFoodRepository)
        if (customFood.userId !== authUser.userId) {
            throw new CustomerError(403, 'Forbidden');
        }
        next();
    } catch (error) {
        next(error);
    }
}
