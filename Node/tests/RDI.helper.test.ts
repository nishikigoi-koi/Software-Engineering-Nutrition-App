import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { entities } from '../src/database/index.ts';
import { CreatePatientInDatabase, GetPatientByIdInDatabase, GetAllPatientsByUserIdInDatabase, UpdatePatientInDatabase, DeletePatientInDatabase} from '../src/helpers/patient.helper.ts';
import { PatientEntity } from '../src/database/entities/patient.entity.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { Patient, PatientDTO } from '../src/models/patient.types.ts';
import { CreateUserInDatabase } from '../src/helpers/user.helper.ts';
import { UserDTO } from '../src/models/user.types.ts';
import { UserDatabaseObject } from '../src/models/user.types.ts';
import {CalculateRDI} from '../src/helpers/RDI.helper.ts'
import { RDI, RDIMacroNutrients , RDIMicroNutrients } from '../src/models/RDI.types.ts';
import { PatientConditionEntity } from '../src/database/entities/patientConditions.entity.ts';
import { MedicalConditionEntity } from '../src/database/entities/medicalCondition.entity.ts';
import { medicalConditionDTO, patientCondition } from '../src/models/medicalCondition.types.ts';
import { AssignMedicalConditionToPatientInDatabase, CreateMedicalConditionInDatabase } from '../src/helpers/medicalCondition.helper.ts';


