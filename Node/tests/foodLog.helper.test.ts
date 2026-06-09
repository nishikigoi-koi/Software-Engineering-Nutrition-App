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
import {CustomFoodDTO, CustomFood, CustomFoodNutrients} from '../src/models/customFood.types.ts';
import { CustomFoodEntity} from '../src/database/entities/customFood.entity.ts';
import { CreateCustomFoodInDatabase, UpdateCustomFoodInDatabase, DeleteCustomFoodInDatabase, GetCustomFoodByUserIdFromDatabase, GetCustomFoodByIdFromDatabase} from '../src/helpers/customFood.helper.ts'
import { CreatePatientInDatabase, GetPatientByIdInDatabase, GetAllPatientsByUserIdInDatabase, UpdatePatientInDatabase, DeletePatientInDatabase} from '../src/helpers/patient.helper.ts';
import { Patient, PatientDTO } from '../src/models/patient.types.ts';


describe('patient.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let patientRepository: Repository<PatientEntity>;
    let foodLogRepository: Repository<FoodLogEntity>;
    let customFoodRepository: Repository<CustomFoodEntity>;
    let user1: UserDatabaseObject;
    let baseCustomFood: CustomFoodDTO;
    let basePatient: PatientDTO;
    let CustomFood1: CustomFood;
    let CustomFood2: CustomFood;
    let patient1: Patient;
    let patient2: Patient;

    let baseTestFoodLogFCDB: FoodLogDTO;
    let baseTestFoodLogCustom: FoodLogDTO;

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
                percent_RQI: "22",
                qty_per_100: "750"
            } as CustomFoodNutrients,
            protein: {
                unit: "g",
                qty_per_serving: "30",
                percent_RQI: "60",
                qty_per_100: "12"
            } as CustomFoodNutrients,
            totalFat: {
                unit: "g",
                qty_per_serving: "31",
                percent_RQI: "44",
                qty_per_100: "12"
            } as CustomFoodNutrients,
            saturatedFat: {
                unit: "g",
                qty_per_serving: "14",
                percent_RQI: "60",
                qty_per_100: "5.6"
            } as CustomFoodNutrients,
            carbohydrate: {
                unit: "g",
                qty_per_serving: "13",
                percent_RQI: "4",
                qty_per_100: "5.1"
            } as CustomFoodNutrients,
            sugars: {
                unit: "g",
                qty_per_serving: "13",
                percent_RQI: "14",
                qty_per_100: "5.0"
            } as CustomFoodNutrients,
            fiber: {
                unit: "g",
                qty_per_serving: "5.7",
                percent_RQI: "19",
                qty_per_100: "2.2"
            } as CustomFoodNutrients,
            sodium: {
                unit: "mg",
                qty_per_serving: "990",
                percent_RQI: "43",
                qty_per_100: "380"
            } as CustomFoodNutrients
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

        CustomFood1 = await CreateCustomFoodInDatabase(baseCustomFood, customFoodRepository);

        const tempCustomeFood2 = {...baseCustomFood};
        tempCustomeFood2.foodName = 'Food number 2';

        CustomFood2 = await CreateCustomFoodInDatabase(tempCustomeFood2, customFoodRepository);

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
            dateTime: "2026-05-12T23:52:18.000Z",
            amount : 130,
            unit : "g",
            mealType : "snack"
        } as FoodLogDTO
    });
    
    afterAll(async () => {
        // Only destroy this suite's dataSource
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Clear users before each test
        await foodLogRepository.clear();
    });

    it('CreateFoodLogInDatabase throws when any param is missing', async () =>{
        const testFoodLogFCDB = {...baseTestFoodLogFCDB};

        const keysFCDB = Object.keys(testFoodLogFCDB) as Array<keyof FoodLogDTO>;

        for (const key of keysFCDB) {
            const incompleteFoodLog = {...testFoodLogFCDB};

            if (key.toString() != 'CustomFoodId'){
                delete incompleteFoodLog[key];

                await expect(CreateFoodLogInDatabase(incompleteFoodLog, foodLogRepository)).rejects.toThrow();
            }
        }

        const testFoodLogCustom = {...baseTestFoodLogCustom};

        const keysCustom = Object.keys(testFoodLogCustom) as Array<keyof FoodLogDTO>;

        for (const key of keysCustom) {
            const incompleteFoodLog = {...testFoodLogCustom};

            if (key.toString() != 'FCDBFoodId'){
                delete incompleteFoodLog[key];

                await expect(CreateFoodLogInDatabase(incompleteFoodLog, foodLogRepository)).rejects.toThrow();
            }
        }
    });

    it('CreateFoodLogInDatabase throws if CustomFoodId and FCDBFoodId are both defind or both not', async () =>{
        const testFoodLog = {...baseTestFoodLogCustom};
        testFoodLog.FCDBFoodId = 'L1151';

        await expect(CreateFoodLogInDatabase(testFoodLog, foodLogRepository)).rejects.toThrow();

        testFoodLog.FCDBFoodId = null;
        testFoodLog.CustomFoodId = null;

        await expect(CreateFoodLogInDatabase(testFoodLog, foodLogRepository)).rejects.toThrow();
    });

    it('CreateFoodLogInDatabase throws if patientId or custom food id doesnt match any', async () =>{
        let testFoodLog = {...baseTestFoodLogCustom};
        testFoodLog.patientId = 'notinthedatabase';

        await expect(CreateFoodLogInDatabase(testFoodLog, foodLogRepository)).rejects.toThrow();

        testFoodLog = {...baseTestFoodLogFCDB};
        testFoodLog.patientId = 'notinthedatabase';

        await expect(CreateFoodLogInDatabase(testFoodLog, foodLogRepository)).rejects.toThrow();

        testFoodLog = {...baseTestFoodLogCustom} //reset
        testFoodLog.CustomFoodId = 'notindatabase';

        await expect(CreateFoodLogInDatabase(testFoodLog, foodLogRepository)).rejects.toThrow();
    });

    it('CreateFoodLogInDatabase returns sanitized object', async () =>{
        const testFoodLogCustom = {...baseTestFoodLogCustom};

        const resultCustom = await CreateFoodLogInDatabase(testFoodLogCustom, foodLogRepository);

        const keysCustom = Object.keys(testFoodLogCustom) as Array<keyof FoodLogDTO>;

        for (const key of keysCustom) {
            expect(resultCustom[key]).toBe(testFoodLogCustom[key]);
        }

        const testFoodLogFCDB = {...baseTestFoodLogFCDB};

        const resultFCDB = await CreateFoodLogInDatabase(testFoodLogFCDB, foodLogRepository);

        const keysFCDB = Object.keys(testFoodLogFCDB) as Array<keyof FoodLogDTO>;

        for (const key of keysFCDB) {
            expect(resultFCDB[key]).toBe(testFoodLogFCDB[key]);
        }
    });

    it('GetFoodLogByIdFromDatabase throws if Food Log not found', async () =>{
        await expect(GetFoodLogByIdFromDatabase('notindatabse', foodLogRepository)).rejects.toThrow()
    });

    it('GetFoodLogByIdFromDatabase returns', async () =>{
        const testFoodLog = {...baseTestFoodLogCustom}
        const created = await CreateFoodLogInDatabase(testFoodLog, foodLogRepository);

        const result = await GetFoodLogByIdFromDatabase(created.id, foodLogRepository);

        const keys = Object.keys(testFoodLog) as Array<keyof FoodLogDTO>;

        for (const key of keys) {
            expect(result[key]).toBe(testFoodLog[key]);
        }
    });

    it('GetFoodLogByPatientIdFromDatabase throws if no patient id or invalid', async () => {
        await expect(GetFoodLogByPatientIdFromDatabase('notindatabse',foodLogRepository)).rejects.toThrow();
        await expect(GetFoodLogByPatientIdFromDatabase('',foodLogRepository)).rejects.toThrow();
    });

    it('GetFoodLogByPatientIdFromDatabase returns right food logs for a given patient', async () =>{
        const testFoodLog1 = {...baseTestFoodLogCustom}
        const created1 = await CreateFoodLogInDatabase(testFoodLog1, foodLogRepository);

        const testFoodLog2 = {...baseTestFoodLogCustom}
        testFoodLog2.patientId = patient2.id;
        testFoodLog2.mealType = 'Lunch'
        const created2 = await CreateFoodLogInDatabase(testFoodLog2, foodLogRepository);

        const result1 = await GetFoodLogByPatientIdFromDatabase(patient1.id,foodLogRepository)
        const result2 = await GetFoodLogByPatientIdFromDatabase(patient2.id,foodLogRepository)

        expect(result1[0].mealType).toBe(testFoodLog1.mealType)
        expect(result2[0].mealType).toBe(testFoodLog2.mealType)
    });

    it('GetFoodLogsByDateAndPatientIdFromDatabase throws if no patient id or date or they are invalid', async () =>{
        await expect(GetFoodLogsByDateAndPatientIdFromDatabase('2026-05-12', 'notindatabase', foodLogRepository)).rejects.toThrow()
        await expect(GetFoodLogsByDateAndPatientIdFromDatabase('notindatabase', patient1.id, foodLogRepository)).rejects.toThrow()
        await expect(GetFoodLogsByDateAndPatientIdFromDatabase('2026-05-12', '', foodLogRepository)).rejects.toThrow()
        await expect(GetFoodLogsByDateAndPatientIdFromDatabase('', patient1.id, foodLogRepository)).rejects.toThrow()
        await expect(GetFoodLogsByDateAndPatientIdFromDatabase('', '', foodLogRepository)).rejects.toThrow()
    });

    it('GetFoodLogsByDateAndPatientIdFromDatabase returns right food logs for a given patient and date', async () =>{
        const testFoodLogP1T1 = {...baseTestFoodLogCustom}
        const createdP1T1 = await CreateFoodLogInDatabase(testFoodLogP1T1, foodLogRepository);

        const testFoodLogP1T2 = {...baseTestFoodLogCustom}
        testFoodLogP1T2.dateTime = '2026-05-13T23:52:18.000Z'
        testFoodLogP1T2.mealType = 'Dinner'
        const createdP1T2 = await CreateFoodLogInDatabase(testFoodLogP1T2, foodLogRepository);

        const testFoodLogP2T1 = {...baseTestFoodLogCustom}
        testFoodLogP2T1.patientId = patient2.id;
        testFoodLogP2T1.mealType = 'Lunch'
        const createdP2T1 = await CreateFoodLogInDatabase(testFoodLogP2T1, foodLogRepository);

        const testFoodLogP2T2 = {...baseTestFoodLogCustom}
        testFoodLogP2T2.patientId = patient2.id;
        testFoodLogP2T2.dateTime = '2026-05-13T23:52:18.000Z'
        testFoodLogP2T2.mealType = 'Breakfast'
        const createdP2T2 = await CreateFoodLogInDatabase(testFoodLogP2T2, foodLogRepository);

        const resultP1T1 = await GetFoodLogsByDateAndPatientIdFromDatabase('2026-05-12', patient1.id, foodLogRepository);
        const resultP1T2 = await GetFoodLogsByDateAndPatientIdFromDatabase('2026-05-13', patient1.id, foodLogRepository);
        const resultP2T1 = await GetFoodLogsByDateAndPatientIdFromDatabase('2026-05-12', patient2.id, foodLogRepository);
        const resultP2T2 = await GetFoodLogsByDateAndPatientIdFromDatabase('2026-05-13', patient2.id, foodLogRepository);

        expect(resultP1T1[0].mealType).toBe(testFoodLogP1T1.mealType);
        expect(resultP1T2[0].mealType).toBe(testFoodLogP1T2.mealType);
        expect(resultP2T1[0].mealType).toBe(testFoodLogP2T1.mealType);
        expect(resultP2T2[0].mealType).toBe(testFoodLogP2T2.mealType);
    });

    it('UpdateFoodLogInDatabase updates an existing food log', async () =>{
        const testFoodLog = {...baseTestFoodLogCustom}
        const created = await CreateFoodLogInDatabase(testFoodLog,foodLogRepository);

        const updatedFoodLog = {...baseTestFoodLogCustom}
        updatedFoodLog.mealType = 'Lunch'

        await UpdateFoodLogInDatabase(created.id as string, updatedFoodLog, foodLogRepository);

        const updated = await GetFoodLogByIdFromDatabase(created.id, foodLogRepository);
        expect(updated.mealType).toBe(updatedFoodLog.mealType)
    });

    it('UpdateFoodLogInDatabase throws if log doenst exist', async () => {
        const updatedFoodLog = {...baseTestFoodLogCustom}
        updatedFoodLog.mealType = 'Lunch'

        await UpdateFoodLogInDatabase('notindatabase', updatedFoodLog, foodLogRepository);
    });

    it('DeleteFoodLogInDatabase removes a food log', async () => {
        const testFoodLog = {...baseTestFoodLogCustom}
        const created = await CreateFoodLogInDatabase(testFoodLog,foodLogRepository);

        await DeleteFoodLogInDatabase(created.id as string, foodLogRepository)

        await expect(GetFoodLogByIdFromDatabase(created.id as string, foodLogRepository)).rejects.toThrow()
    });

    it('DeleteFoodLogInDatabase throws if log doesnt exist', async () =>{
        await expect(GetFoodLogByIdFromDatabase('notindatabase' as string, foodLogRepository)).rejects.toThrow()
    });
});