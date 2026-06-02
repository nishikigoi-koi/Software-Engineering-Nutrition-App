import { NextFunction, Request, Response } from 'express';
import CustomerError from '../models/error.types.ts';
import { MedicalConditionDTO, MedicalCondition } from '../models/medicalCondition.types.ts';
import { medicalConditionRepository } from '../database/repostitories.ts';
import { patientConditionRepository } from '../database/repostitories.ts';

export async function CreatemedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description } = req.body as MedicalConditionDTO;
        if (!name || !description) {
            throw new CustomerError(400, 'All fields are required');
        }   
        const medicalCondition = await medicalConditionRepository.save({ name, description });
        const returnedmedicalCondition: MedicalCondition = {
            id: medicalCondition.id,
            name: medicalCondition.name,
            description: medicalCondition.description
        }
        res.status(200).json(returnedmedicalCondition);
    } catch (error) {
        next(error);
    }
}

export async function GetAllmedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
        const medicalConditions = await medicalConditionRepository.find();
        const returnedmedicalConditions: MedicalCondition[] = [];
        medicalConditions.forEach((Condition) => {
            returnedmedicalConditions.push({
                id: Condition.id,
                name: Condition.name,
                description: Condition.description
            });
        });
        res.status(200).json(returnedmedicalConditions);
    } catch (error) {
        next(error);
    }
}

export async function GetmedicalConditionById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const medicalCondition = await medicalConditionRepository.findOne({ where: { id } });
        if (!medicalCondition) {
            throw new CustomerError(404, 'medical Condition not found');
        }
        const returnedmedicalCondition: MedicalCondition = {
            id: medicalCondition.id,
            name: medicalCondition.name,
            description: medicalCondition.description
        }
        res.status(200).json(returnedmedicalCondition);
    } catch (error) {
        next(error);
    }
}   

export async function UpdatemedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const { name, description } = req.body as MedicalConditionDTO;
        const medicalCondition = await medicalConditionRepository.findOne({ where: { id } });
        if (!medicalCondition) {
            throw new CustomerError(404, 'medical Condition not found');
        }
        const updatedmedicalCondition = await medicalConditionRepository.update(id, { name, description });
        
        res.status(200).json({ message: 'medical Condition updated successfully' });
    }
    catch (error) {
        next(error);
    }
}

export async function DeletemedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const medicalCondition = await medicalConditionRepository.findOne({ where: { id } });
        if (!medicalCondition) {
            throw new CustomerError(404, 'medical Condition not found');
        }
        await medicalConditionRepository.delete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function assignmedicalConditionToPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { patientId, medicalConditionId } = req.body as { patientId: string, medicalConditionId: string };
        const patientCondition = await patientConditionRepository.save({ patientId, medicalConditionId });
        const returnedPatientCondition = {
            patientId: patientCondition.patientId,
            medicalConditionId: patientCondition.medicalConditionId
        }
        res.status(200).json(returnedPatientCondition);
    } catch (error) {
        next(error);
    }
}

export async function removemedicalConditionFromPatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { patientId, medicalConditionId } = req.body as { patientId: string, medicalConditionId: string };
        const patientCondition = await patientConditionRepository.findOne({ where: { patientId, medicalConditionId } });
        if (!patientCondition) {
            throw new CustomerError(404, 'Patient Condition not found');
        }
        await patientConditionRepository.delete({ patientId, medicalConditionId });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getPatientmedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = req.params.id as string;
        const patientConditions = await patientConditionRepository.find({ where: { patientId }, relations: ['medicalConditions'] });
        const returnedmedicalConditions: MedicalCondition[] = [];
        patientConditions.forEach((Condition) => {
            const returnedmedicalCondition: MedicalCondition = {
                id: Condition.medicalConditions.id,
                name: Condition.medicalConditions.name,
                description: Condition.medicalConditions.description
            }
            returnedmedicalConditions.push(returnedmedicalCondition);
        });
        res.status(200).json(returnedmedicalConditions);
    } catch (error) {
        next(error);
    }
}