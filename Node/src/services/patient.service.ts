import { NextFunction, Request, Response } from 'express';
import { PatientDTO, Patient } from '../models/patient.types.ts';
import CustomerError from '../models/error.types.ts';
import { patientRepository } from '../database/repostitories.ts';

export async function CreatePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, firstName, lastName, birthDate, gender, ethnicity, weight, height, activityLevel } = req.body as PatientDTO;
        if (!firstName || !lastName || !birthDate || !gender || !ethnicity || !weight || !height || !activityLevel || !userId) {
            throw new CustomerError(400, 'All fields and userId are required');
        }
        const patient = await patientRepository.save({ firstName, lastName, birthDate, gender, ethnicity, weight, height, activityLevel, user: { id: userId } });
        const retunedPatient: Patient = {
            id: patient.id,
            userId: patient.user.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            birthDate: patient.birthDate,
            gender: patient.gender,
            ethnicity: patient.ethnicity,
            weight: patient.weight,
            height: patient.height,
            activityLevel: patient.activityLevel
        }

        res.status(200).json(retunedPatient);
    } catch (error) {
        next(error);
    }
}

export async function GetAllPatients(req: Request, res: Response, next: NextFunction) {
    console.log('GetAllPatients called with userId:', req.params.id);
    try {
        const userId = req.params.id as string;
        const patients = await patientRepository.find({ where: { user: { id: userId } }, relations: ['user'] });
        const returnedPatients: Patient[] = [];
        patients.forEach(patient => {
            const retunedPatient: Patient = {
                id: patient.id,
                userId: patient.user.id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                birthDate: patient.birthDate,
                gender: patient.gender,
                ethnicity: patient.ethnicity,
                weight: patient.weight,
                height: patient.height,
                activityLevel: patient.activityLevel
            }
            returnedPatients.push(retunedPatient);
        });
        res.status(200).json(returnedPatients);
    } catch (error) {
        next(error);
    }
}

export async function GetPatientById(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const patient = await patientRepository.findOne({ where: { id: patientId }, relations: ['user'] });
        if (!patient) {
            throw new CustomerError(404, 'Patient not found');
        }
        const retunedPatient: Patient = {
            id: patient.id,
            userId: patient.user.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            birthDate: patient.birthDate,
            gender: patient.gender,
            ethnicity: patient.ethnicity,
            weight: patient.weight,
            height: patient.height,
            activityLevel: patient.activityLevel
        }
        res.status(200).json(retunedPatient);
    } catch (error) {
        next(error);
    }   
}

export async function UpdatePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const { firstName, lastName, birthDate, gender, ethnicity, weight, height, activityLevel } = req.body as PatientDTO;
        const patient = await patientRepository.findOne({ where: { id: patientId } });
        if (!patient) {
            throw new CustomerError(404, 'Patient not found');
        }
        await patientRepository.update(patientId, { firstName, lastName, birthDate, gender, ethnicity, weight, height, activityLevel } );
        res.status(200).json({ message: 'Patient updated successfully'});
    } catch (error) {
        next(error);
    }
}

export async function DeletePatient(req: Request, res: Response, next: NextFunction) {
    try {
        const patientId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const patient = await patientRepository.findOne({ where: { id: patientId }});
        if (!patient) {
            throw new CustomerError(404, 'Patient not found');
        }
        await patientRepository.delete(patientId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}