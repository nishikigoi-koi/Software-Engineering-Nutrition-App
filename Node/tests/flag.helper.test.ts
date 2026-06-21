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
import { GetFlagsDayFromDatabase, GetFlagsWeekFromDatabase,GetFlagsCustomTimePeriodFromDatabase} from '../src/helpers/flag.helper.ts'
import { TotalNutrients } from '../src/models/totalNutrients.types.ts';
import { Flags } from '../src/models/flag.types.ts';
import { PatientConditionEntity } from '../src/database/entities/patientConditions.entity.ts';
import { MedicalConditionEntity } from '../src/database/entities/medicalCondition.entity.ts';


describe('flag.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let patientRepository: Repository<PatientEntity>;
    let foodLogRepository: Repository<FoodLogEntity>;
    let customFoodRepository: Repository<CustomFoodEntity>;
    let customFoodMicroNutrientsRepository: Repository<CustomFoodMicroNutrientsEntity>;
    let patientConditionRepository: Repository<PatientConditionEntity>
    let medicalConditionRepository: Repository<MedicalConditionEntity>

    let user1: UserDatabaseObject;
    let baseCustomFood: CustomFoodDTO;
    let basePatient: PatientDTO;
    let CustomFood1: CustomFood;
    let CustomFood2: CustomFood;
    let patient1: Patient;
    let patient2: Patient;

    let baseTestFoodLogFCDB: FoodLogDTO;
    let baseTestFoodLogCustom: FoodLogDTO;

    let expectedFlagsFor20260512: Flags;
    let expectedFlagsFor20260513: Flags;

    let expectedFlagsForweekof20260512: Flags;

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
        patientConditionRepository = dataSource.getRepository(PatientConditionEntity);
        medicalConditionRepository = dataSource.getRepository(MedicalConditionEntity);

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

        expectedFlagsFor20260512 = {
            energy: {
                name: "energy",
                unit: "kj",
                RDI: "10701",
                intake: "494",
                direction: "below"
            },
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    minRDI: "94.4",
                    maxRDI: "157.4",
                    intake: "0.52",
                    direction: "below"
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    minRDI: "283.3",
                    maxRDI: "409.2",
                    intake: "24.18",
                    direction: "below"
                },
                {
                    name: "totalFat",
                    unit: "g",
                    minRDI: "57.8",
                    maxRDI: "101.2",
                    intake: "0.78",
                    direction: "below"
                },
                {
                    name: "Sodium",
                    unit: "mg",
                    minRDI: "460",
                    maxRDI: "920",
                    intake: "2.6",
                    direction: "below"
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    RDI: "1000",
                    intake: "10.4",
                    direction: "below"
                },
                {
                    name: "Copper",
                    unit: "mg",
                    RDI: "1.7",
                    intake: "0.1",
                    direction: "below"
                },
                {
                    name: "Iron",
                    unit: "mg",
                    RDI: "8",
                    intake: "0.32",
                    direction: "below"
                },
                {
                    name: "Folate",
                    unit: "µg",
                    RDI: "400",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    RDI: "150",
                    intake: "0.52",
                    direction: "below"
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    RDI: "3800",
                    intake: "252.2",
                    direction: "below"
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    RDI: "400",
                    intake: "10.4",
                    direction: "below"
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    RDI: "5500",
                    intake: "80.6",
                    direction: "below"
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    RDI: "16",
                    intake: "0.1",
                    direction: "below"
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    RDI: "1000",
                    intake: "23.4",
                    direction: "below"
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    RDI: "1.3",
                    intake: "0.18",
                    direction: "below"
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    RDI: "70",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    RDI: "1.2",
                    intake: "0.02",
                    direction: "below"
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    RDI: "900",
                    intake: "5.2",
                    direction: "below"
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    RDI: "2.4",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    RDI: "1.3",
                    intake: "0.08",
                    direction: "below"
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    RDI: "45",
                    intake: "25.22",
                    direction: "below"
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    RDI: "5",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    RDI: "10",
                    intake: "0.62",
                    direction: "below"
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    RDI: "14",
                    intake: "0.06",
                    direction: "below"
                }
            ]
        }

        await CreateFoodLogInDatabase(baseTestFoodLogCustom, foodLogRepository)
        await CreateFoodLogInDatabase(baseTestFoodLogCustom, foodLogRepository)

        expectedFlagsFor20260513 = {
            energy: {
                name: "energy",
                unit: "kj",
                RDI: "10701",
                intake: "1950",
                direction: "below"
            },
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    minRDI: "94.4",
                    maxRDI: "157.4",
                    intake: "31.2",
                    direction: "below"
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    minRDI: "283.3",
                    maxRDI: "409.2",
                    intake: "13.26",
                    direction: "below"
                },
                {
                    name: "totalFat",
                    unit: "g",
                    minRDI: "57.8",
                    maxRDI: "101.2",
                    intake: "31.2",
                    direction: "below"
                },
                {
                    name: "Sodium",
                    unit: "mg",
                    minRDI: "460",
                    maxRDI: "920",
                    intake: "988",
                    direction: "above"
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    RDI: "1000",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Copper",
                    unit: "mg",
                    RDI: "1.7",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Iron",
                    unit: "mg",
                    RDI: "8",
                    intake: "4.68",
                    direction: "below"
                },
                {
                    name: "Folate",
                    unit: "µg",
                    RDI: "400",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    RDI: "150",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    RDI: "3800",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    RDI: "400",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    RDI: "5500",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    RDI: "16",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    RDI: "1000",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    RDI: "1.3",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    RDI: "70",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    RDI: "1.2",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    RDI: "900",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    RDI: "2.4",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    RDI: "1.3",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    RDI: "45",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    RDI: "5",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    RDI: "10",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    RDI: "14",
                    intake: "0",
                    direction: "below"
                }
            ]
        }

        expectedFlagsForweekof20260512 = {
            energy: {
                name: "energy",
                unit: "kj",
                RDI: "74907",
                intake: "2444",
                direction: "below"
            },
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    minRDI: "660.8000000000001",
                    maxRDI: "1101.8",
                    intake: "31.72",
                    direction: "below"
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    minRDI: "1983.1000000000001",
                    maxRDI: "2864.4",
                    intake: "37.44",
                    direction: "below"
                },
                {
                    name: "totalFat",
                    unit: "g",
                    minRDI: "404.59999999999997",
                    maxRDI: "708.4",
                    intake: "31.98",
                    direction: "below"
                },
                {
                    name: "Sodium",
                    unit: "mg",
                    minRDI: "3220",
                    maxRDI: "6440",
                    intake: "990.6",
                    direction: "below"
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    RDI: "7000",
                    intake: "10.4",
                    direction: "below"
                },
                {
                    name: "Copper",
                    unit: "mg",
                    RDI: "11.9",
                    intake: "0.1",
                    direction: "below"
                },
                {
                    name: "Iron",
                    unit: "mg",
                    RDI: "56",
                    intake: "5",
                    direction: "below"
                },
                {
                    name: "Folate",
                    unit: "µg",
                    RDI: "2800",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    RDI: "1050",
                    intake: "0.52",
                    direction: "below"
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    RDI: "26600",
                    intake: "252.2",
                    direction: "below"
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    RDI: "2800",
                    intake: "10.4",
                    direction: "below"
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    RDI: "38500",
                    intake: "80.6",
                    direction: "below"
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    RDI: "112",
                    intake: "0.1",
                    direction: "below"
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    RDI: "7000",
                    intake: "23.4",
                    direction: "below"
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    RDI: "9.1",
                    intake: "0.18",
                    direction: "below"
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    RDI: "490",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    RDI: "8.4",
                    intake: "0.02",
                    direction: "below"
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    RDI: "6300",
                    intake: "5.2",
                    direction: "below"
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    RDI: "16.8",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    RDI: "9.1",
                    intake: "0.08",
                    direction: "below"
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    RDI: "315",
                    intake: "25.22",
                    direction: "below"
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    RDI: "35",
                    intake: "0",
                    direction: "below"
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    RDI: "70",
                    intake: "0.62",
                    direction: "below"
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    RDI: "98",
                    intake: "0.06",
                    direction: "below"
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

    it('GetFlagsDayFromDatabase throws if no date or patient id is invalid', async () => {
            await expect(GetFlagsDayFromDatabase('','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
            await expect(GetFlagsDayFromDatabase('notadate','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
            await expect(GetFlagsDayFromDatabase('notadate','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
            await expect(GetFlagsDayFromDatabase('','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        });

    it('GetFlagsDayFromDatabase returns correct for foodfile', async () =>{
        const result = await GetFlagsDayFromDatabase('2026-05-12',patient1.id as string,foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof Flags>
        for (const key of keys) {
            const expected = expectedFlagsFor20260512[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('GetFlagsDayFromDatabase returns correct for custom food', async () =>{
        const result = await GetFlagsDayFromDatabase('2026-05-13',patient1.id as string,foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof Flags>
        for (const key of keys) {
            const expected = expectedFlagsFor20260513[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('GetFlagsWeekFromDatabase throws if no date or patient id is invalid', async () => {
        await expect(GetFlagsWeekFromDatabase('','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsWeekFromDatabase('notadate','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsWeekFromDatabase('notadate','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsWeekFromDatabase('','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
    });

    it('GetFlagsWeekFromDatabase returns correct for foodfile', async () =>{
        const result = await GetFlagsWeekFromDatabase('2026-05-12',patient1.id as string,foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof Flags>
        for (const key of keys) {
            const expected = expectedFlagsForweekof20260512[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('GetFlagsCustomTimePeriodFromDatabase throws if no date or patient id is invalid', async () => {
        await expect(GetFlagsCustomTimePeriodFromDatabase('','','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsCustomTimePeriodFromDatabase('notadate','','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsCustomTimePeriodFromDatabase('notadate','notadate','',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsCustomTimePeriodFromDatabase('notadate','notadate','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsCustomTimePeriodFromDatabase('notadate','','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsCustomTimePeriodFromDatabase('','','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(GetFlagsCustomTimePeriodFromDatabase('','notadate','notinthedatabase',foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)).rejects.toThrow()
    });

    it('GetFlagsCustomTimePeriodFromDatabase returns correct for foodfile', async () =>{
        const result = await GetFlagsCustomTimePeriodFromDatabase('2026-05-12','2026-05-18',patient1.id as string,foodLogRepository,customFoodRepository,patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof Flags>
        for (const key of keys) {
            const expected = expectedFlagsForweekof20260512[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

})