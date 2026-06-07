import { PatientDTO, Patient } from "../models/patient.types.ts";
import { PatientEntity } from "../database/entities/patient.entity.ts";
import { Repository } from "typeorm";
import CustomerError from '../models/error.types.ts';

function mapEntityToPatient(patient: PatientEntity): Patient {
    return {
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
    };
}

export async function CreatePatientInDatabase(patientDTO: PatientDTO, databaseRepo: Repository<PatientEntity>): Promise<Patient> {
    const { userId, firstName, lastName, birthDate, gender, ethnicity, weight, height, activityLevel } = patientDTO;
    
    if (!firstName || !lastName || !birthDate || !gender || !ethnicity || !weight || !height || !activityLevel || !userId) {
        throw new CustomerError(400, 'All fields and userId are required');
    }
    
    const patient = await databaseRepo.save({
        firstName,
        lastName,
        birthDate,
        gender,
        ethnicity,
        weight,
        height,
        activityLevel,
        user: { id: userId }
    });
    
    return mapEntityToPatient(patient);
}

export async function GetPatientByIdInDatabase(
    patientId: string,
    databaseRepo: Repository<PatientEntity>
): Promise<Patient> {
    const patient = await databaseRepo.findOne({
        where: { id: patientId },
        relations: ['user']
    });
    
    if (!patient) {
        throw new CustomerError(404, 'Patient not found');
    }
    
    return mapEntityToPatient(patient);
}

export async function GetAllPatientsByUserIdInDatabase(
    userId: string,
    databaseRepo: Repository<PatientEntity>
): Promise<Patient[]> {
    const patients = await databaseRepo.find({
        where: { user: { id: userId } },
        relations: ['user']
    });
    
    if (!patients || patients.length === 0) {
        throw new CustomerError(404, 'No patients found for this user');
    }
    
    return patients.map(mapEntityToPatient);
}

export async function UpdatePatientInDatabase(
    patientId: string,
    patientDTO: PatientDTO,
    databaseRepo: Repository<PatientEntity>
): Promise<void> {
    const { firstName, lastName, birthDate, gender, ethnicity, weight, height, activityLevel } = patientDTO;
    
    const patient = await databaseRepo.findOne({ where: { id: patientId } });
    if (!patient) {
        throw new CustomerError(404, 'Patient not found');
    }
    
    await databaseRepo.update(patientId, {
        firstName,
        lastName,
        birthDate,
        gender,
        ethnicity,
        weight,
        height,
        activityLevel
    });
}

export async function DeletePatientInDatabase(
    patientId: string,
    databaseRepo: Repository<PatientEntity>
): Promise<void> {
    const patient = await databaseRepo.findOne({ where: { id: patientId } });
    if (!patient) {
        throw new CustomerError(404, 'Patient not found');
    }
    
    await databaseRepo.delete(patientId);
}
