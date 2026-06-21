import { PatientEntity } from "./entities/patient.entity.ts";
import {UserEntity} from "./entities/user.entity.ts";
import { DietaryRestrictionEntity } from "./entities/dietaryRestriction.entity.ts";
import { MedicalConditionEntity } from "./entities/medicalCondition.entity.ts";
import { PatientRestrictionEntity } from "./entities/patientRestriction.entity.ts";
import { PatientConditionEntity } from "./entities/patientConditions.entity.ts";
import { CustomFoodEntity } from "./entities/customFood.entity.ts";
import { FoodLogEntity } from "./entities/foodLog.entity.ts";
import { CustomFoodMicroNutrientsEntity } from "./entities/customFoodMicroNutrients.entity.ts";

export const entities = [
    UserEntity, 
    PatientEntity, 
    DietaryRestrictionEntity, 
    MedicalConditionEntity, 
    PatientRestrictionEntity, 
    PatientConditionEntity,
    CustomFoodEntity,
    FoodLogEntity,
    CustomFoodMicroNutrientsEntity
];
