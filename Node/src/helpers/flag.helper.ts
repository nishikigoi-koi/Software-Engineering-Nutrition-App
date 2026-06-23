import { Repository } from "typeorm";
import { GetTotalNutrientsCustomTimePeriodFromDatabase, GetTotalNutrientsDayFromDatabase, GetTotalNutrientsWeekFromDatabase } from "./totalNutrients.helper.ts";
import { FoodLogEntity } from "../database/entities/foodLog.entity.ts";
import { CustomFoodEntity } from "../database/entities/customFood.entity.ts";
import { CalculateRDI } from "./RDI.helper.ts";
import { PatientEntity } from "../database/entities/patient.entity.ts";
import { PatientConditionEntity } from "../database/entities/patientConditions.entity.ts";
import { FlagMacroNutrients, FlagMicroNutrients, Flags } from "../models/flag.types.ts";
import CustomerError from "../models/error.types.ts";
import { GetReportCustomTimePeriodFromDatabase, GetReportDayFromDatabase, GetReportWeekFromDatabase } from "./report.helper.ts";
import { Report,ReportMacroNutrients,ReportRDIComparedToTotalIntake } from '../models/report.types.ts'

const emptyFlags: Flags = {
    energy: null,
    macronutrients: [],
    micronutrients: []
}

const cloneEmptyFlags = (): Flags => {
    return JSON.parse(JSON.stringify(emptyFlags)) as Flags
}

function mapRDIComparedToTotalIntakeToFlags(RDIComToTotalIn:ReportRDIComparedToTotalIntake):Flags{
    let flags:Flags = cloneEmptyFlags()

    if (RDIComToTotalIn.energy?.direction != "in range"){
        flags.energy = RDIComToTotalIn.energy
    }

    for(const macroNutrient of RDIComToTotalIn.macronutrients){
        if(macroNutrient.direction != "in range"){
            flags.macronutrients.push(macroNutrient as FlagMacroNutrients)
        }
    }

    for(const microNutrient of RDIComToTotalIn.micronutrients){
        if(microNutrient.direction != "in range"){
            flags.micronutrients.push(microNutrient as FlagMicroNutrients)
        }
    }

    return flags
}

export async function GetFlagsDayFromDatabase(
    date: string, 
    patientId: string, 
    FoodLogDatabaseRepository: Repository<FoodLogEntity>, 
    customFoodDatabaseRepo: Repository<CustomFoodEntity>, 
    PatientDatabaseRepo: Repository<PatientEntity>, 
    PatientConditionDatabaseRepo: Repository<PatientConditionEntity>
): Promise<Flags>
{
    const report = await GetReportDayFromDatabase(date,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    const Flags = mapRDIComparedToTotalIntakeToFlags(report.RDIComparedToTotalIntake)
    
    return Flags
}

export async function GetFlagsWeekFromDatabase(
    Startdate: string, 
    patientId: string, 
    FoodLogDatabaseRepository: Repository<FoodLogEntity>, 
    customFoodDatabaseRepo: Repository<CustomFoodEntity>, 
    PatientDatabaseRepo: Repository<PatientEntity>, 
    PatientConditionDatabaseRepo: Repository<PatientConditionEntity>
): Promise<Flags>
{
    const report = await GetReportWeekFromDatabase(Startdate,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    const Flags = mapRDIComparedToTotalIntakeToFlags(report.RDIComparedToTotalIntake)

    return Flags
}


export async function GetFlagsCustomTimePeriodFromDatabase(
    Startdate: string,
    Enddate: string,
    patientId: string, 
    FoodLogDatabaseRepository: Repository<FoodLogEntity>, 
    customFoodDatabaseRepo: Repository<CustomFoodEntity>, 
    PatientDatabaseRepo: Repository<PatientEntity>, 
    PatientConditionDatabaseRepo: Repository<PatientConditionEntity>
): Promise<Flags>
{
    const report = await GetReportCustomTimePeriodFromDatabase(Startdate,Enddate,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    const Flags = mapRDIComparedToTotalIntakeToFlags(report.RDIComparedToTotalIntake)

    return Flags
}