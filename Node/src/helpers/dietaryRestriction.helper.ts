import {dietaryRestriction,dietaryRestrictionDTO, patientRestriction} from "../models/dietaryRestriction.types.ts";
import {DietaryRestrictionEntity} from "../database/entities/dietaryRestriction.entity.ts";
import { PatientRestrictionEntity } from "../database/entities/patientRestriction.entity.ts";
import { Repository } from "typeorm";
import CustomerError from "../models/error.types.ts";

function mapEntityToDietaryRestriction(dietaryRestriction: DietaryRestrictionEntity): dietaryRestriction{
    return{
    id: dietaryRestriction.id,
    name: dietaryRestriction.name,
    description: dietaryRestriction.description
    };
}

function mapEntityToPatientRestriction(patientRestriction: PatientRestrictionEntity): patientRestriction{
    return{
        patientId: patientRestriction.patientId,
        dietaryRestrictionId: patientRestriction.dietaryRestrictionId
    }
}

export async function CreateDietaryRestrictionInDatabase(dietaryRestriction: dietaryRestrictionDTO, databaseRepo:Repository<DietaryRestrictionEntity>): Promise<dietaryRestriction> {
    const name = dietaryRestriction.name
    const description = dietaryRestriction.description
    if (!name || !description) {
        throw new CustomerError(400, 'All fields are required');
    }   
    const createdDietaryRestriction = await databaseRepo.save({ name, description });
    return(mapEntityToDietaryRestriction(createdDietaryRestriction))
}

export async function GetAllDietaryRestrictionsFromDatabase(databaseRepo:Repository<DietaryRestrictionEntity>): Promise<dietaryRestriction[]> {
    const dietaryRestrictions = await databaseRepo.find();
    const returnedDietaryRestrictions: dietaryRestriction[] = [];
    dietaryRestrictions.forEach((dietaryRestriction:DietaryRestrictionEntity) => {
        returnedDietaryRestrictions.push(mapEntityToDietaryRestriction(dietaryRestriction));
    });
    return(dietaryRestrictions)
}

export async function GetDietaryRestrictionByIdFromDatabase(id: string, databaseRepo:Repository<DietaryRestrictionEntity>): Promise<dietaryRestriction>{
    const dietaryRestriction = await databaseRepo.findOne({ where: { id } });
    if (!dietaryRestriction) {
        throw new CustomerError(404, 'Dietary Restriction not found');
    }
    return(mapEntityToDietaryRestriction(dietaryRestriction));
}

export async function UpdateDietaryRestrictionInDatabase(id: string, dietaryRestriction: dietaryRestrictionDTO, databaseRepo:Repository<DietaryRestrictionEntity>) {
    await GetDietaryRestrictionByIdFromDatabase(id, databaseRepo) //check if exist
    await databaseRepo.update(id, dietaryRestriction);
}

export async function DeleteDietaryRestrictionInDatabase(id: string, databaseRepo:Repository<DietaryRestrictionEntity>) {
    await GetDietaryRestrictionByIdFromDatabase(id, databaseRepo) //check if exist
    await await databaseRepo.delete(id);
}

export async function AssignDietaryRestrictionToPatientInDatabase(patientRestriction: patientRestriction, databaseRepo:Repository<PatientRestrictionEntity>): Promise<patientRestriction> {
    const createdPatientRestriction = await databaseRepo.save(patientRestriction);
    return mapEntityToPatientRestriction(createdPatientRestriction);
}

export async function GetPatientDietaryRestrictionsFromDatabase(patientId: string, databaseRepo:Repository<PatientRestrictionEntity>): Promise<dietaryRestriction[]> {
    const patientRestrictions = await databaseRepo.find({ where: { patientId }, relations: ['dietaryRestrictions'] });
    const returnedDietaryRestrictions: dietaryRestriction[] = [];
    patientRestrictions.forEach((restriction) => {
        returnedDietaryRestrictions.push(mapEntityToDietaryRestriction(restriction.dietaryRestrictions));
    });
    return returnedDietaryRestrictions;
}

export async function RemoveDietaryRestrictionFromPatientInDatabase(patientRestriction: patientRestriction, databaseRepo:Repository<PatientRestrictionEntity>){
    const { patientId, dietaryRestrictionId } = patientRestriction
    await databaseRepo.findOne({ where: { patientId, dietaryRestrictionId } });
    if (!patientRestriction) {
        throw new CustomerError(404, 'Patient Restriction not found');
    }
    await databaseRepo.delete({ patientId, dietaryRestrictionId });
}