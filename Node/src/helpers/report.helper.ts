import { Repository } from "typeorm";
import { GetTotalNutrientsCustomTimePeriodFromDatabase, GetTotalNutrientsDayFromDatabase, GetTotalNutrientsWeekFromDatabase } from "./totalNutrients.helper.ts";
import { FoodLogEntity } from "../database/entities/foodLog.entity.ts";
import { CustomFoodEntity } from "../database/entities/customFood.entity.ts";
import { CalculateRDI } from "./RDI.helper.ts";
import { PatientEntity } from "../database/entities/patient.entity.ts";
import { PatientConditionEntity } from "../database/entities/patientConditions.entity.ts";
import CustomerError from "../models/error.types.ts";
import { Report, ReportFoodLogs, ReportMacroNutrients , ReportMicroNutrients , ReportRDIComparedToTotalIntake } from "../models/report.types.ts";
import { GetFoodLogsByDateAndPatientIdFromDatabase } from "./foodLog.helper.ts";
import { FoodLog } from "../models/foodLog.types.ts";
import { GetPatientByIdInDatabase } from "./patient.helper.ts";

const emptyReportRDIComparedToTotalIntake: ReportRDIComparedToTotalIntake = {
    energy: null,
    macronutrients: [],
    micronutrients: []
}

