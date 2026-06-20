
export interface CustomFood {
    id: string,
    userId : string,
    foodName: string,
    description: string,
    serving_size: number,
    group: string,
    serving_size_unit: string,
    measure_description: string,
    energy: CustomFoodNutrients,
    protein: CustomFoodNutrients,
    totalFat: CustomFoodNutrients,
    saturatedFat: CustomFoodNutrients,
    carbohydrate: CustomFoodNutrients,
    sugars: CustomFoodNutrients,
    fiber: CustomFoodNutrients,
    sodium: CustomFoodNutrients,
    microNutrients: CustomFoodMicroNutrients[]
}

export interface CustomFoodDTO {
    userId : string,
    foodName: string,
    description: string,
    serving_size: number,
    group: string,
    serving_size_unit: string,
    measure_description: string,
    energy: CustomFoodNutrients,
    protein: CustomFoodNutrients,
    totalFat: CustomFoodNutrients,
    saturatedFat: CustomFoodNutrients,
    carbohydrate: CustomFoodNutrients,
    sugars: CustomFoodNutrients,
    fiber: CustomFoodNutrients,
    sodium: CustomFoodNutrients,
    microNutrients: CustomFoodMicroNutrients[]
}

export interface CustomFoodNutrients {
    unit: string,
    qty_per_serving: string,
    percent_RDI: string,
    qty_per_100: string
}

export interface CustomFoodMicroNutrients {
    name: string,
    unit: string,
    qty_per_serving: string,
    percent_RDI: string,
    qty_per_100: string
}

export interface CustomFoodShort {
    id: string,
    userId : string,
    foodName: string,
    description: string,
    serving_size: number,
    group: string,
    serving_size_unit: string,
    measure_description: string
}