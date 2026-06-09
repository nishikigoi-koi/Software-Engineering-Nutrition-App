import { NextFunction, Request, Response } from 'express';
import CustomerError from '../models/error.types.ts';
import { dietaryRestrictionDTO, dietaryRestriction, patientRestriction } from '../models/dietaryRestriction.types.ts';
import { dietaryRestrictionRepository } from '../database/repostitories.ts';
import { patientRestrictionRepository } from '../database/repostitories.ts';
import { AssignDietaryRestrictionToPatientInDatabase, CreateDietaryRestrictionInDatabase, DeleteDietaryRestrictionInDatabase, GetAllDietaryRestrictionsFromDatabase, GetDietaryRestrictionByIdFromDatabase, GetPatientDietaryRestrictionsFromDatabase, RemoveDietaryRestrictionFromPatientInDatabase, UpdateDietaryRestrictionInDatabase } from '../helpers/dietaryRestriction.helper.ts';

export async function CreateDietaryRestriction(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedDietaryRestriction = await CreateDietaryRestrictionInDatabase(req.body as dietaryRestrictionDTO,dietaryRestrictionRepository);
        res.status(200).json(returnedDietaryRestriction);
    } catch (error) {
        next(error);
    }
}

export async function GetAllDietaryRestrictions(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedDietaryRestrictions = await GetAllDietaryRestrictionsFromDatabase(dietaryRestrictionRepository);
        res.status(200).json(returnedDietaryRestrictions);
    } catch (error) {
        next(error);
    }
}

export async function GetDietaryRestrictionById(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedDietaryRestriction = await GetDietaryRestrictionByIdFromDatabase(req.params.id as string, dietaryRestrictionRepository);
        res.status(200).json(returnedDietaryRestriction);
    } catch (error) {
        next(error);
    }
}   

export async function UpdateDietaryRestriction(req: Request, res: Response, next: NextFunction) {
    try {
        await UpdateDietaryRestrictionInDatabase(req.params.id as string,  req.body as dietaryRestrictionDTO , dietaryRestrictionRepository);
        res.status(200).json({ message: 'Dietary Restriction updated successfully' });
    }
    catch (error) {
        next(error);
    }
}

export async function DeleteDietaryRestriction(req: Request, res: Response, next: NextFunction) {
    try {
        await DeleteDietaryRestrictionInDatabase(req.params.id as string, dietaryRestrictionRepository);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function assignDietaryRestrictionToPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedPatientRestriction = await AssignDietaryRestrictionToPatientInDatabase(req.body as patientRestriction, patientRestrictionRepository)
        res.status(200).json(returnedPatientRestriction);
    } catch (error) {
        next(error);
    }
}

export async function removeDietaryRestrictionFromPatient(req: Request, res: Response, next: NextFunction) {
    try {
        await RemoveDietaryRestrictionFromPatientInDatabase(req.body as patientRestriction, patientRestrictionRepository)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getPatientDietaryRestrictions(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedDietaryRestrictions = await GetPatientDietaryRestrictionsFromDatabase(req.params.id as string, patientRestrictionRepository)
        res.status(200).json(returnedDietaryRestrictions);
    } catch (error) {
        next(error);
    }
}