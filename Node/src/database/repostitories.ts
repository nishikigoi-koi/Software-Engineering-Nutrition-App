import { AppDataSource } from "../config/ormconfig.ts";
import { DietaryRestrictionEntity } from "./entities/dietaryRestriction.entity.ts";
import { MedicalConditionEntity } from "./entities/medicalConditions.entity.ts";
import { PatientEntity } from "./entities/patient.entity.ts";
import { UserEntity } from "./entities/user.entity.ts";


export const userRepository = AppDataSource.getRepository(UserEntity);

export const patientRepository = AppDataSource.getRepository(PatientEntity);

export const dietaryRestrictionRepository = AppDataSource.getRepository(DietaryRestrictionEntity);

export const medicalConditionRepository = AppDataSource.getRepository(MedicalConditionEntity);