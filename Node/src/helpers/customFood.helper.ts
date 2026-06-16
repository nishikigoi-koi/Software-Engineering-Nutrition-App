import CustomerError from "../models/error.types.ts";
import { CustomFoodEntity } from "../database/entities/customFood.entity.ts";
import { UserEntity } from "../database/entities/user.entity.ts";
import { CustomFood } from "../models/customFood.types.ts";
import { CustomFoodDTO } from "../models/customFood.types.ts";
import { Repository } from "typeorm";

function mapEntityToCustomFood(customFood:CustomFoodEntity): CustomFood{
    return{
        id: customFood.id,
        userId: customFood.userId ?? (customFood.user as any)?.id,
        foodName: customFood.foodName,
        description: customFood.description,
        serving_size: customFood.serving_size,
        group: customFood.group,
        serving_size_unit: customFood.serving_size_unit,
        measure_description: customFood.measure_description,
        energy: {
            unit: customFood.energy_unit,
            qty_per_serving: customFood.energy_qty_per_serving,
            percent_RQI: customFood.energy_percent_RQI,
            qty_per_100: customFood.energy_qty_per_100
        },
        protein: {
            unit: customFood.protein_unit,
            qty_per_serving: customFood.protein_qty_per_serving,
            percent_RQI: customFood.protein_percent_RQI,
            qty_per_100: customFood.protein_qty_per_100
        },
        totalFat: {
            unit: customFood.totalFat_unit,
            qty_per_serving: customFood.totalFat_qty_per_serving,
            percent_RQI: customFood.totalFat_percent_RQI,
            qty_per_100: customFood.totalFat_qty_per_100
        },
        saturatedFat: {
            unit: customFood.saturatedFat_unit,
            qty_per_serving: customFood.saturatedFat_qty_per_serving,
            percent_RQI: customFood.saturatedFat_percent_RQI,
            qty_per_100: customFood.saturatedFat_qty_per_100
        },
        carbohydrate: {
            unit: customFood.carbohydrate_unit,
            qty_per_serving: customFood.carbohydrate_qty_per_serving,
            percent_RQI: customFood.carbohydrate_percent_RQI,
            qty_per_100: customFood.carbohydrate_qty_per_100
        },
        sugars: {
            unit: customFood.sugars_unit,
            qty_per_serving: customFood.sugars_qty_per_serving,
            percent_RQI: customFood.sugars_percent_RQI,
            qty_per_100: customFood.sugars_qty_per_100
        },
        fiber: {
            unit: customFood.fiber_unit,
            qty_per_serving: customFood.fiber_qty_per_serving,
            percent_RQI: customFood.fiber_percent_RQI,
            qty_per_100: customFood.fiber_qty_per_100
        },
        sodium: {
            unit: customFood.sodium_unit,
            qty_per_serving: customFood.sodium_qty_per_serving,
            percent_RQI: customFood.sodium_percent_RQI,
            qty_per_100: customFood.sodium_qty_per_100
        }
    }
}

