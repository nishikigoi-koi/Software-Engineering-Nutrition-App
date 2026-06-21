
export interface TotalNutrients{
    EnergyUnit: string,
    TotalEnergy: number,
    macronutrients: TotalMacroNutrients[],
    micronutrients: TotalMicroNutrients[]
}

export interface TotalMacroNutrients{
    name: string,
    unit: string,
    amount: number
}

export interface TotalMicroNutrients{
    name: string,
    unit: string,
    amount: number
}