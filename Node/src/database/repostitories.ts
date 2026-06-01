import { AppDataSource } from "../config/ormconfig.ts";
import { PatientEntity } from "./entities/patient.entity.ts";
import { UserEntity } from "./entities/user.entity.ts";


export const userRepository = AppDataSource.getRepository(UserEntity);

export const patientRepository = AppDataSource.getRepository(PatientEntity);