import { NextFunction, Request, Response } from 'express';
import CustomerError from '../models/error.types.ts';
import { dietaryRestrictionDTO, dietaryRestriction } from '../models/dietaryRestriction.types.ts';
import { dietaryRestrictionRepository } from '../database/repostitories.ts';
import { patientRestrictionRepository } from '../database/repostitories.ts';

export async function CreateDietaryRestriction(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description } = req.body as dietaryRestrictionDTO;
        if (!name || !description) {
            throw new CustomerError(400, 'All fields are required');
        }   
        const dietaryRestriction = await dietaryRestrictionRepository.save({ name, description });
        const returnedDietaryRestriction: dietaryRestriction = {
            id: dietaryRestriction.id,
            name: dietaryRestriction.name,
            description: dietaryRestriction.description
        }
        res.status(200).json(returnedDietaryRestriction);
    } catch (error) {
        next(error);
    }
}

export async function GetAllDietaryRestrictions(req: Request, res: Response, next: NextFunction) {
    try {
        const dietaryRestrictions = await dietaryRestrictionRepository.find();
        const returnedDietaryRestrictions: dietaryRestriction[] = [];
        dietaryRestrictions.forEach((restriction) => {
            returnedDietaryRestrictions.push({
                id: restriction.id,
                name: restriction.name,
                description: restriction.description
            });
        });
        res.status(200).json(returnedDietaryRestrictions);
    } catch (error) {
        next(error);
    }
}

export async function GetDietaryRestrictionById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const dietaryRestriction = await dietaryRestrictionRepository.findOne({ where: { id } });
        if (!dietaryRestriction) {
            throw new CustomerError(404, 'Dietary Restriction not found');
        }
        const returnedDietaryRestriction: dietaryRestriction = {
            id: dietaryRestriction.id,
            name: dietaryRestriction.name,
            description: dietaryRestriction.description
        }
        res.status(200).json(returnedDietaryRestriction);
    } catch (error) {
        next(error);
    }
}   

export async function UpdateDietaryRestriction(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const { name, description } = req.body as dietaryRestrictionDTO;
        const dietaryRestriction = await dietaryRestrictionRepository.findOne({ where: { id } });
        if (!dietaryRestriction) {
            throw new CustomerError(404, 'Dietary Restriction not found');
        }
        const updatedDietaryRestriction = await dietaryRestrictionRepository.update(id, { name, description });
        
        res.status(200).json({ message: 'Dietary Restriction updated successfully' });
    }
    catch (error) {
        next(error);
    }
}

export async function DeleteDietaryRestriction(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const dietaryRestriction = await dietaryRestrictionRepository.findOne({ where: { id } });
        if (!dietaryRestriction) {
            throw new CustomerError(404, 'Dietary Restriction not found');
        }
        await dietaryRestrictionRepository.delete(id);
        res.status(200).json({ message: 'Dietary Restriction deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export async function assignDietaryRestrictionToPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { patientId, dietaryRestrictionId } = req.body as { patientId: string, dietaryRestrictionId: string };
        const patientRestriction = await patientRestrictionRepository.save({ patientId, dietaryRestrictionId });
        res.status(200).json(patientRestriction);
    } catch (error) {
        next(error);
    }
}

export async function removeDietaryRestrictionFromPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { patientId, dietaryRestrictionId } = req.body as { patientId: string, dietaryRestrictionId: string };
        const patientRestriction = await patientRestrictionRepository.findOne({ where: { patientId, dietaryRestrictionId } });
        if (!patientRestriction) {
            throw new CustomerError(404, 'Patient Restriction not found');
        }
        await patientRestrictionRepository.delete({ patientId, dietaryRestrictionId });
        res.status(200).json({ message: 'Dietary Restriction removed from patient successfully' });
    } catch (error) {
        next(error);
    }
}

export async function getPatientDietaryRestrictions(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = req.params.id as string;
        const patientRestrictions = await patientRestrictionRepository.find({ where: { patientId }, relations: ['dietaryRestrictions'] });
        const returnedDietaryRestrictions: dietaryRestriction[] = [];
        patientRestrictions.forEach((restriction) => {
            const returnedDietaryRestriction: dietaryRestriction = {
                id: restriction.dietaryRestrictions.id,
                name: restriction.dietaryRestrictions.name,
                description: restriction.dietaryRestrictions.description
            }
            returnedDietaryRestrictions.push(returnedDietaryRestriction);
        });
        res.status(200).json(returnedDietaryRestrictions);
    } catch (error) {
        next(error);
    }
}