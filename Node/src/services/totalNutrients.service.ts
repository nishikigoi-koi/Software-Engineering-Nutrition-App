import { NextFunction, Request, Response } from 'express';
import {GetTotalNutrientsDayFromDatabase ,GetTotalNutrientsWeekFromDatabase, GetTotalNutrientsCustomTimePeriodFromDatabase} from '../helpers/totalNutrients.helper.ts'
import { foodLogRepository ,customFoodRepository} from '../database/repostitories.ts';

export async function GetTotalNutrientsDay(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetTotalNutrientsDayFromDatabase(req.query.date as string, req.query.patientid as string, foodLogRepository, customFoodRepository )
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function GetTotalNutrientsWeek(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetTotalNutrientsWeekFromDatabase(req.query.startdate as string, req.query.patientid as string, foodLogRepository, customFoodRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function GetTotalNutrientsCustomTimePeriod(req:Request, res:Response, next: NextFunction){
    try{
        const result = await GetTotalNutrientsCustomTimePeriodFromDatabase(req.query.startdate as string, req.query.enddate as string, req.query.patientid as string, foodLogRepository, customFoodRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}