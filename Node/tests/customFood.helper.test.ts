import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import {CustomFoodDTO, CustomFood, CustomFoodNutrients} from '../src/models/customFood.types.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { UserDTO,UserDatabaseObject } from '../src/models/user.types.ts';
import { CustomFoodEntity} from '../src/database/entities/customFood.entity.ts';
import { entities } from '../src/database/index.ts';
import { CreateUserInDatabase } from '../src/helpers/user.helper.ts';
import { CreateCustomFoodInDatabase, UpdateCustomFoodInDatabase, DeleteCustomFoodInDatabase, GetCustomFoodByUserIdFromDatabase, GetCustomFoodByIdFromDatabase} from '../src/helpers/customFood.helper.ts'

describe('patient.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let customFoodRepository: Repository<CustomFoodEntity>;
    let user1: UserDatabaseObject;
    let user2: UserDatabaseObject;
    let baseTestCustomFood: CustomFoodDTO;

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
        customFoodRepository = dataSource.getRepository(CustomFoodEntity);

        // Create some users for tests
        const user1DTO = {
            username: 'user1',
            password: 'not-used' 
        } as UserDTO;
        const user2DTO = {
            username: 'user2',
            password: 'not-used' 
        } as UserDTO;
        user1 = await CreateUserInDatabase(user1DTO, userRepository);
        user2 = await CreateUserInDatabase(user2DTO, userRepository);

        baseTestCustomFood = {
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
    });

    
    
    afterAll(async () => {
        // Only destroy this suite's dataSource
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Clear users before each test
        await customFoodRepository.clear();
    });

    it('CreateCustomFoodInDatabase throws when any param is missing', async () =>{
        const testCustomFood = {...baseTestCustomFood}

        const keys = Object.keys(testCustomFood) as Array<keyof CustomFoodDTO>

        for (const key of keys) {
            const incompleteCustomFood = { ...testCustomFood};

            delete incompleteCustomFood[key]

            await expect(CreateCustomFoodInDatabase(incompleteCustomFood,customFoodRepository)).rejects.toThrow();
        }
    });

    it('CreateCustomFoodInDatabase throws when user id doesnt match any', async () =>{
        const testCustomFood = {...baseTestCustomFood}
        testCustomFood.userId = 'notinthedatabase'

        await expect(CreateCustomFoodInDatabase(testCustomFood,customFoodRepository)).rejects.toThrow();
    });

    it('CreateCustomFoodInDatabase returns sanitized object', async () =>{
        const testCustomFood = {...baseTestCustomFood}

        const result = await CreateCustomFoodInDatabase(testCustomFood,customFoodRepository);

        const keys = Object.keys(testCustomFood) as Array<keyof CustomFoodDTO>

        for (const key of keys) {
            expect(result[key]).toBe(testCustomFood[key]);
        }
    });

    it('GetCustomFoodByIdFromDatabase throws if custom food not found', async () =>{
        await expect(GetCustomFoodByIdFromDatabase('notindatabase',customFoodRepository)).rejects.toThrow()
    });

    it('GetCustomFoodByIdFromDatabase returns ', async () =>{
        const testCustomFood = {...baseTestCustomFood}

        const created = await CreateCustomFoodInDatabase(testCustomFood,customFoodRepository);

        const result = await GetCustomFoodByIdFromDatabase(created.id,customFoodRepository);

        const keys = Object.keys(testCustomFood) as Array<keyof CustomFoodDTO>

        expect(result).toBeDefined();

        for (const key of keys) {
            expect(result[key]).toBe(testCustomFood[key]);
        }
    });

    it('GetCustomFoodByUserIdFromDatabase throws if no user id or invalid', async () =>{
        await expect(GetCustomFoodByUserIdFromDatabase('notindatabase',customFoodRepository)).rejects.toThrow()
        await expect(GetCustomFoodByUserIdFromDatabase('',customFoodRepository)).rejects.toThrow()
    });

    it('GetCustomFoodByUserIdFromDatabase returns right custom food for a given user id', async () =>{

        const testCustomFood1 = {...baseTestCustomFood}
        const created1 = await CreateCustomFoodInDatabase(testCustomFood1,customFoodRepository);

        const testCustomFood2 = {...baseTestCustomFood}
        testCustomFood2.userId = user2.id
        testCustomFood2.foodName = 'superDifrent'
        const created2 = await CreateCustomFoodInDatabase(testCustomFood2,customFoodRepository);

        const result1 = await GetCustomFoodByUserIdFromDatabase(user1.id,customFoodRepository);
        const result2 = await GetCustomFoodByUserIdFromDatabase(user2.id,customFoodRepository);

        expect(result1[0].foodName).toBe(testCustomFood1.foodName);
        expect(result2[0].foodName).toBe(testCustomFood2.foodName);
    });

    it('UpdateCustomFoodInDatabase updates an existing custom food', async () =>{
        const testCustomFood = {...baseTestCustomFood}
        const created = await CreateCustomFoodInDatabase(testCustomFood,customFoodRepository);

        const updatedCustomFood = {...baseTestCustomFood}
        updatedCustomFood.foodName = 'updatedName'

        await UpdateCustomFoodInDatabase(created.id as string, updatedCustomFood,customFoodRepository);

        const updated = await GetCustomFoodByIdFromDatabase(created.id as string, customFoodRepository);
        expect(updated.foodName).toBe(updatedCustomFood.foodName)
    });

    it('UpdateCustomFoodInDatabase updates an existing custom food', async () =>{
        const testCustomFood = {...baseTestCustomFood}
        const created = await CreateCustomFoodInDatabase(testCustomFood,customFoodRepository);

        const updatedCustomFood = {...baseTestCustomFood}
        updatedCustomFood.foodName = 'updatedName'

        await expect(UpdateCustomFoodInDatabase('notindatabase', updatedCustomFood,customFoodRepository)).rejects.toThrow();
    });

    it('DeleteCustomFoodInDatabase removes a custom food', async () =>{
        const testCustomFood = {...baseTestCustomFood}
        const created = await CreateCustomFoodInDatabase(testCustomFood,customFoodRepository);

        await DeleteCustomFoodInDatabase(created.id as string,customFoodRepository);

        await expect(GetCustomFoodByIdFromDatabase(created.id as string, customFoodRepository)).rejects.toThrow();
    });

    it('DeleteCustomFoodInDatabase throws if user doesnt exist', async () => {
        await expect(DeleteCustomFoodInDatabase('notindatabase' as string,customFoodRepository)).rejects.toThrow();
    })
});