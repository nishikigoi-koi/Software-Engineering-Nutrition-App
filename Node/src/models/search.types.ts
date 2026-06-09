import { CustomFoodShort } from "./customFood.types";

export interface FoodFile{
    id: string,
    foodName: string,
    shortName: string,
    description: string | null,
    serving_size: number,
    group: string,
    serving_size_unit: string,
    measure_description: string,
    energy: FoodFileNutrients,
    protein: FoodFileNutrients,
    totalFat: FoodFileNutrients,
    saturatedFat: FoodFileNutrients,
    carbohydrate: FoodFileNutrients,
    sugars: FoodFileNutrients,
    fiber: FoodFileNutrients,
    sodium: FoodFileNutrients
}

export interface FoodFileShort{
    id: string,
    foodName: string,
    shortName: string,
    description: string | null,
    serving_size: number,
    group: string,
    serving_size_unit: string,
    measure_description: string,
}

export interface FoodFileNutrients{
    unit: string,
    qty_per_serving: string,
    percent_RQI: string,
    qty_per_100: string
}

export interface SearchResult{
    foodFile: FoodFileShort[],
    customFood: CustomFoodShort[]
}
