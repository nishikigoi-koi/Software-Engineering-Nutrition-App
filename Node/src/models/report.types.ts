export interface Report{
    title: string,
    date: string,
    patientName: string,
    foodLogs: ReportFoodLogs[],
    RDIComparedToTotalIntake: ReportRDIComparedToTotalIntake
}

export interface ReportFoodLogs{
    foodLogId: string
}

export interface ReportRDIComparedToTotalIntake{
    energy: {
        name: string,
        unit: string,
        RDI: string,
        intake: string,
        direction: string
    } | null,
    macronutrients: ReportMacroNutrients[],
    micronutrients: ReportMicroNutrients[]
}

export interface ReportMacroNutrients{
    name: string,
    unit: string,
    minRDI: string,
    maxRDI: string,
    intake: string,
    direction: string
}

export interface ReportMicroNutrients{
    name: string,
    unit: string,
    RDI: string,
    intake: string,
    direction: string
}