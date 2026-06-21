import { TotalNutrients, TotalMacroNutrients, TotalMicroNutrients} from "../models/totalNutrients.types";
import { FoodLogEntity } from "../database/entities/foodLog.entity.ts";
import { Repository } from "typeorm";
import { GetFoodLogsByDateAndPatientIdFromDatabase } from "./foodLog.helper.ts";
import { SearchGetFoodFileFromAPI } from "./search.helper.ts";
import { GetCustomFoodByIdFromDatabase } from "./customFood.helper.ts";
import { CustomFoodEntity } from "../database/entities/customFood.entity.ts";
import CustomerError from "../models/error.types.ts";
import { GetPatientById } from "../services/patient.service.ts";

const emptyTotalNutrientsFromFoodLogs: TotalNutrients = {
        EnergyUnit: 'kj',
        TotalEnergy: 0,
        macronutrients:[
            {
                name: "protein",
                unit: "g",
                amount: 0
            },
            {
                name: "carbohydrates",
                unit: "g",
                amount: 0
            },
            {
                name: "totalFat",
                unit: "g",
                amount: 0
            },
            {
                name: "saturatedFat",
                unit: "g",
                amount: 0
            },
                        {
                name: "Sodium",
                unit: "mg",
                amount: 0
            },
        ],
        micronutrients:[
            {
                name: "Calcium",
                unit: "mg",
                amount: 0
            },
            {
                name: "Copper",
                unit: "mg",
                amount: 0
            },
            {
                name: "Iron",
                unit: "mg",
                amount: 0
            },
            {
                name: "Folate",
                unit: "µg",
                amount: 0
            },
            {
                name: "Iodide (iodine)",
                unit: "µg",
                amount: 0
            },
            {
                name: "Potassium",
                unit: "mg",
                amount: 0
            },
            {
                name: "Magnesium",
                unit: "mg",
                amount: 0
            },
            {
                name: "Manganese",
                unit: "µg",
                amount: 0
            },
            {
                name: "Niacin (vitamin B3)",
                unit: "mg",
                amount: 0
            },
            {
                name: "Phosphorus",
                unit: "mg",
                amount: 0
            },
            {
                name: "Riboflavin (vitamin B2)",
                unit: "mg",
                amount: 0
            },
            {
                name: "Selenium",
                unit: "µg",
                amount: 0
            },
            {
                name: "Thiamin (vitamin B1)",
                unit: "mg",
                amount: 0
            },
            {
                name: "Vitamin A, FSANZ",
                unit: "µg",
                amount: 0
            },
            {
                name: "Vitamin B12 (cobalamin)",
                unit: "µg",
                amount: 0
            },
            {
                name: "Vitamin B6 (pyridoxal phosphate)",
                unit: "mg",
                amount: 0
            },
            {
                name: "Vitamin C (ascorbic acid)",
                unit: "mg",
                amount:0
            },
            {
                name: "Vitamin D",
                unit: "µg",
                amount: 0
            },
            {
                name: "Vitamin E (tocopherols)",
                unit: "mg",
                amount: 0
            },
            {
                name: "Zinc",
                unit: "mg",
                amount: 0
            }
        ]
    }

const cloneEmptyTotalNutrients = (): TotalNutrients => {
    return JSON.parse(JSON.stringify(emptyTotalNutrientsFromFoodLogs)) as TotalNutrients
}

