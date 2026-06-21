
export interface RDI{
    EnergyUnit: string,
    TotalEnergy: number,
    macronutrients: RDIMacroNutrients[],
    micronutrients: RDIMicroNutrients[]
}

export interface RDIMacroNutrients{
    name: string,
    unit: string,
    minAmount: number,
    maxAmount: number
}

export interface RDIMicroNutrients{
    name: string,
    unit: string,
    amount: number
}