describe('RDI.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let patientRepository: Repository<PatientEntity>;
    let patientConditionRepository: Repository<PatientConditionEntity>
    let medicalConditionRepository: Repository<MedicalConditionEntity>

    let user1: UserDatabaseObject;
    let patient1: Patient;
    let patient2: Patient;

    let patient1ExpectedRDI: RDI;
    let patient2ExpectedRDI: RDI;
    let patient2PregnantExpectedRDI: RDI;

    let pregnantMedicalConditionId: string;


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
        patientConditionRepository = dataSource.getRepository(PatientConditionEntity);
        medicalConditionRepository = dataSource.getRepository(MedicalConditionEntity);


        // Create some users for tests
        const user1DTO = {
            username: 'user1',
            password: 'not-used' 
        } as UserDTO;
        user1 = await CreateUserInDatabase(user1DTO, userRepository);

        const patient1DTO = {
            userId: user1.id,
            firstName: "John",
            lastName: "Doe",
            birthDate: "1990-01-01",
            gender: "Male",
            ethnicity: "Caucasian",
            weight: 70,
            height: 180,
            activityLevel: "Moderate",
        }
        const patient2DTO = {
            userId: user1.id,
            firstName: "Jane",
            lastName: "Doe",
            birthDate: "2000-01-01",
            gender: "Female",
            ethnicity: "Caucasian",
            weight: 60,
            height: 160,
            activityLevel: "Light",
        }

        patient1 = await CreatePatientInDatabase(patient1DTO,patientRepository)
        patient2 = await CreatePatientInDatabase(patient2DTO,patientRepository)

        const pregnant = {
            name: "pregnant",
            description: "developing fetus grows inside uterus"
        } as medicalConditionDTO

        const medicalCondition = await CreateMedicalConditionInDatabase(pregnant,medicalConditionRepository)

        pregnantMedicalConditionId = medicalCondition.id

        patient1ExpectedRDI = {
            EnergyUnit: "kJ",
            TotalEnergy: 10701,
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    minAmount: 94.4,
                    maxAmount: 157.4
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    minAmount: 283.3,
                    maxAmount: 409.2
                },
                {
                    name: "totalFat",
                    unit: "g",
                    minAmount: 57.8,
                    maxAmount: 101.2
                },
                {
                    name: "saturatedFat",
                    unit: "g",
                    minAmount: 0,
                    maxAmount: 28.9
                },
                {
                    name: "sodium",
                    unit: "mg",
                    minAmount: 460,
                    maxAmount: 920
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    amount: 1000
                },
                {
                    name: "Copper",
                    unit: "mg",
                    amount: 1.7
                },
                {
                    name: "Iron",
                    unit: "mg",
                    amount: 8
                },
                {
                    name: "Folate",
                    unit: "µg",
                    amount: 400
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    amount: 150
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    amount: 3800
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    amount: 400
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    amount: 5.5
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    amount: 16
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    amount: 1000
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    amount: 1.3
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    amount: 70
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    amount: 1.2
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    amount: 900
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    amount: 2.4
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    amount: 1.3
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    amount: 45
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    amount: 5
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    amount: 10
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    amount: 14
                }
            ]
        } as RDI

        patient2ExpectedRDI = {
            EnergyUnit: "kJ",
            TotalEnergy: 7531,
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    minAmount: 66.4,
                    maxAmount: 110.8
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    minAmount: 199.4,
                    maxAmount: 288
                },
                {
                    name: "totalFat",
                    unit: "g",
                    minAmount: 40.7,
                    maxAmount: 71.2
                },
                {
                    name: "saturatedFat",
                    unit: "g",
                    minAmount: 0,
                    maxAmount: 20.4
                },
                {
                    name: "sodium",
                    unit: "mg",
                    minAmount: 460,
                    maxAmount: 920
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    amount: 1000
                },
                {
                    name: "Copper",
                    unit: "mg",
                    amount: 1.2
                },
                {
                    name: "Iron",
                    unit: "mg",
                    amount: 18
                },
                {
                    name: "Folate",
                    unit: "µg",
                    amount: 400
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    amount: 150
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    amount: 2800
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    amount: 310
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    amount: 5
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    amount: 16
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    amount: 1000
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    amount: 1.1
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    amount: 60
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    amount: 1.1
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    amount: 700
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    amount: 2.4
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    amount: 1.3
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    amount: 45
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    amount: 5
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    amount: 7
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    amount: 8
                }
            ]
        } as RDI

        patient2PregnantExpectedRDI = {
            EnergyUnit: "kJ",
            TotalEnergy: 7531,
            macronutrients: [
                {
                    name: "protein",
                    unit: "g",
                    minAmount: 66.4,
                    maxAmount: 110.8
                },
                {
                    name: "carbohydrates",
                    unit: "g",
                    minAmount: 199.4,
                    maxAmount: 288
                },
                {
                    name: "totalFat",
                    unit: "g",
                    minAmount: 40.7,
                    maxAmount: 71.2
                },
                {
                    name: "saturatedFat",
                    unit: "g",
                    minAmount: 0,
                    maxAmount: 20.4
                },
                {
                    name: "sodium",
                    unit: "mg",
                    minAmount: 460,
                    maxAmount: 920
                }
            ],
            micronutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    amount: 1000
                },
                {
                    name: "Copper",
                    unit: "mg",
                    amount: 1.5
                },
                {
                    name: "Iron",
                    unit: "mg",
                    amount: 27
                },
                {
                    name: "Folate",
                    unit: "µg",
                    amount: 600
                },
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    amount: 220
                },
                {
                    name: "Potassium",
                    unit: "mg",
                    amount: 2800
                },
                {
                    name: "Magnesium",
                    unit: "mg",
                    amount: 350
                },
                {
                    name: "Manganese",
                    unit: "µg",
                    amount: 5
                },
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    amount: 18
                },
                {
                    name: "Phosphorus",
                    unit: "mg",
                    amount: 1000
                },
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    amount: 1.4
                },
                {
                    name: "Selenium",
                    unit: "µg",
                    amount: 65
                },
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    amount: 1.4
                },
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    amount: 800
                },
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    amount: 2.6
                },
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    amount: 1.9
                },
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    amount: 60
                },
                {
                    name: "Vitamin D",
                    unit: "µg",
                    amount: 5
                },
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    amount: 7
                },
                {
                    name: "Zinc",
                    unit: "mg",
                    amount: 11
                }
            ]
        } as RDI
    });

    afterAll(async () => {
        // Only destroy this suite's dataSource
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Clear users before each test
        await patientConditionRepository.clear();
    });

    it('CalculateRDI throws if no patient id is invalid', async () => {
        await expect(CalculateRDI('notindatabase',patientRepository,patientConditionRepository)).rejects.toThrow()
        await expect(CalculateRDI('',patientRepository,patientConditionRepository)).rejects.toThrow()
    });

    it('CalculateRDI returns correct for male', async () =>{
        const result = await CalculateRDI(patient1.id as string, patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof RDI>
        for (const key of keys) {
            const expected = patient1ExpectedRDI[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('CalculateRDI returns correct for female', async () =>{
        const result = await CalculateRDI(patient2.id as string, patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof RDI>
        for (const key of keys) {
            const expected = patient2ExpectedRDI[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })

    it('CalculateRDI returns correct for female and pregnant', async () =>{
        const patientCondition: patientCondition ={
            patientId: patient2.id as string,
            medicalConditionId: pregnantMedicalConditionId
        }

        await AssignMedicalConditionToPatientInDatabase(patientCondition,patientConditionRepository)

        const result = await CalculateRDI(patient2.id as string, patientRepository,patientConditionRepository)

        const keys = Object.keys(result) as Array<keyof RDI>
        for (const key of keys) {
            const expected = patient2ExpectedRDI[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    })
})