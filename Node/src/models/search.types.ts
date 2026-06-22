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
    carbohydrates: FoodFileNutrients,
    sugars: FoodFileNutrients,
    fiber: FoodFileNutrients,
    sodium: FoodFileNutrients,
    microNutrients: FoodFileMicroNutrients[]
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
    percent_RDI: string,
    qty_per_100: string
}

export interface FoodFileMicroNutrients {
    name: string,
    unit: string,
    qty_per_serving: string,
    percent_RDI: string | undefined,
    qty_per_100: string
}

export interface SearchResult{
    foodFile: FoodFileShort[],
    customFood: CustomFoodShort[] 
}
