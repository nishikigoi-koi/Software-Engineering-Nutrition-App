import { AppDataSource } from "../config/ormconfig.ts";
import { UserEntity } from "./entities/user.entity.ts";
import { PatientEntity } from "./entities/patient.entity.ts";
import { DietaryRestrictionEntity } from "./entities/dietaryRestriction.entity.ts";
import { MedicalConditionEntity } from "./entities/medicalCondition.entity.ts";
import { PatientRestrictionEntity } from "./entities/patientRestriction.entity.ts";
import { PatientConditionEntity } from "./entities/patientConditions.entity.ts";
import { CustomFoodEntity } from "./entities/customFood.entity.ts";
import { FoodLogEntity } from "./entities/foodLog.entity.ts";
import { CustomFoodMicroNutrientsEntity } from "./entities/customFoodMicroNutrients.entity.ts";


export const userRepository = AppDataSource.getRepository(UserEntity);

export const patientRepository = AppDataSource.getRepository(PatientEntity);

export const dietaryRestrictionRepository = AppDataSource.getRepository(DietaryRestrictionEntity);

export const medicalConditionRepository = AppDataSource.getRepository(MedicalConditionEntity);

export const patientRestrictionRepository = AppDataSource.getRepository(PatientRestrictionEntity);

export const patientConditionRepository = AppDataSource.getRepository(PatientConditionEntity);

export const customFoodRepository = AppDataSource.getRepository(CustomFoodEntity)

export const foodLogRepository = AppDataSource.getRepository(FoodLogEntity)

export const customFoodMicroNutrientsRepository = AppDataSource.getRepository(CustomFoodMicroNutrientsEntity)