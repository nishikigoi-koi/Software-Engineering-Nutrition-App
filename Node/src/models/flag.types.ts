
export interface Flags{
    energy: {
        name: string,
        unit: string,
        RDI: string,
        intake: string,
        direction: string
    } | null,
    macronutrients: FlagMacroNutrients[],
    micronutrients: FlagMicroNutrients[]
}


export interface FlagMacroNutrients{
    name: string,
    unit: string,
    minRDI: string,
    maxRDI: string,
    intake: string,
    direction: string
}

export interface FlagMicroNutrients{
    name: string,
    unit: string,
    RDI: string,
    intake: string,
    direction: string
}