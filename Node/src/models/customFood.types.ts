
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
    sodium: CustomFoodNutrients
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
    sodium: CustomFoodNutrients
}

export interface CustomFoodNutrients {
    unit: "mg",
    qty_per_serving: "990",
    percent_RQI: "43",
    qty_per_100: "380"
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