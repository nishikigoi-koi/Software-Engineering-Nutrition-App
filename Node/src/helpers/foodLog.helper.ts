import CustomerError from "../models/error.types.ts";
import { FoodLog, FoodLogDTO } from "../models/foodLog.types.ts";
import { FoodLogEntity } from "../database/entities/foodLog.entity";
import { Repository, Like, And } from "typeorm";

function mapEntityToFoodLog(foodLog:FoodLogEntity): FoodLog{
    return{
        id: foodLog.id,
        patientId: foodLog.patientId,
        FCDBFoodId: foodLog.FCDBFoodId,
        CustomFoodId: foodLog.CustomFoodId,
        dateTime: foodLog.dateTime,
        amount: foodLog.amount,
        unit: foodLog.unit,
        mealType: foodLog.mealType
    }
}

export async function CreateFoodLogInDatabase(foodLogDTO:FoodLogDTO, databaseRepo:Repository<FoodLogEntity>): Promise<FoodLog> {
    const keys = Object.keys(foodLogDTO) as Array<keyof FoodLogDTO>
    for (const key of keys){
        if (key.toString() == 'FCDBFoodId' || key.toString() == 'CustomFoodId'){
            continue
        }
        const val = foodLogDTO[key];
        if (val === undefined || val === null) {
            throw new CustomerError(400, 'All fields are required')
        }
    }

    if((foodLogDTO.FCDBFoodId == null)&&(foodLogDTO.CustomFoodId == null)){
        throw new CustomerError(400, 'FCDBFoodId and CustomFoodId cant both be null')
    }

    if((foodLogDTO.FCDBFoodId != null)&&(foodLogDTO.CustomFoodId != null)){
        throw new CustomerError(400, 'FCDBFoodId and CustomFoodId cant both be defind')
    }

    const foodLogToSave = { ...foodLogDTO }
    const foodLog = await databaseRepo.save(foodLogToSave)
    return mapEntityToFoodLog(foodLog)
}

export async function GetFoodLogByIdFromDatabase(id:string, databaseRepo:Repository<FoodLogEntity>): Promise<FoodLog>{
    const foodLog = await databaseRepo.findOne({
        where: {id: id},
        relations: ['customFood']
    })

    if (!foodLog){
        throw new CustomerError(404, 'food log not found');
    }

    return mapEntityToFoodLog(foodLog)
}


export async function GetFoodLogByPatientIdFromDatabase (id:string, databaseRepo:Repository<FoodLogEntity>): Promise<FoodLog[]>{
        const foodLogs = await databaseRepo.find({
        where: {patientId: id},
        relations: ['customFood']
    })

    if (!foodLogs || foodLogs.length === 0){
        throw new CustomerError(404, 'no food logs found');
    }

    return foodLogs.map(mapEntityToFoodLog)

}

export async function GetFoodLogsByDateAndPatientIdFromDatabase(date:string, id:string, databaseRepo:Repository<FoodLogEntity>): Promise<FoodLog[]>{
    const foodLogs = await databaseRepo.createQueryBuilder('foodLog')
        .where('foodLog.patientId = :id', {id : id})
        .andWhere('foodLog.dateTime LIKE :date ', {date: `%${date}%`})
        .getMany();

    if (!foodLogs || foodLogs.length === 0){
        throw new CustomerError(404, 'no food logs found');
    }

    return foodLogs.map(mapEntityToFoodLog)
}

export async function UpdateFoodLogInDatabase (id:string, foodLogDTO:FoodLogDTO, databaseRepo:Repository<FoodLogEntity>) {
    await GetFoodLogByIdFromDatabase(id,databaseRepo) //check if exist
    await databaseRepo.update(id,foodLogDTO)
}

export async function DeleteFoodLogInDatabase (id:string, databaseRepo:Repository<FoodLogEntity>){
    await GetFoodLogByIdFromDatabase(id,databaseRepo) //check if exist
    await databaseRepo.delete(id)
}

