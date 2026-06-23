import { Repository } from "typeorm";
import { GetTotalNutrientsCustomTimePeriodFromDatabase, GetTotalNutrientsDayFromDatabase, GetTotalNutrientsWeekFromDatabase } from "./totalNutrients.helper.ts";
import { FoodLogEntity } from "../database/entities/foodLog.entity.ts";
import { CustomFoodEntity } from "../database/entities/customFood.entity.ts";
import { CalculateRDI } from "./RDI.helper.ts";
import { PatientEntity } from "../database/entities/patient.entity.ts";
import { PatientConditionEntity } from "../database/entities/patientConditions.entity.ts";
import { Flags } from "../models/flag.types.ts";
import CustomerError from "../models/error.types.ts";

const emptyFlags: Flags = {
    energy: null,
    macronutrients: [],
    micronutrients: []
}

const cloneEmptyFlags = (): Flags => {
    return JSON.parse(JSON.stringify(emptyFlags)) as Flags
}

function WithInFivePercent(totalNutrientsValue:number,RDI:number): string{
    if(totalNutrientsValue < RDI * 0.95){
        return "below"
    }
    if(totalNutrientsValue > RDI * 1.05){
        return "above"
    }
    return "in range"
}

function WithInRange(totalNutrientsValue:number, RDImin:number, RDImax:number):string{
    if(totalNutrientsValue < RDImin){
        return "below"
    }
    if(totalNutrientsValue > RDImax){
        return "above"
    }
    return "in range"
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
    const totalNutrients = await GetTotalNutrientsDayFromDatabase(date,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
    const RDI = await CalculateRDI(patientId,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    let Flags:Flags = cloneEmptyFlags()

    const energyDirection = WithInFivePercent(totalNutrients.TotalEnergy,RDI.TotalEnergy)
    if( energyDirection !== "in range"){
        Flags.energy ={
            name: "energy",
            unit: totalNutrients.EnergyUnit,
            RDI: RDI.TotalEnergy.toString(),
            intake: totalNutrients.TotalEnergy.toString(),
            direction: energyDirection
        }
    }
    for(const totalMacroNutrients of totalNutrients.macronutrients){
        for(const RDIMacroNutrients of RDI.macronutrients){
            if(totalMacroNutrients.name == RDIMacroNutrients.name){
                const direction = WithInRange(totalMacroNutrients.amount,RDIMacroNutrients.minAmount,RDIMacroNutrients.maxAmount)
                if(direction !== "in range"){
                    Flags.macronutrients.push({
                        name: totalMacroNutrients.name,
                        unit: totalMacroNutrients.unit,
                        minRDI: RDIMacroNutrients.minAmount.toString(),
                        maxRDI: RDIMacroNutrients.maxAmount.toString(),
                        intake: totalMacroNutrients.amount.toString(),
                        direction: direction
                    })
                }
            }
        }
    }
    for(const totalMicroNutrients of totalNutrients.micronutrients){
        for(const RDIMicroNutrients of RDI.micronutrients){
            if(totalMicroNutrients.name == RDIMicroNutrients.name){
                const direction = WithInFivePercent(totalMicroNutrients.amount,RDIMicroNutrients.amount)
                if(direction !== "in range"){
                    Flags.micronutrients.push({
                        name: totalMicroNutrients.name,
                        unit: totalMicroNutrients.unit,
                        RDI: RDIMicroNutrients.amount.toString(),
                        intake: totalMicroNutrients.amount.toString(),
                        direction: direction
                    })
                }
            }
        }
    }
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
    const totalNutrients = await GetTotalNutrientsWeekFromDatabase(Startdate,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
    const RDI = await CalculateRDI(patientId,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    let Flags:Flags = cloneEmptyFlags()

    const energyDirection = WithInFivePercent(totalNutrients.TotalEnergy,(RDI.TotalEnergy*7))
    if( energyDirection !== "in range"){
        Flags.energy ={
            name: "energy",
            unit: totalNutrients.EnergyUnit,
            RDI: (RDI.TotalEnergy*7).toString(),
            intake: totalNutrients.TotalEnergy.toString(),
            direction: energyDirection
        }
    }
    for(const totalMacroNutrients of totalNutrients.macronutrients){
        for(const RDIMacroNutrients of RDI.macronutrients){
            if(totalMacroNutrients.name == RDIMacroNutrients.name){
                const direction = WithInRange(totalMacroNutrients.amount,(RDIMacroNutrients.minAmount*7),(RDIMacroNutrients.maxAmount*7))
                if(direction !== "in range"){
                    Flags.macronutrients.push({
                        name: totalMacroNutrients.name,
                        unit: totalMacroNutrients.unit,
                        minRDI: (RDIMacroNutrients.minAmount*7).toString(),
                        maxRDI: (RDIMacroNutrients.maxAmount*7).toString(),
                        intake: totalMacroNutrients.amount.toString(),
                        direction: direction
                    })
                }
            }
        }
    }
    for(const totalMicroNutrients of totalNutrients.micronutrients){
        for(const RDIMicroNutrients of RDI.micronutrients){
            if(totalMicroNutrients.name == RDIMicroNutrients.name){
                const direction = WithInFivePercent(totalMicroNutrients.amount,(RDIMicroNutrients.amount*7))
                if(direction !== "in range"){
                    Flags.micronutrients.push({
                        name: totalMicroNutrients.name,
                        unit: totalMicroNutrients.unit,
                        RDI: (RDIMicroNutrients.amount*7).toString(),
                        intake: totalMicroNutrients.amount.toString(),
                        direction: direction
                    })
                }
            }
        }
    }
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
    const totalNutrients = await GetTotalNutrientsCustomTimePeriodFromDatabase(Startdate,Enddate,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
    const RDI = await CalculateRDI(patientId,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    let Flags:Flags = cloneEmptyFlags()

    let Dates: string[] = []

    const currentDate = new Date(Startdate)
    const EndDateOfPeriod = new Date(Enddate)

    while (currentDate <= EndDateOfPeriod){
        Dates.push(currentDate.toISOString().split('T')[0]);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    if(Dates.length == 0){
        throw new CustomerError(400,"invalid dates")
    }
    const amountOfDays: number = Dates.length

    const energyDirection = WithInFivePercent(totalNutrients.TotalEnergy,(RDI.TotalEnergy*amountOfDays))
    if( energyDirection !== "in range"){
        Flags.energy ={
            name: "energy",
            unit: totalNutrients.EnergyUnit,
            RDI: (RDI.TotalEnergy*amountOfDays).toString(),
            intake: totalNutrients.TotalEnergy.toString(),
            direction: energyDirection
        }
    }
    for(const totalMacroNutrients of totalNutrients.macronutrients){
        for(const RDIMacroNutrients of RDI.macronutrients){
            if(totalMacroNutrients.name == RDIMacroNutrients.name){
                const direction = WithInRange(totalMacroNutrients.amount,(RDIMacroNutrients.minAmount*amountOfDays),(RDIMacroNutrients.maxAmount*amountOfDays))
                if(direction !== "in range"){
                    Flags.macronutrients.push({
                        name: totalMacroNutrients.name,
                        unit: totalMacroNutrients.unit,
                        minRDI: (RDIMacroNutrients.minAmount*amountOfDays).toString(),
                        maxRDI: (RDIMacroNutrients.maxAmount*amountOfDays).toString(),
                        intake: totalMacroNutrients.amount.toString(),
                        direction: direction
                    })
                }
            }
        }
    }
    for(const totalMicroNutrients of totalNutrients.micronutrients){
        for(const RDIMicroNutrients of RDI.micronutrients){
            if(totalMicroNutrients.name == RDIMicroNutrients.name){
                const direction = WithInFivePercent(totalMicroNutrients.amount,(RDIMicroNutrients.amount*amountOfDays))
                if(direction !== "in range"){
                    Flags.micronutrients.push({
                        name: totalMicroNutrients.name,
                        unit: totalMicroNutrients.unit,
                        RDI: (RDIMicroNutrients.amount*amountOfDays).toString(),
                        intake: totalMicroNutrients.amount.toString(),
                        direction: direction
                    })
                }
            }
        }
    }
    return Flags
}