import { Repository } from "typeorm";
import { RDI, RDIMacroNutrients,RDIMicroNutrients } from "../models/RDI.types.ts";
import { PatientEntity } from "../database/entities/patient.entity.ts";
import { GetPatientByIdInDatabase } from "./patient.helper.ts";
import { GetPatientMedicalConditionsFromDatabase } from "./medicalCondition.helper.ts";
import { PatientConditionEntity } from "../database/entities/patientConditions.entity.ts";



function calculateAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDifference = today.getMonth() - birthday.getMonth();

    // If the current month is before the birth month, 
    // or if it's the birth month but the current day is before the birth day,
    // the user hasn't celebrated their birthday yet this year.
    if (
        monthDifference < 0 || 
        (monthDifference === 0 && today.getDate() < birthday.getDate())
    ) {
        age--;
    }

    return age;
}

export async function CalculateRDI(PatientId:string, PatientDatabaseRepo:Repository<PatientEntity>, PatientConditionDatabaseRepo:Repository<PatientConditionEntity>): Promise<RDI>{
    const patient = await GetPatientByIdInDatabase(PatientId,PatientDatabaseRepo)

    let BMR: number = 0

    const birthday = new Date(patient.birthDate)
    const age = calculateAge(birthday)

    //  Mifflin-St Jeor Formula
    BMR = (10*patient.weight)+(6.25*patient.height)-(5*age)

    const gender = patient.gender.toLowerCase()

    let TotalKCal: number = 0
    if (gender == "male"){
        TotalKCal = BMR + 5
    }
    if (gender == "female"){
        TotalKCal = BMR - 161
    }

    const activityLevelMult: Record<string,number> ={
        "Sedentary" : 1.2,
        "Light" : 1.375,
        "Moderate": 1.55,
        "High": 1.725,
        "Extreme": 1.9
    }

    // convert from kcal to kj and multiply by activityLevel
    // kJ = (kcal * activityLevelMult) * 4.184 
    const TotalEnergy: number = Math.round((TotalKCal * activityLevelMult[patient.activityLevel])* 4.184)

        // age : micro nutrients
    const microNutrientsAmountsForMale: Record<number,Record<string,number>> = {
        1 : {"Calcium": 500, "Copper": 0.7, "Iron": 9, "Folate": 150, "Iodide (iodine)": 90, "Potassium": 2000, "Magnesium": 80, "Manganese": 2000, "Niacin (vitamin B3)": 6,
            "Phosphorus": 460, "Riboflavin (vitamin B2)": 0.5, "Selenium": 25, "Thiamin (vitamin B1)": 0.5, "Vitamin A, FSANZ": 300, "Vitamin B12 (cobalamin)": 0.9,
            "Vitamin B6 (pyridoxal phosphate)": 0.5, "Vitamin C (ascorbic acid)": 35, "Vitamin D": 5, "Vitamin E (tocopherols)": 5, "Zinc": 3 
        },
        4 : {"Calcium": 700, "Copper": 1, "Iron": 10, "Folate": 200, "Iodide (iodine)": 90, "Potassium": 2300, "Magnesium": 130, "Manganese": 2500, "Niacin (vitamin B3)": 8,
            "Phosphorus": 500, "Riboflavin (vitamin B2)": 0.6, "Selenium": 30, "Thiamin (vitamin B1)": 0.6, "Vitamin A, FSANZ": 400, "Vitamin B12 (cobalamin)": 1.2,
            "Vitamin B6 (pyridoxal phosphate)": 0.6, "Vitamin C (ascorbic acid)": 35, "Vitamin D": 5, "Vitamin E (tocopherols)": 6, "Zinc": 4
        },
        9 : {"Calcium": 1000, "Copper": 1.3, "Iron": 8, "Folate": 300, "Iodide (iodine)": 120, "Potassium": 3000, "Magnesium": 240, "Manganese": 3000, "Niacin (vitamin B3)": 12,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 0.9, "Selenium": 50, "Thiamin (vitamin B1)": 0.9, "Vitamin A, FSANZ": 600, "Vitamin B12 (cobalamin)": 1.8,
            "Vitamin B6 (pyridoxal phosphate)": 1, "Vitamin C (ascorbic acid)": 40, "Vitamin D": 5, "Vitamin E (tocopherols)": 9, "Zinc": 6
        },
        12 : {"Calcium": 1300, "Copper": 1.3, "Iron": 8, "Folate": 300, "Iodide (iodine)": 120, "Potassium": 3000, "Magnesium": 240, "Manganese": 3000, "Niacin (vitamin B3)": 12,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 0.9, "Selenium": 50, "Thiamin (vitamin B1)": 0.9, "Vitamin A, FSANZ": 600, "Vitamin B12 (cobalamin)": 1.8,
            "Vitamin B6 (pyridoxal phosphate)": 1, "Vitamin C (ascorbic acid)": 40, "Vitamin D": 5, "Vitamin E (tocopherols)": 9, "Zinc": 6
        },
        14 : {"Calcium": 1300, "Copper": 1.5, "Iron": 11, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 3600, "Magnesium": 410, "Manganese": 3500, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 1.3, "Selenium": 70, "Thiamin (vitamin B1)": 1.2, "Vitamin A, FSANZ": 900, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.3, "Vitamin C (ascorbic acid)": 40, "Vitamin D": 5, "Vitamin E (tocopherols)": 10, "Zinc": 13
        },
        19 : {"Calcium": 1000, "Copper": 1.7, "Iron": 8, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 3800, "Magnesium": 400, "Manganese": 5500, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.3, "Selenium": 70, "Thiamin (vitamin B1)": 1.2, "Vitamin A, FSANZ": 900, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.3, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 5, "Vitamin E (tocopherols)": 10, "Zinc": 14
        },
        31 : {"Calcium": 1000, "Copper": 1.7, "Iron": 8, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 3800, "Magnesium": 400, "Manganese": 5500, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.3, "Selenium": 70, "Thiamin (vitamin B1)": 1.2, "Vitamin A, FSANZ": 900, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.3, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 5, "Vitamin E (tocopherols)": 10, "Zinc": 14
        }, 
        51 : {"Calcium": 1000, "Copper": 1.7, "Iron": 8, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 3800, "Magnesium": 400, "Manganese": 5500, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.3, "Selenium": 70, "Thiamin (vitamin B1)": 1.2, "Vitamin A, FSANZ": 900, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.7, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 10, "Vitamin E (tocopherols)": 10, "Zinc": 14
        },
        71 : {"Calcium": 1300, "Copper": 1.7, "Iron": 8, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 3800, "Magnesium": 400, "Manganese": 5500, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.6, "Selenium": 70, "Thiamin (vitamin B1)": 1.2, "Vitamin A, FSANZ": 900, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.7, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 15, "Vitamin E (tocopherols)": 10, "Zinc": 14
        }
    }

    const microNutrientsAmountsForFemale: Record<number,Record<string,number>> = {
        1 : {"Calcium": 500, "Copper": 0.7, "Iron": 9, "Folate": 150, "Iodide (iodine)": 90, "Potassium": 2000, "Magnesium": 80, "Manganese": 2000, "Niacin (vitamin B3)": 6,
            "Phosphorus": 460, "Riboflavin (vitamin B2)": 0.5, "Selenium": 25, "Thiamin (vitamin B1)": 0.5, "Vitamin A, FSANZ": 300, "Vitamin B12 (cobalamin)": 0.9,
            "Vitamin B6 (pyridoxal phosphate)": 0.5, "Vitamin C (ascorbic acid)": 35, "Vitamin D": 5, "Vitamin E (tocopherols)": 5, "Zinc": 3 
        },
        4 : {"Calcium": 700, "Copper": 1, "Iron": 10, "Folate": 200, "Iodide (iodine)": 90, "Potassium": 2300, "Magnesium": 130, "Manganese": 2500, "Niacin (vitamin B3)": 8,
            "Phosphorus": 500, "Riboflavin (vitamin B2)": 0.6, "Selenium": 30, "Thiamin (vitamin B1)": 0.6, "Vitamin A, FSANZ": 400, "Vitamin B12 (cobalamin)": 1.2,
            "Vitamin B6 (pyridoxal phosphate)": 0.6, "Vitamin C (ascorbic acid)": 35, "Vitamin D": 5, "Vitamin E (tocopherols)": 6, "Zinc": 4
        },
        9 : {"Calcium": 1000, "Copper": 1.1, "Iron": 8, "Folate": 300, "Iodide (iodine)": 120, "Potassium": 2500, "Magnesium": 240, "Manganese": 2500, "Niacin (vitamin B3)": 12,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 0.9, "Selenium": 50, "Thiamin (vitamin B1)": 0.9, "Vitamin A, FSANZ": 600, "Vitamin B12 (cobalamin)": 1.8,
            "Vitamin B6 (pyridoxal phosphate)": 1, "Vitamin C (ascorbic acid)": 40, "Vitamin D": 5, "Vitamin E (tocopherols)": 8, "Zinc": 6
        },
        12 : {"Calcium": 1000, "Copper": 1.1, "Iron": 8, "Folate": 300, "Iodide (iodine)": 120, "Potassium": 2500, "Magnesium": 240, "Manganese": 2500, "Niacin (vitamin B3)": 12,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 0.9, "Selenium": 50, "Thiamin (vitamin B1)": 0.9, "Vitamin A, FSANZ": 600, "Vitamin B12 (cobalamin)": 1.8,
            "Vitamin B6 (pyridoxal phosphate)": 1, "Vitamin C (ascorbic acid)": 40, "Vitamin D": 5, "Vitamin E (tocopherols)": 8, "Zinc": 6
        },
        14 : {"Calcium": 1300, "Copper": 1.1, "Iron": 15, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 2600, "Magnesium": 360, "Manganese": 3000, "Niacin (vitamin B3)": 14,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 1.1, "Selenium": 60, "Thiamin (vitamin B1)": 1.1, "Vitamin A, FSANZ": 700, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.2, "Vitamin C (ascorbic acid)": 40, "Vitamin D": 5, "Vitamin E (tocopherols)": 8, "Zinc": 7
        },
        19 : {"Calcium": 1000, "Copper": 1.2, "Iron": 18, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 2800, "Magnesium": 310, "Manganese": 5000, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.1, "Selenium": 60, "Thiamin (vitamin B1)": 1.1, "Vitamin A, FSANZ": 700, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.3, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 5, "Vitamin E (tocopherols)": 7, "Zinc": 8
        },
        31 : {"Calcium": 1000, "Copper": 1.2, "Iron": 18, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 2800, "Magnesium": 320, "Manganese": 5000, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.1, "Selenium": 60, "Thiamin (vitamin B1)": 1.1, "Vitamin A, FSANZ": 700, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.3, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 5, "Vitamin E (tocopherols)": 7, "Zinc": 8
        }, 
        51 : {"Calcium": 1300, "Copper": 1.2, "Iron": 8, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 2800, "Magnesium": 320, "Manganese": 5000, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.1, "Selenium": 60, "Thiamin (vitamin B1)": 1.1, "Vitamin A, FSANZ": 700, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.5, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 10, "Vitamin E (tocopherols)": 7, "Zinc": 8
        },
        71 : {"Calcium": 1300, "Copper": 1.2, "Iron": 8, "Folate": 400, "Iodide (iodine)": 150, "Potassium": 2800, "Magnesium": 320, "Manganese": 5000, "Niacin (vitamin B3)": 16,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.3, "Selenium": 60, "Thiamin (vitamin B1)": 1.1, "Vitamin A, FSANZ": 700, "Vitamin B12 (cobalamin)": 2.4,
            "Vitamin B6 (pyridoxal phosphate)": 1.5, "Vitamin C (ascorbic acid)": 45, "Vitamin D": 15, "Vitamin E (tocopherols)": 7, "Zinc": 8
        }
    }

    const microNutrientsAmountsForFemalePregnent: Record<number,Record<string,number>> = {
        14 : {"Calcium": 1300, "Copper": 1.4, "Iron": 27, "Folate": 600, "Iodide (iodine)": 220, "Potassium": 2800, "Magnesium": 400, "Manganese": 5000, "Niacin (vitamin B3)": 18,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 1.4, "Selenium": 65, "Thiamin (vitamin B1)": 1.4, "Vitamin A, FSANZ": 700, "Vitamin B12 (cobalamin)": 2.6,
            "Vitamin B6 (pyridoxal phosphate)": 1.9, "Vitamin C (ascorbic acid)": 55, "Vitamin D": 5, "Vitamin E (tocopherols)": 8, "Zinc": 10
        },
        19 : {"Calcium": 1000, "Copper": 1.5, "Iron": 27, "Folate": 600, "Iodide (iodine)": 220, "Potassium": 2800, "Magnesium": 350, "Manganese": 5000, "Niacin (vitamin B3)": 18,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.4, "Selenium": 65, "Thiamin (vitamin B1)": 1.4, "Vitamin A, FSANZ": 800, "Vitamin B12 (cobalamin)": 2.6,
            "Vitamin B6 (pyridoxal phosphate)": 1.9, "Vitamin C (ascorbic acid)": 60, "Vitamin D": 5, "Vitamin E (tocopherols)": 7, "Zinc": 11
        },
        31 : {"Calcium": 1000, "Copper": 1.5, "Iron": 27, "Folate": 600, "Iodide (iodine)": 220, "Potassium": 2800, "Magnesium": 360, "Manganese": 5000, "Niacin (vitamin B3)": 18,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.4, "Selenium": 65, "Thiamin (vitamin B1)": 1.4, "Vitamin A, FSANZ": 800, "Vitamin B12 (cobalamin)": 2.6,
            "Vitamin B6 (pyridoxal phosphate)": 1.9, "Vitamin C (ascorbic acid)": 60, "Vitamin D": 5, "Vitamin E (tocopherols)": 7, "Zinc": 11
        }, 
    }

    const microNutrientsAmountsForFemaleLactating: Record<number,Record<string,number>> = {
        14 : {"Calcium": 1300, "Copper": 1.1, "Iron": 10, "Folate": 500, "Iodide (iodine)": 270, "Potassium": 3200, "Magnesium": 360, "Manganese": 5000, "Niacin (vitamin B3)": 17,
            "Phosphorus": 1250, "Riboflavin (vitamin B2)": 1.6, "Selenium": 75, "Thiamin (vitamin B1)": 1.4, "Vitamin A, FSANZ": 1100, "Vitamin B12 (cobalamin)": 2.8,
            "Vitamin B6 (pyridoxal phosphate)": 2, "Vitamin C (ascorbic acid)": 80, "Vitamin D": 5, "Vitamin E (tocopherols)": 12, "Zinc": 11
        },
        19 : {"Calcium": 1000, "Copper": 1.2, "Iron": 9, "Folate": 500, "Iodide (iodine)": 270, "Potassium": 3200, "Magnesium": 310, "Manganese": 5000, "Niacin (vitamin B3)": 17,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.6, "Selenium": 75, "Thiamin (vitamin B1)": 1.4, "Vitamin A, FSANZ": 1100, "Vitamin B12 (cobalamin)": 2.8,
            "Vitamin B6 (pyridoxal phosphate)": 2, "Vitamin C (ascorbic acid)": 85, "Vitamin D": 5, "Vitamin E (tocopherols)": 11, "Zinc": 12
        },
        31 : {"Calcium": 1000, "Copper": 1.2, "Iron": 9, "Folate": 500, "Iodide (iodine)": 270, "Potassium": 3200, "Magnesium": 320, "Manganese": 5000, "Niacin (vitamin B3)": 17,
            "Phosphorus": 1000, "Riboflavin (vitamin B2)": 1.6, "Selenium": 75, "Thiamin (vitamin B1)": 1.4, "Vitamin A, FSANZ": 1100, "Vitamin B12 (cobalamin)": 2.8,
            "Vitamin B6 (pyridoxal phosphate)": 2, "Vitamin C (ascorbic acid)": 85, "Vitamin D": 5, "Vitamin E (tocopherols)": 11, "Zinc": 12
        }, 
    }

    //age group : [min, max]
    const sodiumAmound: Record<number,number[]> ={
        1 : [200,400],
        4 : [300,600],
        9 : [400,800],
        12: [400,800],
        14: [460,920],
        19: [460,920],
        31: [460,920],
        51: [460,920],
        71: [460,920]
    }

    let ageGroup: number = 0
    switch (true) {
        case (age >70 ):
            ageGroup = 71;
            break;
        case (age >50 ):
            ageGroup = 51;
            break;
        case (age >30 ):
            ageGroup = 31;
            break;
        case (age >18 ):
            ageGroup = 19;
            break;
        case (age >13 ):
            ageGroup = 14;
            break;
        case (age >11 ):
            ageGroup = 12;
            break;
        case (age >8 ):
            ageGroup = 9;
            break;
        case (age >3 ):
            ageGroup = 4;
            break;
        case (age >= 1 ):
            ageGroup = 1;
            break;
    }

    let medicalConditionsNames: string[] = []

    const PatientMedicalConditions = await GetPatientMedicalConditionsFromDatabase(patient.id as string, PatientConditionDatabaseRepo)

    PatientMedicalConditions.forEach((Condition) =>{
        medicalConditionsNames.push(Condition.name.toLocaleLowerCase())
    })

    // [min,max]
    const RDISodiumAmount: number[] = sodiumAmound[ageGroup]

    let microNutrientsAmounts: Record<string,number> = {}
    if(gender == "male"){
        microNutrientsAmounts = microNutrientsAmountsForMale[ageGroup]
    } 
    if(gender == "female"){
        
        if (medicalConditionsNames.includes("lactating")){
            microNutrientsAmounts = microNutrientsAmountsForFemaleLactating[ageGroup]
        } else if (medicalConditionsNames.includes("pregnent")){
            microNutrientsAmounts = microNutrientsAmountsForFemalePregnent[ageGroup]
        } else{
            microNutrientsAmounts = microNutrientsAmountsForFemale[ageGroup]
        }
    }

    const macroNutrients: RDIMacroNutrients[] =[
        {
            name: "protein",
            unit: "g",
            minAmount: Math.round(((TotalEnergy * 0.15)/17) *10)/10,
            maxAmount: Math.round(((TotalEnergy * 0.25)/17) *10)/10
        },
        {
            name: "carbohydrates",
            unit: "g",
            minAmount: Math.round(((TotalEnergy * 0.45)/17) *10)/10,
            maxAmount: Math.round(((TotalEnergy * 0.65)/17) *10)/10
        },
        {
            name: "totalFat",
            unit: "g",
            minAmount: Math.round(((TotalEnergy * 0.2)/37) *10)/10,
            maxAmount: Math.round(((TotalEnergy * 0.35)/37) *10)/10
        },
        {
            name: "saturatedFat",
            unit: "g",
            minAmount: 0,
            maxAmount: Math.round(((TotalEnergy * 0.1)/37) *10)/10
        },
        {
            name: "Sodium",
            unit: "mg",
            minAmount: RDISodiumAmount[0],
            maxAmount: RDISodiumAmount[1]
        },
    ]

    const microNutrients: RDIMicroNutrients[] = [
        {
            name: "Calcium",
            unit: "mg",
            amount: microNutrientsAmounts["Calcium"]
        } as RDIMicroNutrients,
        {
            name: "Copper",
            unit: "mg",
            amount: microNutrientsAmounts["Copper"]
        } as RDIMicroNutrients,
        {
            name: "Iron",
            unit: "mg",
            amount: microNutrientsAmounts["Iron"]
        } as RDIMicroNutrients,
        {
            name: "Folate",
            unit: "µg",
            amount: microNutrientsAmounts["Folate"]
        } as RDIMicroNutrients,
        {
            name: "Iodide (iodine)",
            unit: "µg",
            amount: microNutrientsAmounts["Iodide (iodine)"]
        } as RDIMicroNutrients,
        {
            name: "Potassium",
            unit: "mg",
            amount: microNutrientsAmounts["Potassium"]
        } as RDIMicroNutrients,
        {
            name: "Magnesium",
            unit: "mg",
            amount: microNutrientsAmounts["Magnesium"]
        } as RDIMicroNutrients,
        {
            name: "Manganese",
            unit: "µg",
            amount: microNutrientsAmounts["Manganese"]
        } as RDIMicroNutrients,
        {
            name: "Niacin (vitamin B3)",
            unit: "mg",
            amount: microNutrientsAmounts["Niacin (vitamin B3)"]
        } as RDIMicroNutrients,
        {
            name: "Phosphorus",
            unit: "mg",
            amount: microNutrientsAmounts["Phosphorus"]
        } as RDIMicroNutrients,
        {
            name: "Riboflavin (vitamin B2)",
            unit: "mg",
            amount: microNutrientsAmounts["Riboflavin (vitamin B2)"]
        } as RDIMicroNutrients,
        {
            name: "Selenium",
            unit: "µg",
            amount: microNutrientsAmounts["Selenium"]
        } as RDIMicroNutrients,
        {
            name: "Thiamin (vitamin B1)",
            unit: "mg",
            amount: microNutrientsAmounts["Thiamin (vitamin B1)"]
        } as RDIMicroNutrients,
        {
            name: "Vitamin A, FSANZ",
            unit: "µg",
            amount: microNutrientsAmounts["Vitamin A, FSANZ"]
        } as RDIMicroNutrients,
        {
            name: "Vitamin B12 (cobalamin)",
            unit: "µg",
            amount: microNutrientsAmounts["Vitamin B12 (cobalamin)"]
        } as RDIMicroNutrients,
        {
            name: "Vitamin B6 (pyridoxal phosphate)",
            unit: "mg",
            amount: microNutrientsAmounts["Vitamin B6 (pyridoxal phosphate)"]
        } as RDIMicroNutrients,
        {
            name: "Vitamin C (ascorbic acid)",
            unit: "mg",
            amount: microNutrientsAmounts["Vitamin C (ascorbic acid)"]
        } as RDIMicroNutrients,
        {
            name: "Vitamin D",
            unit: "µg",
            amount: microNutrientsAmounts["Vitamin D"]
        } as RDIMicroNutrients,
        {
            name: "Vitamin E (tocopherols)",
            unit: "mg",
            amount: microNutrientsAmounts["Vitamin E (tocopherols)"]
        } as RDIMicroNutrients,
        {
            name: "Zinc",
            unit: "mg",
            amount: microNutrientsAmounts["Zinc"]
        } as RDIMicroNutrients
    ]

    const RDI: RDI = {
        EnergyUnit: "kJ",
        TotalEnergy: TotalEnergy,
        macronutrients: macroNutrients,
        micronutrients: microNutrients
    }

    return RDI
}