import { NextFunction, Request, Response } from 'express';
import { SearchFoodFileAndCustomInDatabaseAndAPI, SearchGetCustomFromDatabase, SearchGetFoodFileFromAPI } from '../helpers/search.helper.ts';
import { customFoodRepository, userRepository } from '../database/repostitories.ts';


export async function SearchFoodFileAndCustom(req:Request, res:Response, next: NextFunction) {
    try{
        const result = await SearchFoodFileAndCustomInDatabaseAndAPI(req.query.foodname as string, req.query.userid as string, customFoodRepository, userRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
    
}
export async function SearchGetFoodFile(req:Request, res:Response, next: NextFunction) {
    try{
        const result = await SearchGetFoodFileFromAPI(req.params.id as string)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}

export async function SearchGetCustom(req:Request, res:Response, next: NextFunction){
    try{
        const result = await SearchGetCustomFromDatabase(req.params.id as string, customFoodRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}




SearchFoodFileAndCustomInDatabaseAndAPI

SearchGetFoodFileFromAPI

SearchGetCustomFromDatabase