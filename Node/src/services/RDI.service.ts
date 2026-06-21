import { NextFunction, Request, Response } from 'express';
import { CalculateRDI } from '../helpers/RDI.helper.ts';
import { patientRepository, patientConditionRepository } from '../database/repostitories.ts';

export async function RDICalculator(req:Request, res:Response, next: NextFunction) {
    try{
        const result = await CalculateRDI(req.params.id as string, patientRepository, patientConditionRepository)
        res.status(200).json(result)
    } catch(error){
        next(error)
    }
}