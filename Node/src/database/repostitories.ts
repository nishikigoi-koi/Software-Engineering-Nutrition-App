import { AppDataSource } from "../config/ormconfig.ts";
import { DietaryRestrictionEntity } from "./entities/dietaryRestriction.entity.ts";
import { PatientEntity } from "./entities/patient.entity.ts";
import { UserEntity } from "./entities/user.entity.ts";


export const userRepository = AppDataSource.getRepository(UserEntity);

export const patientRepository = AppDataSource.getRepository(PatientEntity);

export const dietaryRestrictionRepository = AppDataSource.getRepository(DietaryRestrictionEntity);