function mapCustomFoodToCreateEntity(customFood: CustomFoodDTO): Partial<CustomFoodEntity> {
    return {
        userId: String(customFood.userId),
        foodName: customFood.foodName,
        description: customFood.description,
        serving_size: customFood.serving_size,
        group: customFood.group,
        serving_size_unit: customFood.serving_size_unit,
        measure_description: customFood.measure_description,
        energy_unit: customFood.energy.unit,
        energy_qty_per_serving: customFood.energy.qty_per_serving,
        energy_percent_RQI: customFood.energy.percent_RQI,
        energy_qty_per_100: customFood.energy.qty_per_100,
        protein_unit: customFood.protein.unit,
        protein_qty_per_serving: customFood.protein.qty_per_serving,
        protein_percent_RQI: customFood.protein.percent_RQI,
        protein_qty_per_100: customFood.protein.qty_per_100,
        totalFat_unit: customFood.totalFat.unit,
        totalFat_qty_per_serving: customFood.totalFat.qty_per_serving,
        totalFat_percent_RQI: customFood.totalFat.percent_RQI,
        totalFat_qty_per_100: customFood.totalFat.qty_per_100,
        saturatedFat_unit: customFood.saturatedFat.unit,
        saturatedFat_qty_per_serving: customFood.saturatedFat.qty_per_serving,
        saturatedFat_percent_RQI: customFood.saturatedFat.percent_RQI,
        saturatedFat_qty_per_100: customFood.saturatedFat.qty_per_100,
        carbohydrate_unit: customFood.carbohydrate.unit,
        carbohydrate_qty_per_serving: customFood.carbohydrate.qty_per_serving,
        carbohydrate_percent_RQI: customFood.carbohydrate.percent_RQI,
        carbohydrate_qty_per_100: customFood.carbohydrate.qty_per_100,
        sugars_unit: customFood.sugars.unit,
        sugars_qty_per_serving: customFood.sugars.qty_per_serving,
        sugars_percent_RQI: customFood.sugars.percent_RQI,
        sugars_qty_per_100: customFood.sugars.qty_per_100,
        fiber_unit: customFood.fiber.unit,
        fiber_qty_per_serving: customFood.fiber.qty_per_serving,
        fiber_percent_RQI: customFood.fiber.percent_RQI,
        fiber_qty_per_100: customFood.fiber.qty_per_100,
        sodium_unit: customFood.sodium.unit,
        sodium_qty_per_serving: customFood.sodium.qty_per_serving,
        sodium_percent_RQI: customFood.sodium.percent_RQI,
        sodium_qty_per_100: customFood.sodium.qty_per_100,
    };
}

export async function CreateCustomFoodInDatabase(customFoodDTO:CustomFoodDTO, databaseRepo: Repository<CustomFoodEntity>): Promise<CustomFood>{
    const keys = Object.keys(customFoodDTO) as Array<keyof CustomFoodDTO>

    for (const key of keys){
        const val = customFoodDTO[key];
        if (val === undefined || val === null) {
            throw new CustomerError(400, 'All fields are required')
        }
    }

    const customFood = await databaseRepo.save(mapCustomFoodToCreateEntity(customFoodDTO))
    return mapEntityToCustomFood(customFood)
}

export async function GetCustomFoodByUserIdFromDatabase(id: string, databaseRepo: Repository<CustomFoodEntity>): Promise<CustomFood[]> {
    const customFoods = await databaseRepo.find({
        where: { userId: id }
    });
    
    if (!customFoods || customFoods.length === 0) {
        throw new CustomerError(404, 'no customFoods found for this user');
    }
    
    return customFoods.map(mapEntityToCustomFood);
}

export async function GetCustomFoodByIdFromDatabase(id: string, databaseRepo: Repository<CustomFoodEntity>): Promise<CustomFood> {
    const customFood = await databaseRepo.findOne({
        where: {id: id},
        relations: ['user']
    });

    if (!customFood) {
        throw new CustomerError(404, 'customFood not found');
    }

    return mapEntityToCustomFood(customFood)
}

export async function UpdateCustomFoodInDatabase(id: string, customFoodDTO: CustomFoodDTO, databaseRepo: Repository<CustomFoodEntity>): Promise<CustomFood> {
    await GetCustomFoodByIdFromDatabase(id, databaseRepo); // check if exist

    const updatedCustomFood = mapCustomFoodToCreateEntity(customFoodDTO);

    await databaseRepo.update(id, updatedCustomFood);
    return GetCustomFoodByIdFromDatabase(id, databaseRepo);
}

export async function DeleteCustomFoodInDatabase(id: string, databaseRepo: Repository<CustomFoodEntity>){
    await GetCustomFoodByIdFromDatabase(id, databaseRepo); // check if exist
    await databaseRepo.delete(id)
}