const cloneEmptyReportRDIComparedToTotalIntake = (): ReportRDIComparedToTotalIntake => {
    return JSON.parse(JSON.stringify(emptyReportRDIComparedToTotalIntake)) as ReportRDIComparedToTotalIntake
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

export async function GetReportDayFromDatabase(
    date: string, 
    patientId: string, 
    FoodLogDatabaseRepository: Repository<FoodLogEntity>, 
    customFoodDatabaseRepo: Repository<CustomFoodEntity>, 
    PatientDatabaseRepo: Repository<PatientEntity>, 
    PatientConditionDatabaseRepo: Repository<PatientConditionEntity>
): Promise<Report>
{
    const totalNutrients = await GetTotalNutrientsDayFromDatabase(date,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
    const RDI = await CalculateRDI(patientId,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    let ReportRDIComparedToTotalIntake:ReportRDIComparedToTotalIntake = cloneEmptyReportRDIComparedToTotalIntake()

    const energyDirection = WithInFivePercent(totalNutrients.TotalEnergy,RDI.TotalEnergy)
    ReportRDIComparedToTotalIntake.energy ={
        name: "energy",
        unit: totalNutrients.EnergyUnit,
        RDI: RDI.TotalEnergy.toString(),
        intake: totalNutrients.TotalEnergy.toString(),
        direction: energyDirection
    }
    for(const totalMacroNutrients of totalNutrients.macronutrients){
        for(const RDIMacroNutrients of RDI.macronutrients){
            if(totalMacroNutrients.name == RDIMacroNutrients.name){
                const direction = WithInRange(totalMacroNutrients.amount,RDIMacroNutrients.minAmount,RDIMacroNutrients.maxAmount)
                ReportRDIComparedToTotalIntake.macronutrients.push({
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
    for(const totalMicroNutrients of totalNutrients.micronutrients){
        for(const RDIMicroNutrients of RDI.micronutrients){
            if(totalMicroNutrients.name == RDIMicroNutrients.name){
                const direction = WithInFivePercent(totalMicroNutrients.amount,RDIMicroNutrients.amount)
                    ReportRDIComparedToTotalIntake.micronutrients.push({
                        name: totalMicroNutrients.name,
                        unit: totalMicroNutrients.unit,
                        RDI: RDIMicroNutrients.amount.toString(),
                        intake: totalMicroNutrients.amount.toString(),
                        direction: direction
                    })
            }
        }
    }

    const foodLogs = await GetFoodLogsByDateAndPatientIdFromDatabase(date, patientId, FoodLogDatabaseRepository)

    let foodLogIds:ReportFoodLogs[] = []
    for(const log of foodLogs){
        foodLogIds.push({
            foodLogId: log.id
        })
    }

    const patient = await GetPatientByIdInDatabase(patientId,PatientDatabaseRepo)

    const report: Report = {
        title: `Report For ${patient.firstName} ${patient.lastName} on ${date}`,
        date: `${date}`,
        patientName: `${patient.firstName} ${patient.lastName}`,
        foodLogs: foodLogIds,
        RDIComparedToTotalIntake: ReportRDIComparedToTotalIntake
    }
    return report
}

export async function GetReportWeekFromDatabase(
    Startdate: string, 
    patientId: string, 
    FoodLogDatabaseRepository: Repository<FoodLogEntity>, 
    customFoodDatabaseRepo: Repository<CustomFoodEntity>, 
    PatientDatabaseRepo: Repository<PatientEntity>, 
    PatientConditionDatabaseRepo: Repository<PatientConditionEntity>
): Promise<Report>
{
    const totalNutrients = await GetTotalNutrientsWeekFromDatabase(Startdate,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
    const RDI = await CalculateRDI(patientId,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    let ReportRDIComparedToTotalIntake:ReportRDIComparedToTotalIntake = cloneEmptyReportRDIComparedToTotalIntake()

    const energyDirection = WithInFivePercent(totalNutrients.TotalEnergy,(RDI.TotalEnergy*7))
    ReportRDIComparedToTotalIntake.energy ={
        name: "energy",
        unit: totalNutrients.EnergyUnit,
        RDI: (RDI.TotalEnergy*7).toString(),
        intake: totalNutrients.TotalEnergy.toString(),
        direction: energyDirection
    }

    for(const totalMacroNutrients of totalNutrients.macronutrients){
        for(const RDIMacroNutrients of RDI.macronutrients){
            if(totalMacroNutrients.name == RDIMacroNutrients.name){
                const direction = WithInRange(totalMacroNutrients.amount,(RDIMacroNutrients.minAmount*7),(RDIMacroNutrients.maxAmount*7))
                ReportRDIComparedToTotalIntake.macronutrients.push({
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
    for(const totalMicroNutrients of totalNutrients.micronutrients){
        for(const RDIMicroNutrients of RDI.micronutrients){
            if(totalMicroNutrients.name == RDIMicroNutrients.name){
                const direction = WithInFivePercent(totalMicroNutrients.amount,(RDIMicroNutrients.amount*7))
                ReportRDIComparedToTotalIntake.micronutrients.push({
                    name: totalMicroNutrients.name,
                    unit: totalMicroNutrients.unit,
                    RDI: (RDIMicroNutrients.amount*7).toString(),
                    intake: totalMicroNutrients.amount.toString(),
                    direction: direction
                })
            }
        }
    }

    const startOfWeek = new Date(Startdate)
    let DatesOfWeek: string[] = []

    for(let i: number = 0; i < 7; i++){
        const day = new Date(startOfWeek)
        day.setDate(startOfWeek.getDate() + i)
        DatesOfWeek.push(day.toISOString().split('T')[0])
    }

    let foodLogIds:ReportFoodLogs[] = []

    for( const date of DatesOfWeek){
        let foodLogs:FoodLog[]
        try{
            foodLogs = await GetFoodLogsByDateAndPatientIdFromDatabase(date, patientId, FoodLogDatabaseRepository)
        }
        catch (CustomerError){
            continue
        }
        for(const log of foodLogs){
            foodLogIds.push({
                foodLogId: log.id
            })
        }
    }

    const patient = await GetPatientByIdInDatabase(patientId,PatientDatabaseRepo)

    const report: Report = {
        title: `Report For ${patient.firstName} ${patient.lastName} for the week of ${Startdate}`,
        date: `week of ${Startdate}`,
        patientName: `${patient.firstName} ${patient.lastName}`,
        foodLogs: foodLogIds,
        RDIComparedToTotalIntake: ReportRDIComparedToTotalIntake
    }
    return report
}


export async function GetReportCustomTimePeriodFromDatabase(
    Startdate: string,
    Enddate: string,
    patientId: string, 
    FoodLogDatabaseRepository: Repository<FoodLogEntity>, 
    customFoodDatabaseRepo: Repository<CustomFoodEntity>, 
    PatientDatabaseRepo: Repository<PatientEntity>, 
    PatientConditionDatabaseRepo: Repository<PatientConditionEntity>
): Promise<Report>
{
    const totalNutrients = await GetTotalNutrientsCustomTimePeriodFromDatabase(Startdate,Enddate,patientId,FoodLogDatabaseRepository,customFoodDatabaseRepo)
    const RDI = await CalculateRDI(patientId,PatientDatabaseRepo,PatientConditionDatabaseRepo)

    let ReportRDIComparedToTotalIntake:ReportRDIComparedToTotalIntake = cloneEmptyReportRDIComparedToTotalIntake()

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
    ReportRDIComparedToTotalIntake.energy ={
        name: "energy",
        unit: totalNutrients.EnergyUnit,
        RDI: (RDI.TotalEnergy*amountOfDays).toString(),
        intake: totalNutrients.TotalEnergy.toString(),
        direction: energyDirection
    }

    for(const totalMacroNutrients of totalNutrients.macronutrients){
        for(const RDIMacroNutrients of RDI.macronutrients){
            if(totalMacroNutrients.name == RDIMacroNutrients.name){
                const direction = WithInRange(totalMacroNutrients.amount,(RDIMacroNutrients.minAmount*amountOfDays),(RDIMacroNutrients.maxAmount*amountOfDays))
                ReportRDIComparedToTotalIntake.macronutrients.push({
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
    for(const totalMicroNutrients of totalNutrients.micronutrients){
        for(const RDIMicroNutrients of RDI.micronutrients){
            if(totalMicroNutrients.name == RDIMicroNutrients.name){
                const direction = WithInFivePercent(totalMicroNutrients.amount,(RDIMicroNutrients.amount*amountOfDays))
                ReportRDIComparedToTotalIntake.micronutrients.push({
                    name: totalMicroNutrients.name,
                    unit: totalMicroNutrients.unit,
                    RDI: (RDIMicroNutrients.amount*amountOfDays).toString(),
                    intake: totalMicroNutrients.amount.toString(),
                    direction: direction
                })
            }
        }
    }

    let foodLogIds:ReportFoodLogs[] = []

    for( const date of Dates){
        let foodLogs:FoodLog[]
        try{
            foodLogs = await GetFoodLogsByDateAndPatientIdFromDatabase(date, patientId, FoodLogDatabaseRepository)
        }
        catch (CustomerError){
            continue
        }
        for(const log of foodLogs){
            foodLogIds.push({
                foodLogId: log.id
            })
        }
    }

    const patient = await GetPatientByIdInDatabase(patientId,PatientDatabaseRepo)


    const report: Report = {
        title: `Report For ${patient.firstName} ${patient.lastName} from ${Startdate} to ${Enddate}`,
        date: `${Startdate} to ${Enddate}`,
        patientName: `${patient.firstName} ${patient.lastName}`,
        foodLogs: foodLogIds,
        RDIComparedToTotalIntake: ReportRDIComparedToTotalIntake
    }
    return report
}