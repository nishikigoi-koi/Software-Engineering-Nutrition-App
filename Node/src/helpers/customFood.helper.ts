import CustomerError from "../models/error.types.ts";
import { CustomFoodEntity } from "../database/entities/customFood.entity.ts";
import { UserEntity } from "../database/entities/user.entity.ts";
import { CustomFood, CustomFoodMicroNutrients } from "../models/customFood.types.ts";
import { CustomFoodDTO } from "../models/customFood.types.ts";
import { Repository } from "typeorm";
import { CustomFoodMicroNutrientsEntity } from "../database/entities/customFoodMicroNutrients.entity.ts";

const MicroNutrientsNames = [
    "Folate",
    "Niacin (vitamin B3)",
    "Pantothenic acid (vitamin B5)",
    "Riboflavin (vitamin B2)",
    "Thiamin (vitamin B1)",
    "Vitamin A, FSANZ",
    "Vitamin B6 (pyridoxal phosphate)",
    "Vitamin B12 (cobalamin)",
    "Vitamin C (ascorbic acid)",
    "Vitamin D",
    "Vitamin E (tocopherols)",
    "Vitamin K",
    "Calcium",
    "Copper",
    "Fluoride",
    "Iodide (iodine)",
    "Iron",
    "Magnesium",
    "Manganese",
    "Phosphorus",
    "Potassium",
    "Selenium",
    "Zinc"
]

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
            percent_RDI: customFood.energy_percent_RDI,
            qty_per_100: customFood.energy_qty_per_100
        },
        protein: {
            unit: customFood.protein_unit,
            qty_per_serving: customFood.protein_qty_per_serving,
            percent_RDI: customFood.protein_percent_RDI,
            qty_per_100: customFood.protein_qty_per_100
        },
        totalFat: {
            unit: customFood.totalFat_unit,
            qty_per_serving: customFood.totalFat_qty_per_serving,
            percent_RDI: customFood.totalFat_percent_RDI,
            qty_per_100: customFood.totalFat_qty_per_100
        },
        saturatedFat: {
            unit: customFood.saturatedFat_unit,
            qty_per_serving: customFood.saturatedFat_qty_per_serving,
            percent_RDI: customFood.saturatedFat_percent_RDI,
            qty_per_100: customFood.saturatedFat_qty_per_100
        },
        carbohydrates: {
            unit: customFood.carbohydrates_unit,
            qty_per_serving: customFood.carbohydrates_qty_per_serving,
            percent_RDI: customFood.carbohydrates_percent_RDI,
            qty_per_100: customFood.carbohydrates_qty_per_100
        },
        sugars: {
            unit: customFood.sugars_unit,
            qty_per_serving: customFood.sugars_qty_per_serving,
            percent_RDI: customFood.sugars_percent_RDI,
            qty_per_100: customFood.sugars_qty_per_100
        },
        fiber: {
            unit: customFood.fiber_unit,
            qty_per_serving: customFood.fiber_qty_per_serving,
            percent_RDI: customFood.fiber_percent_RDI,
            qty_per_100: customFood.fiber_qty_per_100
        },
        sodium: {
            unit: customFood.sodium_unit,
            qty_per_serving: customFood.sodium_qty_per_serving,
            percent_RDI: customFood.sodium_percent_RDI,
            qty_per_100: customFood.sodium_qty_per_100
        },
        microNutrients: customFood.customFoodMicroNutrients.map(mapEntityToCustomFoodMicroNutrients)
    }
}

