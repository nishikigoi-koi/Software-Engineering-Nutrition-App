import { NextFunction, Request, Response } from 'express';
import { PatientDTO, Patient } from '../models/patient.types.ts';
import { patientRepository } from '../database/repostitories.ts';
import { CreatePatientInDatabase, GetPatientByIdInDatabase, GetAllPatientsByUserIdInDatabase, UpdatePatientInDatabase, DeletePatientInDatabase } from '../helpers/patient.helper.ts';

export async function CreatePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const patientDTO = req.body as PatientDTO;
        const patient = await CreatePatientInDatabase(patientDTO, patientRepository);
        res.status(201).json(patient);
    } catch (error) {
        next(error);
    }
}

export async function GetAllPatients(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.params.id as string;
        const patients = await GetAllPatientsByUserIdInDatabase(userId, patientRepository);
        res.status(200).json(patients);
    } catch (error) {
        next(error);
    }
}

export async function GetPatientById(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = req.params.id as string;
        const patient = await GetPatientByIdInDatabase(patientId, patientRepository);
        res.status(200).json(patient);
    } catch (error) {
        next(error);
    }   
}

export async function UpdatePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const patientDTO = req.body as PatientDTO;
        await UpdatePatientInDatabase(patientId, patientDTO, patientRepository);
        res.status(200).json({ message: 'Patient updated successfully'});
    } catch (error) {
        next(error);
    }
}

export async function DeletePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        await DeletePatientInDatabase(patientId, patientRepository);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}