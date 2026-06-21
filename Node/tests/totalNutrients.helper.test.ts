import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import {FoodLogDTO, FoodLog} from '../src/models/foodLog.types.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { UserDTO,UserDatabaseObject } from '../src/models/user.types.ts';
import { FoodLogEntity} from '../src/database/entities/foodLog.entity.ts';
import { entities } from '../src/database/index.ts';
import { CreateUserInDatabase } from '../src/helpers/user.helper.ts';
import { CreateFoodLogInDatabase, UpdateFoodLogInDatabase, DeleteFoodLogInDatabase, GetFoodLogsByDateAndPatientIdFromDatabase, GetFoodLogByPatientIdFromDatabase, GetFoodLogByIdFromDatabase} from '../src/helpers/foodLog.helper.ts'
import { PatientEntity } from '../src/database/entities/patient.entity.ts';
import {CustomFoodDTO, CustomFood, CustomFoodNutrients, CustomFoodMicroNutrients} from '../src/models/customFood.types.ts';
import { CustomFoodEntity} from '../src/database/entities/customFood.entity.ts';
import { CreateCustomFoodInDatabase, UpdateCustomFoodInDatabase, DeleteCustomFoodInDatabase, GetCustomFoodByUserIdFromDatabase, GetCustomFoodByIdFromDatabase} from '../src/helpers/customFood.helper.ts'
import { CreatePatientInDatabase, GetPatientByIdInDatabase, GetAllPatientsByUserIdInDatabase, UpdatePatientInDatabase, DeletePatientInDatabase} from '../src/helpers/patient.helper.ts';
import { Patient, PatientDTO } from '../src/models/patient.types.ts';
import { CustomFoodMicroNutrientsEntity } from '../src/database/entities/customFoodMicroNutrients.entity.ts';
import {GetTotalNutrientsDayFromDatabase, GetTotalNutrientsWeekFromDatabase ,GetTotalNutrientsCustomTimePeriodFromDatabase} from '../src/helpers/totalNutrients.helper.ts'
import { TotalNutrients } from '../src/models/totalNutrients.types.ts';