export async function GetTotalNutrientsDayFromDatabase(date:string,patientId:string,FoodLogDatabaseRepository:Repository<FoodLogEntity>,customFoodDatabaseRepo:Repository<CustomFoodEntity>): Promise<TotalNutrients>{
    const foodLogs = await GetFoodLogsByDateAndPatientIdFromDatabase(date, patientId, FoodLogDatabaseRepository)

    let totalNutrientsFromFoodLogs: TotalNutrients = cloneEmptyTotalNutrients()

    for (const log of foodLogs){
        if(log.FCDBFoodId != null){
            const foodFile = await SearchGetFoodFileFromAPI(log.FCDBFoodId)

            let qty_per_100_mult:number = 0
            const unit = log.unit.toLowerCase()

            if (unit == 'g' || unit == 'ml'){
                qty_per_100_mult = (log.amount / 100)
            }
            if (unit == 'kg' || unit == 'l'){
                qty_per_100_mult = (log.amount * 10)
            }

            totalNutrientsFromFoodLogs.TotalEnergy += (foodFile.energy.qty_per_100 as unknown as number)*qty_per_100_mult
            totalNutrientsFromFoodLogs.macronutrients[0].amount += Math.round((foodFile.protein.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[1].amount += Math.round((foodFile.carbohydrates.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[2].amount += Math.round((foodFile.totalFat.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[3].amount += Math.round((foodFile.saturatedFat.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[4].amount += Math.round((foodFile.sodium.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 

            for (const microNutrients of foodFile.microNutrients){
                for(const totalMicroNutrients of totalNutrientsFromFoodLogs.micronutrients){
                    if (microNutrients.name == totalMicroNutrients.name){
                        totalMicroNutrients.amount += Math.round((microNutrients.qty_per_100 as unknown as number) * qty_per_100_mult *100)/100
                    }
                }
            }
        }
        if(log.CustomFoodId != null){

            const customFood = await GetCustomFoodByIdFromDatabase(log.CustomFoodId,customFoodDatabaseRepo)

            let qty_per_100_mult:number = 0
            const unit = log.unit.toLowerCase()

            if (unit == 'g' || unit == 'ml'){
                qty_per_100_mult = (log.amount / 100)
            }
            if (unit == 'kg' || unit == 'l'){
                qty_per_100_mult = (log.amount * 10)
            }
            totalNutrientsFromFoodLogs.TotalEnergy += (customFood.energy.qty_per_100 as unknown as number)*qty_per_100_mult
            totalNutrientsFromFoodLogs.macronutrients[0].amount += Math.round((customFood.protein.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[1].amount += Math.round((customFood.carbohydrates.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[2].amount += Math.round((customFood.totalFat.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[3].amount += Math.round((customFood.saturatedFat.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 
            totalNutrientsFromFoodLogs.macronutrients[4].amount += Math.round((customFood.sodium.qty_per_100 as unknown as number)*qty_per_100_mult *100)/100 

            for (const microNutrients of customFood.microNutrients){
                for(const totalMicroNutrients of totalNutrientsFromFoodLogs.micronutrients){
                    if (microNutrients.name == totalMicroNutrients.name){
                        totalMicroNutrients.amount +=  Math.round((microNutrients.qty_per_100 as unknown as number) * qty_per_100_mult *100)/100 
                    }
                }
            }
        }
    }
    return totalNutrientsFromFoodLogs
}

export async function GetTotalNutrientsWeekFromDatabase(Startdate:string,patientId:string,FoodLogDatabaseRepository:Repository<FoodLogEntity>,customFoodDatabaseRepo:Repository<CustomFoodEntity>): Promise<TotalNutrients>{
    if (Startdate == '' ){
        throw new CustomerError(400,"startdate is invalid")
    }
    

    // get dates of the week
    const startOfWeek = new Date(Startdate)
    let DatesOfWeek: string[] = []

    for(let i: number = 0; i < 7; i++){
        const day = new Date(startOfWeek)
        day.setDate(startOfWeek.getDate() + i)
        DatesOfWeek.push(day.toISOString().split('T')[0])
    }

    let totalNutrientsFromFoodLogs: TotalNutrients = cloneEmptyTotalNutrients()


    for( const date of DatesOfWeek){
        let totalNutrientsFromFoodLogsForDay: TotalNutrients = cloneEmptyTotalNutrients()
        try{
            totalNutrientsFromFoodLogsForDay = await GetTotalNutrientsDayFromDatabase(date,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
        }
        catch (CustomerError){
            continue
        }
        
        totalNutrientsFromFoodLogs.TotalEnergy += totalNutrientsFromFoodLogsForDay.TotalEnergy
        let i: number = 0
        for (const macroNutrients of totalNutrientsFromFoodLogs.macronutrients){
            macroNutrients.amount += totalNutrientsFromFoodLogsForDay.macronutrients[i].amount
            i++
        }
        i = 0
        for (const microNutrients of totalNutrientsFromFoodLogs.micronutrients){
            microNutrients.amount += totalNutrientsFromFoodLogsForDay.micronutrients[i].amount
            i++
        }
    }
    return totalNutrientsFromFoodLogs
}

export async function GetTotalNutrientsCustomTimePeriodFromDatabase(Startdate:string,Enddate:string,patientId:string,FoodLogDatabaseRepository:Repository<FoodLogEntity>,customFoodDatabaseRepo:Repository<CustomFoodEntity>): Promise<TotalNutrients>{

    // get dates of the week
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

    let totalNutrientsFromFoodLogs: TotalNutrients = cloneEmptyTotalNutrients()

    for( const date of Dates){
        let totalNutrientsFromFoodLogsForDay: TotalNutrients
        try{
            totalNutrientsFromFoodLogsForDay = await GetTotalNutrientsDayFromDatabase(date,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
        }
        catch (CustomerError){
            continue
        }

        totalNutrientsFromFoodLogs.TotalEnergy += totalNutrientsFromFoodLogsForDay.TotalEnergy
        let i: number = 0
        for (const macroNutrients of totalNutrientsFromFoodLogs.macronutrients){
            macroNutrients.amount += totalNutrientsFromFoodLogsForDay.macronutrients[i].amount
            i++
        }
        i = 0
        for (const microNutrients of totalNutrientsFromFoodLogs.micronutrients){
            microNutrients.amount += totalNutrientsFromFoodLogsForDay.micronutrients[i].amount
            i++
        }
    }
    return totalNutrientsFromFoodLogs
}

