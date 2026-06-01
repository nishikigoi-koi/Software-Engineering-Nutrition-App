import { PatientEntity } from "./entities/patient.entity.ts";
import {UserEntity} from "./entities/user.entity.ts";
import { DietaryRestrictionEntity } from "./entities/dietaryRestriction.entity.ts";
import { MedicalConditionEntity } from "./entities/medicalConditions.entity.ts";

export const entities = [UserEntity, PatientEntity, DietaryRestrictionEntity, MedicalConditionEntity];
