import { NextFunction, Request, Response } from 'express';
import { customFoodRepository } from '../database/repostitories.ts';
import { CreateCustomFoodInDatabase, DeleteCustomFoodInDatabase, GetCustomFoodByIdFromDatabase, GetCustomFoodByUserIdFromDatabase, UpdateCustomFoodInDatabase } from '../helpers/customFood.helper.ts';
import { CustomFoodDTO } from '../models/customFood.types.ts';

export async function CreateCustomeFood(req: Request, res: Response, next: NextFunction){
    try{
        const customFood = await CreateCustomFoodInDatabase(req.body as CustomFoodDTO, customFoodRepository)
        res.status(200).json(customFood)
    } catch(error){
        console.log('\n \n service problme \n \n')
        next(error)
    }
}

export async function GetCustomFoodByUserId(req: Request, res: Response, next: NextFunction){
    try{
        const customFood = await GetCustomFoodByUserIdFromDatabase(req.params.id as string, customFoodRepository)
        res.status(200).json(customFood)
    } catch(error){
        next(error)
    }
}

export async function GetCustomFoodById(req: Request, res: Response, next: NextFunction){
    try{
        const customFood = await GetCustomFoodByIdFromDatabase(req.params.id as string, customFoodRepository)
        res.status(200).json(customFood)
    } catch(error){
        next(error)
    }
}

export async function UpdateCustomFood(req: Request, res: Response, next: NextFunction){
    try{
        await UpdateCustomFoodInDatabase(req.params.id as string, req.body as CustomFoodDTO, customFoodRepository)
        res.status(200).json({message: 'Custom food item updated successfully'})
    } catch(error){
        next(error)
    }
}

export async function DeleteCustomFood(req: Request, res: Response, next: NextFunction){
    try{
        await DeleteCustomFoodInDatabase(req.params.id as string, customFoodRepository)
        res.status(204)
    } catch(error){
        next(error)
    }
}