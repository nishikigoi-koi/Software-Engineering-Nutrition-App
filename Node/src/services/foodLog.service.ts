import { NextFunction, Request, Response } from 'express';
import { CreateFoodLogInDatabase, DeleteFoodLogInDatabase, GetFoodLogByIdFromDatabase, GetFoodLogByPatientIdFromDatabase, GetFoodLogsByDateAndPatientIdFromDatabase, UpdateFoodLogInDatabase } from '../helpers/foodLog.helper.ts';
import { FoodLogDTO } from '../models/foodLog.types.ts';
import { foodLogRepository } from '../database/repostitories.ts';

export async function CreateFoodLog(req: Request, res: Response , next :NextFunction){
    try{
        const foodLog = await CreateFoodLogInDatabase(req.body as FoodLogDTO, foodLogRepository)
        res.status(200).json(foodLog)
    } catch (error){
        next(error)
    }
}

export async function GetFoodLogByID(req: Request, res: Response , next :NextFunction){
    try{
        const foodLog = await GetFoodLogByIdFromDatabase(req.params.id as string, foodLogRepository)
        res.status(200).json(foodLog)
    } catch (error){
        next(error)
    }
}

export async function GetFoodLogByPatientId(req: Request, res: Response , next :NextFunction){
    try{
        const foodLogs = await GetFoodLogByPatientIdFromDatabase(req.params.id as string, foodLogRepository)
        res.status(200).json(foodLogs)
    } catch (error){
        next(error)
    }
}

export async function GetFoodLogByDateAndPatientId(req: Request, res: Response , next :NextFunction){
    try{
        const foodLogs = await GetFoodLogsByDateAndPatientIdFromDatabase(req.query.date as string,req.query.patientid as string, foodLogRepository)
        res.status(200).json(foodLogs)
    } catch (error){
        next(error)
    }
}

export async function UpdateFoodLog(req: Request, res: Response , next :NextFunction){
    try{
        await UpdateFoodLogInDatabase(req.params.id as string, req.body as FoodLogDTO, foodLogRepository)
        res.status(200).json({ message: 'Food log updated successfully'})
    } catch (error){
        next(error)
    }
}

export async function DeleteFoodLog(req: Request, res: Response , next :NextFunction){
    try{
        await DeleteFoodLogInDatabase(req.params.id as string, foodLogRepository)
        res.status(204).send()
    } catch (error){
        next(error)
    }
}