describe('totalNutrients.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let patientRepository: Repository<PatientEntity>;
    let foodLogRepository: Repository<FoodLogEntity>;
    let customFoodRepository: Repository<CustomFoodEntity>;
    let customFoodMicroNutrientsRepository: Repository<CustomFoodMicroNutrientsEntity>;

    let user1: UserDatabaseObject;
    let baseCustomFood: CustomFoodDTO;
    let basePatient: PatientDTO;
    let CustomFood1: CustomFood;
    let CustomFood2: CustomFood;
    let patient1: Patient;
    let patient2: Patient;

    let baseTestFoodLogFCDB: FoodLogDTO;
    let baseTestFoodLogCustom: FoodLogDTO;

    let expectedTotalNutrientsFor20260512: TotalNutrients;
    let expectedTotalNutrientsFor20260513: TotalNutrients;

    let expectedTotalNutrientsForweekof20260512: TotalNutrients;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';

        // Create in-memory database (isolated to this test suite)
        dataSource = new DataSource({
            type: 'better-sqlite3',
            database: ':memory:',
            synchronize: true,
            dropSchema: true,
            entities: entities,
        });

        await dataSource.initialize();
        userRepository = dataSource.getRepository(UserEntity);
        patientRepository = dataSource.getRepository(PatientEntity);
        foodLogRepository = dataSource.getRepository(FoodLogEntity);
        customFoodRepository = dataSource.getRepository(CustomFoodEntity);
        customFoodMicroNutrientsRepository = dataSource.getRepository(CustomFoodMicroNutrientsEntity)

        // Create some users for tests
        const user1DTO = {
            username: 'user1',
            password: 'not-used' 
        } as UserDTO;
        user1 = await CreateUserInDatabase(user1DTO, userRepository);

        baseCustomFood = {
            userId : user1.id,
            foodName: "Butter Chicken with rice",
            description: "A curry made from chicken cooked in a spiced tomato and butter-based gravy served with rice",
            serving_size: 350.0,
            group: "Meal",
            serving_size_unit: "g",
            measure_description: "1 bowl",
            energy: {
                unit: "KJ",
                qty_per_serving: "1900",
                percent_RDI: "22",
                qty_per_100: "750"
            } as CustomFoodNutrients,
            protein: {
                unit: "g",
                qty_per_serving: "30",
                percent_RDI: "60",
                qty_per_100: "12"
            } as CustomFoodNutrients,
            totalFat: {
                unit: "g",
                qty_per_serving: "31",
                percent_RDI: "44",
                qty_per_100: "12"
            } as CustomFoodNutrients,
            saturatedFat: {
                unit: "g",
                qty_per_serving: "14",
                percent_RDI: "60",
                qty_per_100: "5.6"
            } as CustomFoodNutrients,
            carbohydrates: {
                unit: "g",
                qty_per_serving: "13",
                percent_RDI: "4",
                qty_per_100: "5.1"
            } as CustomFoodNutrients,
            sugars: {
                unit: "g",
                qty_per_serving: "13",
                percent_RDI: "14",
                qty_per_100: "5.0"
            } as CustomFoodNutrients,
            fiber: {
                unit: "g",
                qty_per_serving: "5.7",
                percent_RDI: "19",
                qty_per_100: "2.2"
            } as CustomFoodNutrients,
            sodium: {
                unit: "mg",
                qty_per_serving: "990",
                percent_RDI: "43",
                qty_per_100: "380"
            } as CustomFoodNutrients,
            microNutrients:[
                {
                    name: "Iron",
                    unit: "mg",
                    qty_per_serving: "4.6",
                    percent_RDI: "38",
                    qty_per_100: "1.8"
                } as CustomFoodMicroNutrients
            ] as CustomFoodMicroNutrients[]
        } as CustomFoodDTO

        basePatient = {
            userId: user1.id,
            firstName: "John",
            lastName: "Doe",
            birthDate: "1990-01-01",
            gender: "Male",
            ethnicity: "Caucasian",
            weight: 70,
            height: 180,
            activityLevel: "Moderate"
        } as PatientDTO

        CustomFood1 = await CreateCustomFoodInDatabase(baseCustomFood, customFoodRepository,customFoodMicroNutrientsRepository);

        const tempCustomeFood2 = {...baseCustomFood};
        tempCustomeFood2.foodName = 'Food number 2';

        CustomFood2 = await CreateCustomFoodInDatabase(tempCustomeFood2, customFoodRepository,customFoodMicroNutrientsRepository);

        patient1 = await CreatePatientInDatabase(basePatient, patientRepository);

        const tempPatient2 = {...basePatient};
        tempPatient2.firstName = 'Jane';
        patient2 = await CreatePatientInDatabase(tempPatient2, patientRepository);

        baseTestFoodLogFCDB = {
            patientId: patient1.id,
            FCDBFoodId: "L1151",
            CustomFoodId: null,
            dateTime: "2026-05-12T23:52:18.000Z",
            amount : 130,
            unit : "g",
            mealType : "snack"
        } as FoodLogDTO

        baseTestFoodLogCustom = {
            patientId: patient1.id,
            FCDBFoodId: null,
            CustomFoodId: CustomFood1.id,
            dateTime: "2026-05-13T23:52:18.000Z",
            amount : 130,
            unit : "g",
            mealType : "snack"
        } as FoodLogDTO

        await CreateFoodLogInDatabase(baseTestFoodLogFCDB, foodLogRepository)
        await CreateFoodLogInDatabase(baseTestFoodLogFCDB, foodLogRepository)

        expectedTotalNutrientsFor20260512 = {
            EnergyUnit: "kj",
            TotalEnergy: 494,
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    amount: 0.52
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    amount: 24.18
                },
                {
                    name: "totalFat",
                    unit: "g",
                    amount: 0.78
                },
                {
                    name: "saturatedFat",
                    unit: "g",
                    amount: 0.06
                },
                {
                    name: "Sodium",
                    unit: "mg",
                    amount: 2.6
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    amount: 10.4
                },
                {
                    name: "Copper",
                    unit: "mg",
                    amount: 0.1
                },
                {
                    name: "Iron",
                    unit: "mg",
                    amount: 0.32
                },
                {
                    name: "Folate",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    amount: 0.52
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    amount: 252.2
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    amount: 10.4
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    amount: 80.6
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    amount: 0.1
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    amount: 23.4
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    amount: 0.18
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    amount: 0.02
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    amount: 5.2
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    amount: 0.08
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    amount: 25.22
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    amount: 0.62
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    amount: 0.06
                }
            ]
        }

        await CreateFoodLogInDatabase(baseTestFoodLogCustom, foodLogRepository)
        await CreateFoodLogInDatabase(baseTestFoodLogCustom, foodLogRepository)

        expectedTotalNutrientsFor20260513 = {
            EnergyUnit: "kj",
            TotalEnergy: 1950,
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    amount: 31.2
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    amount: 13.26
                },
                {
                    name: "totalFat",
                    unit: "g",
                    amount: 31.2
                },
                {
                    name: "saturatedFat",
                    unit: "g",
                    amount: 14.56
                },
                {
                    name: "Sodium",
                    unit: "mg",
                    amount: 988
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Copper",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Iron",
                    unit: "mg",
                    amount: 4.68
                },
                {
                    name: "Folate",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    amount: 0
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    amount: 0
                }
            ]
        }

        expectedTotalNutrientsForweekof20260512 = {
            EnergyUnit: "kj",
            TotalEnergy: 2444,
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    amount: 31.72
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    amount: 37.44
                },
                {
                    name: "totalFat",
                    unit: "g",
                    amount: 31.98
                },
                {
                    name: "saturatedFat",
                    unit: "g",
                    amount: 14.620000000000001
                },
                {
                    name: "Sodium",
                    unit: "mg",
                    amount: 990.6
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    amount: 10.4
                },
                {
                    name: "Copper",
                    unit: "mg",
                    amount: 0.1
                },
                {
                    name: "Iron",
                    unit: "mg",
                    amount: 5
                },
                {
                    name: "Folate",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    amount: 0.52
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    amount: 252.2
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    amount: 10.4
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    amount: 80.6
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    amount: 0.1
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    amount: 23.4
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    amount: 0.18
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    amount: 0.02
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    amount: 5.2
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    amount: 0.08
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    amount: 25.22
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    amount: 0
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    amount: 0.62
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    amount: 0.06
                }
            ]
        }
        
    });
    
    afterAll(async () => {
        // Only destroy this suite's dataSource
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Clear users before each test
        //await foodLogRepository.clear();
    });

    it('GetTotalNutrientsDayFromDatabase throws if no date or patient id is invalid', async () => {
        await expect(GetTotalNutrientsDayFromDatabase('','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsDayFromDatabase('notadate','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsDayFromDatabase('notadate','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsDayFromDatabase('','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
    });

    it('GetTotalNutrientsDayFromDatabase returns correct for foodfile', async () =>{
        const result = await GetTotalNutrientsDayFromDatabase('2026-05-12',patient1.id as string,foodLogRepository,customFoodRepository)

        const keys = Object.keys(result) as Array<keyof TotalNutrients>
        for (const key of keys) {
            const expected = expectedTotalNutrientsFor20260512[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('GetTotalNutrientsDayFromDatabase returns correct for custom food', async () =>{
        const result = await GetTotalNutrientsDayFromDatabase('2026-05-13',patient1.id as string,foodLogRepository,customFoodRepository)

        const keys = Object.keys(result) as Array<keyof TotalNutrients>
        for (const key of keys) {
            const expected = expectedTotalNutrientsFor20260513[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('GetTotalNutrientsWeekFromDatabase throws if no date or patient id is invalid', async () => {
        await expect(GetTotalNutrientsWeekFromDatabase('','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsWeekFromDatabase('notadate','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsWeekFromDatabase('notadate','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsWeekFromDatabase('','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
    });

    it('GetTotalNutrientsDayFromDatabase returns correct for foodfile', async () =>{
        const result = await GetTotalNutrientsWeekFromDatabase('2026-05-12',patient1.id as string,foodLogRepository,customFoodRepository)

        const keys = Object.keys(result) as Array<keyof TotalNutrients>
        for (const key of keys) {
            const expected = expectedTotalNutrientsForweekof20260512[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('GetTotalNutrientsCustomTimePeriodFromDatabase throws if no date or patient id is invalid', async () => {
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('','','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('notadate','','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('notadate','notadate','',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('notadate','notadate','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('notadate','','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('','','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
        await expect(GetTotalNutrientsCustomTimePeriodFromDatabase('','notadate','notinthedatabase',foodLogRepository,customFoodRepository)).rejects.toThrow()
    });

    it('GetTotalNutrientsCustomTimePeriodFromDatabase returns correct for foodfile', async () =>{
        const result = await GetTotalNutrientsCustomTimePeriodFromDatabase('2026-05-12','2026-05-18',patient1.id as string,foodLogRepository,customFoodRepository)

        const keys = Object.keys(result) as Array<keyof TotalNutrients>
        for (const key of keys) {
            const expected = expectedTotalNutrientsForweekof20260512[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })


})