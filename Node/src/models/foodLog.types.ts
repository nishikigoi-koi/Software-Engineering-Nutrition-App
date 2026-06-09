
export interface FoodLog {
    id: string,
    patientId: string,
    FCDBFoodId: string,
    CustomFoodId: string,
    dateTime: string,
    amount : number,
    unit : string,
    mealType : string

}

export interface FoodLogDTO {
    patientId: string,
    FCDBFoodId: string,
    CustomFoodId: string,
    dateTime: string,
    amount : number,
    unit : string,
    mealType : string
}