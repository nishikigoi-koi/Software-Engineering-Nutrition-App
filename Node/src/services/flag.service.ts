import { NextFunction, Request, Response } from 'express';
import { GetFlagsDayFromDatabase, GetFlagsWeekFromDatabase ,GetFlagsCustomTimePeriodFromDatabase} from '../helpers/flag.helper.ts'
import { foodLogRepository ,customFoodRepository, patientRepository, patientConditionRepository} from '../database/repostitories.ts';

export async function GetFlagsDay(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetFlagsDayFromDatabase(req.query.date as string, req.query.patientid as string, foodLogRepository, customFoodRepository ,patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function GetFlagsWeek(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetFlagsWeekFromDatabase(req.query.startdate as string, req.query.patientid as string, foodLogRepository, customFoodRepository,patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function GetFlagsCustomTimePeriod(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetFlagsCustomTimePeriodFromDatabase(req.query.startdate as string, req.query.enddate as string, req.query.patientid as string, foodLogRepository, customFoodRepository,patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}