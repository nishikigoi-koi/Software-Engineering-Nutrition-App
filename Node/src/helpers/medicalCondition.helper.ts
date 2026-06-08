import {medicalCondition,medicalConditionDTO, patientCondition} from "../models/medicalCondition.types.ts";
import {MedicalConditionEntity} from "../database/entities/medicalCondition.entity.ts";
import { PatientConditionEntity } from "../database/entities/patientConditions.entity.ts";
import { Repository } from "typeorm";
import CustomerError from "../models/error.types.ts";

function mapEntityToMedicalCondition(medicalCondition: MedicalConditionEntity): medicalCondition{
    return{
    id: medicalCondition.id,
    name: medicalCondition.name,
    description: medicalCondition.description
    };
}

function mapEntityToPatientCondition(patientCondition: PatientConditionEntity): patientCondition{
    return{
        patientId: patientCondition.patientId,
        medicalConditionId: patientCondition.medicalConditionId
    }
}

export async function CreateMedicalConditionInDatabase(medicalCondition: medicalConditionDTO, databaseRepo:Repository<MedicalConditionEntity>): Promise<medicalCondition> {
    const name = medicalCondition.name
    const description = medicalCondition.description
    if (!name || !description) {
        throw new CustomerError(400, 'All fields are required');
    }   
    const createdMedicalCondition = await databaseRepo.save({ name, description });
    return(mapEntityToMedicalCondition(createdMedicalCondition))
}

export async function GetAllMedicalConditionsFromDatabase(databaseRepo:Repository<MedicalConditionEntity>): Promise<medicalCondition[]> {
    const medicalConditions = await databaseRepo.find();
    const returnedMedicalConditions: medicalCondition[] = [];
    medicalConditions.forEach((medicalCondition:MedicalConditionEntity) => {
        returnedMedicalConditions.push(mapEntityToMedicalCondition(medicalCondition));
    });
    return(medicalConditions)
}

export async function GetMedicalConditionByIdFromDatabase(id: string, databaseRepo:Repository<MedicalConditionEntity>): Promise<medicalCondition>{
    const medicalCondition = await databaseRepo.findOne({ where: { id } });
    if (!medicalCondition) {
        throw new CustomerError(404, 'Medical Condition not found');
    }
    return(mapEntityToMedicalCondition(medicalCondition));
}

export async function UpdateMedicalConditionInDatabase(id: string, medicalCondition: medicalConditionDTO, databaseRepo:Repository<MedicalConditionEntity>) {
    await GetMedicalConditionByIdFromDatabase(id, databaseRepo) //check if exist
    await databaseRepo.update(id, medicalCondition);
}

export async function DeleteMedicalConditionInDatabase(id: string, databaseRepo:Repository<MedicalConditionEntity>) {
    await GetMedicalConditionByIdFromDatabase(id, databaseRepo) //check if exist
    await await databaseRepo.delete(id);
}

export async function AssignMedicalConditionToPatientInDatabase(patientCondition: patientCondition, databaseRepo:Repository<PatientConditionEntity>): Promise<patientCondition> {
    const createdPatientCondition = await databaseRepo.save(patientCondition);
    return mapEntityToPatientCondition(createdPatientCondition);
}

export async function GetPatientMedicalConditionsFromDatabase(patientId: string, databaseRepo:Repository<PatientConditionEntity>): Promise<medicalCondition[]> {
    const patientConditions = await databaseRepo.find({ where: { patientId }, relations: ['medicalConditions'] });
    const returnedMedicalConditions: medicalCondition[] = [];
    patientConditions.forEach((condition) => {
        returnedMedicalConditions.push(mapEntityToMedicalCondition(condition.medicalConditions));
    });
    return returnedMedicalConditions;
}

export async function RemoveMedicalConditionFromPatientInDatabase(patientCondition: patientCondition, databaseRepo:Repository<PatientConditionEntity>){
    const { patientId, medicalConditionId } = patientCondition
    await databaseRepo.findOne({ where: { patientId, medicalConditionId } });
    if (!patientCondition) {
        throw new CustomerError(404, 'Patient Condition not found');
    }
    await databaseRepo.delete({ patientId, medicalConditionId });
}