function mapEntityToCustomFoodMicroNutrients(customFoodMicroNutrients:CustomFoodMicroNutrientsEntity): CustomFoodMicroNutrients{
    return{
        name: customFoodMicroNutrients.name,
        unit: customFoodMicroNutrients.unit,
        qty_per_serving: customFoodMicroNutrients.qty_per_serving,
        percent_RDI: customFoodMicroNutrients.percent_RDI,
        qty_per_100: customFoodMicroNutrients.qty_per_100
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
        energy_percent_RDI: customFood.energy.percent_RDI,
        energy_qty_per_100: customFood.energy.qty_per_100,
        protein_unit: customFood.protein.unit,
        protein_qty_per_serving: customFood.protein.qty_per_serving,
        protein_percent_RDI: customFood.protein.percent_RDI,
        protein_qty_per_100: customFood.protein.qty_per_100,
        totalFat_unit: customFood.totalFat.unit,
        totalFat_qty_per_serving: customFood.totalFat.qty_per_serving,
        totalFat_percent_RDI: customFood.totalFat.percent_RDI,
        totalFat_qty_per_100: customFood.totalFat.qty_per_100,
        saturatedFat_unit: customFood.saturatedFat.unit,
        saturatedFat_qty_per_serving: customFood.saturatedFat.qty_per_serving,
        saturatedFat_percent_RDI: customFood.saturatedFat.percent_RDI,
        saturatedFat_qty_per_100: customFood.saturatedFat.qty_per_100,
        carbohydrates_unit: customFood.carbohydrates.unit,
        carbohydrates_qty_per_serving: customFood.carbohydrates.qty_per_serving,
        carbohydrates_percent_RDI: customFood.carbohydrates.percent_RDI,
        carbohydrates_qty_per_100: customFood.carbohydrates.qty_per_100,
        sugars_unit: customFood.sugars.unit,
        sugars_qty_per_serving: customFood.sugars.qty_per_serving,
        sugars_percent_RDI: customFood.sugars.percent_RDI,
        sugars_qty_per_100: customFood.sugars.qty_per_100,
        fiber_unit: customFood.fiber.unit,
        fiber_qty_per_serving: customFood.fiber.qty_per_serving,
        fiber_percent_RDI: customFood.fiber.percent_RDI,
        fiber_qty_per_100: customFood.fiber.qty_per_100,
        sodium_unit: customFood.sodium.unit,
        sodium_qty_per_serving: customFood.sodium.qty_per_serving,
        sodium_percent_RDI: customFood.sodium.percent_RDI,
        sodium_qty_per_100: customFood.sodium.qty_per_100,
    };
}

function mapCustomFoodMicroNutrientsToCreateEntity(customFoodMicroNutrients:CustomFoodMicroNutrients, customFoodId:string):Partial<CustomFoodMicroNutrientsEntity>{
    return{
        customFoodId:customFoodId,
        name: customFoodMicroNutrients.name,
        unit: customFoodMicroNutrients.unit,
        qty_per_serving: customFoodMicroNutrients.qty_per_serving,
        percent_RDI: customFoodMicroNutrients.percent_RDI,
        qty_per_100: customFoodMicroNutrients.qty_per_100
    }
}

async function CreateCustomFoodMicroNutrientsInDatabase(customFoodDTO:CustomFoodDTO, id: string,customFoodMicroNutrientsDatabaseRepo: Repository<CustomFoodMicroNutrientsEntity>): Promise<void>{
    await Promise.all(
        customFoodDTO.microNutrients.map((microNutrients) =>
            customFoodMicroNutrientsDatabaseRepo.save(
                mapCustomFoodMicroNutrientsToCreateEntity(microNutrients, id)
            )
        )
    );
}

