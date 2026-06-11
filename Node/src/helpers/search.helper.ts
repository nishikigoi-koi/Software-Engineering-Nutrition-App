import { Repository } from "typeorm";
import { CustomFood, CustomFoodShort } from "../models/customFood.types";
import { FoodFile,FoodFileShort,SearchResult,FoodFileNutrients } from "../models/search.types";
import { CustomFoodEntity } from "../database/entities/customFood.entity";
import { GetCustomFoodByIdFromDatabase } from "./customFood.helper.ts";
import CustomerError from "../models/error.types.ts";
import { UserEntity } from "../database/entities/user.entity";
import { GetUserFromDatabase } from "./user.helper.ts";

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

function mapCustomFoodToShort(customFood:CustomFood):CustomFoodShort{
    return{
        id: customFood.id,
        userId: customFood.userId,
        foodName: customFood.foodName,
        description: customFood.description,
        serving_size: customFood.serving_size,
        group: customFood.group,
        serving_size_unit: customFood.serving_size_unit,
        measure_description: customFood.measure_description
    }
}

function mapQAPIToShortFoodFile(api:any):FoodFileShort{
    return{
        id: api.recordid,
        foodName: api.foodname,
        shortName: api.shortname,
        description: api.description,
        serving_size: api.serving_size_value,
        group: api.group_name,
        serving_size_unit: api.serving_size_unit,
        measure_description: api.serving_or_measure_description
    }
}

function mapAPIToShortFoodFile(api:any):FoodFileShort{
    return{
        id: api._id,
        foodName: api.foodname,
        shortName: api.shortname,
        description: api.description,
        serving_size: api.serving_size,
        group: api.group,
        serving_size_unit: api.serving_size_unit,
        measure_description: api.measure_description
    }
}

function mapAPIToFoodFileNutrients(api:any):FoodFileNutrients{
    return{
        unit: api.unit_abbr.replace(/\s*\/100g/i, ""),
        qty_per_serving: api.amount,
        percent_RQI: api.percent_RDI,
        qty_per_100: api.value
    }
}

function mapFoodFileShortAndFoodFileFoodFileNutrients(foodFileShort:FoodFileShort,foodFileNutrients:FoodFileNutrients[]): FoodFile{
    return{
        id: foodFileShort.id,
        foodName: foodFileShort.foodName,
        shortName: foodFileShort.shortName,
        description: foodFileShort.description,
        serving_size: foodFileShort.serving_size,
        group: foodFileShort.group,
        serving_size_unit: foodFileShort.serving_size_unit,
        measure_description: foodFileShort.measure_description,
        energy: foodFileNutrients[0],
        protein: foodFileNutrients[1],
        totalFat: foodFileNutrients[2],
        saturatedFat: foodFileNutrients[3],
        carbohydrate:foodFileNutrients[4],
        sugars: foodFileNutrients[5],
        fiber: foodFileNutrients[6],
        sodium: foodFileNutrients[7]
    }
}

export async function SearchFoodFileAndCustomInDatabaseAndAPI(searchFor:string,userid: string, customFoodRepo:Repository<CustomFoodEntity>, userRepo:Repository<UserEntity>): Promise<SearchResult>{
    await GetUserFromDatabase(userid,userRepo)

    const foodFileResults = await fetch('https://api.foodcomposition.co.nz/api/food?q='+searchFor)
        .then(response => response.json())
        .then(data => data.map(mapQAPIToShortFoodFile))

    const customFoodSearchResults = await customFoodRepo.createQueryBuilder('customFood')
        .where('customFood.foodName LIKE :searchFor ', {searchFor: `%${searchFor}%`})
        .getMany()
    
    const customFoodResults = customFoodSearchResults.map(mapEntityToCustomFood).map(mapCustomFoodToShort)

    if (!foodFileResults || !customFoodResults)
    {
        throw new CustomerError(400, 'no foods found')
    }

    const searchResult = {
        foodFile: foodFileResults,
        customFood: customFoodResults
    } as SearchResult

    return searchResult
}

export async function SearchGetFoodFileFromAPI(searchFor:string): Promise<FoodFile>{
    const foodFileShortResult = await fetch('https://api.foodcomposition.co.nz/api/food/'+searchFor)
        .then(response => response.json())
        .then(data => mapAPIToShortFoodFile(data))

    const foodFileResultNutrients = await fetch('https://api.foodcomposition.co.nz/api/fiav/food/'+searchFor +'?amount=' +foodFileShortResult.serving_size + '&comp_group_id=1')
        .then(response => response.json())
        .then(data => data.map(mapAPIToFoodFileNutrients))
    
    const result = mapFoodFileShortAndFoodFileFoodFileNutrients(foodFileShortResult,foodFileResultNutrients)
    return result
}

export async function SearchGetCustomFromDatabase(searchFor:string,databaseRepo:Repository<CustomFoodEntity>): Promise<CustomFood>{
    return await GetCustomFoodByIdFromDatabase(searchFor, databaseRepo)
}
