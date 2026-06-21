import { NextFunction, Request, Response } from 'express';
import { GetReportDayFromDatabase, GetReportWeekFromDatabase,GetReportCustomTimePeriodFromDatabase} from '../helpers/report.helper.ts'
import { foodLogRepository ,customFoodRepository, patientRepository, patientConditionRepository} from '../database/repostitories.ts';

export async function GetReportDay(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetReportDayFromDatabase(req.query.date as string, req.query.patientid as string, foodLogRepository, customFoodRepository ,patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function GetReportWeek(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetReportWeekFromDatabase(req.query.startdate as string, req.query.patientid as string, foodLogRepository, customFoodRepository,patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function GetReportCustomTimePeriod(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetReportCustomTimePeriodFromDatabase(req.query.startdate as string, req.query.enddate as string, req.query.patientid as string, foodLogRepository, customFoodRepository,patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}