export async function CreateCustomFoodInDatabase(customFoodDTO:CustomFoodDTO, customFoodDatabaseRepo: Repository<CustomFoodEntity>, customFoodMicroNutrientsDatabaseRepo: Repository<CustomFoodMicroNutrientsEntity>): Promise<CustomFood>{
    const keys = Object.keys(customFoodDTO) as Array<keyof CustomFoodDTO>

    for (const key of keys){
        const val = customFoodDTO[key];
        if (key.toString() === "microNutrients"){
            customFoodDTO.microNutrients.forEach((microNutrient) =>{
                if (!MicroNutrientsNames.includes(microNutrient.name)){
                    throw new CustomerError(400, `microNutrient name not valid : ${microNutrient.name}`)
                }
            })
        }
        if (val === undefined || val === null) {
            throw new CustomerError(400, 'All fields are required')
        }
    }

    const incompleatCustomFood = await customFoodDatabaseRepo.save(mapCustomFoodToCreateEntity(customFoodDTO))

    await CreateCustomFoodMicroNutrientsInDatabase(customFoodDTO,incompleatCustomFood.id,customFoodMicroNutrientsDatabaseRepo)

    const customFood = await GetCustomFoodByIdFromDatabase(incompleatCustomFood.id, customFoodDatabaseRepo)
    return customFood
}

export async function GetCustomFoodByUserIdFromDatabase(id: string, databaseRepo: Repository<CustomFoodEntity>): Promise<CustomFood[]> {
    const customFoods = await databaseRepo.find({
        where: { userId: id },
        relations: ['user','customFoodMicroNutrients']
    });
    
    if (!customFoods || customFoods.length === 0) {
        throw new CustomerError(404, 'no customFoods found for this user');
    }
    
    return customFoods.map(mapEntityToCustomFood);
}

export async function GetCustomFoodByIdFromDatabase(id: string, databaseRepo: Repository<CustomFoodEntity>): Promise<CustomFood> {
    const customFood = await databaseRepo.findOne({
        where: {id: id},
        relations: ['user','customFoodMicroNutrients']
    });

    if (!customFood) {
        throw new CustomerError(404, 'customFood not found');
    }
    return mapEntityToCustomFood(customFood)
}

export async function UpdateCustomFoodInDatabase(id: string, customFoodDTO: CustomFoodDTO, customFoodDatabaseRepo: Repository<CustomFoodEntity>, customFoodMicroNutrientsDatabaseRepo: Repository<CustomFoodMicroNutrientsEntity>): Promise<CustomFood> {
    await GetCustomFoodByIdFromDatabase(id, customFoodDatabaseRepo); // check if exist
    const keys = Object.keys(customFoodDTO) as Array<keyof CustomFoodDTO>

    for (const key of keys){
        const val = customFoodDTO[key];
        if (key.toString() === "microNutrients"){
            customFoodDTO.microNutrients.forEach((microNutrient) =>{
                if (!MicroNutrientsNames.includes(microNutrient.name)){
                    throw new CustomerError(400, `microNutrient name not valid : ${microNutrient.name}`)
                }
            })
        }
        if (val === undefined || val === null) {
            throw new CustomerError(400, 'All fields are required')
        }
    }

    const updatedCustomFood = mapCustomFoodToCreateEntity(customFoodDTO);

    const MicroNutrients = await customFoodMicroNutrientsDatabaseRepo.find({
        where: { customFoodId: id }
    })

    var i = 0
    for (const MicroNutrient of MicroNutrients){
        await customFoodMicroNutrientsDatabaseRepo.update(MicroNutrient.id, customFoodDTO.microNutrients[i])
        i++
    }

    await customFoodDatabaseRepo.update(id, updatedCustomFood);
    return GetCustomFoodByIdFromDatabase(id, customFoodDatabaseRepo);
}

export async function DeleteCustomFoodInDatabase(id: string, customFoodDatabaseRepo: Repository<CustomFoodEntity>, customFoodMicroNutrientsDatabaseRepo: Repository<CustomFoodMicroNutrientsEntity>){
    await GetCustomFoodByIdFromDatabase(id, customFoodDatabaseRepo); // check if exist

    const MicroNutrients = await customFoodMicroNutrientsDatabaseRepo.find({
        where: { customFoodId: id }
    })

    await customFoodMicroNutrientsDatabaseRepo.remove(MicroNutrients)

    await customFoodDatabaseRepo.delete(id)
}

