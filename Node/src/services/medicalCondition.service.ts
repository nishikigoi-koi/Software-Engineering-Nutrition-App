import { NextFunction, Request, Response } from 'express';
import CustomerError from '../models/error.types.ts';
import { medicalConditionDTO, medicalCondition, patientCondition } from '../models/medicalCondition.types.ts';
import { medicalConditionRepository } from '../database/repostitories.ts';
import { patientConditionRepository } from '../database/repostitories.ts';
import { AssignMedicalConditionToPatientInDatabase, CreateMedicalConditionInDatabase, DeleteMedicalConditionInDatabase, GetAllMedicalConditionsFromDatabase, GetMedicalConditionByIdFromDatabase, GetPatientMedicalConditionsFromDatabase, RemoveMedicalConditionFromPatientInDatabase, UpdateMedicalConditionInDatabase } from '../helpers/medicalCondition.helper.ts';

export async function CreateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedMedicalCondition = await CreateMedicalConditionInDatabase(req.body as medicalConditionDTO,medicalConditionRepository);
        res.status(200).json(returnedMedicalCondition);
    } catch (error) {
        next(error);
    }
}

export async function GetAllMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedMedicalConditions = GetAllMedicalConditionsFromDatabase(medicalConditionRepository);
        res.status(200).json(returnedMedicalConditions);
    } catch (error) {
        next(error);
    }
}

export async function GetMedicalConditionById(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedMedicalCondition = GetMedicalConditionByIdFromDatabase(req.params.id as string, medicalConditionRepository);
        res.status(200).json(returnedMedicalCondition);
    } catch (error) {
        next(error);
    }
}   

export async function UpdateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
        await UpdateMedicalConditionInDatabase(req.params.id as string,  req.body as medicalConditionDTO , medicalConditionRepository);
        res.status(200).json({ message: 'Medical Condition updated successfully' });
    }
    catch (error) {
        next(error);
    }
}

export async function DeleteMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
        await DeleteMedicalConditionInDatabase(req.params.id as string, medicalConditionRepository);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function assignMedicalConditionToPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedPatientCondition = await AssignMedicalConditionToPatientInDatabase(req.body as patientCondition, patientConditionRepository)
        res.status(200).json(returnedPatientCondition);
    } catch (error) {
        next(error);
    }
}

export async function removeMedicalConditionFromPatient(req: Request, res: Response, next: NextFunction) {
    try {
        await RemoveMedicalConditionFromPatientInDatabase(req.body as patientCondition, patientConditionRepository)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getPatientMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
        const returnedMedicalConditions = await GetPatientMedicalConditionsFromDatabase(req.params.id as string, patientConditionRepository)
        res.status(200).json(returnedMedicalConditions);
    } catch (error) {
        next(error);
    }
}