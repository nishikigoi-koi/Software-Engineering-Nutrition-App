import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { UserDTO,UserDatabaseObject } from '../src/models/user.types.ts';
import { FoodLogEntity} from '../src/database/entities/foodLog.entity.ts';
import { entities } from '../src/database/index.ts';
import { CreateUserInDatabase } from '../src/helpers/user.helper.ts';
import {CustomFoodDTO, CustomFood, CustomFoodNutrients, CustomFoodShort, CustomFoodMicroNutrients} from '../src/models/customFood.types.ts';
import { CustomFoodEntity} from '../src/database/entities/customFood.entity.ts';
import { CreateCustomFoodInDatabase, UpdateCustomFoodInDatabase, DeleteCustomFoodInDatabase, GetCustomFoodByUserIdFromDatabase, GetCustomFoodByIdFromDatabase} from '../src/helpers/customFood.helper.ts'

import {SearchResult, FoodFile ,FoodFileShort, FoodFileNutrients, FoodFileMicroNutrients} from '../src/models/search.types.ts'
import {SearchFoodFileAndCustomInDatabaseAndAPI, SearchGetFoodFileFromAPI, SearchGetCustomFromDatabase} from '../src/helpers/search.helper.ts'
import { CustomFoodMicroNutrientsEntity } from '../src/database/entities/customFoodMicroNutrients.entity.ts';


describe('search.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;

    let foodLogRepository: Repository<FoodLogEntity>;
    let customFoodRepository: Repository<CustomFoodEntity>;
    let customFoodMicroNutrientsRepository: Repository<CustomFoodMicroNutrientsEntity>;

    let user1: UserDatabaseObject;
    let baseCustomFood: CustomFoodDTO;

    let CustomFood1: CustomFood;
    let CustomFood2: CustomFood;

    let ButterChickenSearchResult: SearchResult;
    let ButterChickenFoodFile: FoodFile;

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
            carbohydrate: {
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
                }
            ] as CustomFoodMicroNutrients[]
        } as CustomFoodDTO


        CustomFood1 = await CreateCustomFoodInDatabase(baseCustomFood, customFoodRepository,customFoodMicroNutrientsRepository);

        const tempCustomeFood2 = {...baseCustomFood};
        tempCustomeFood2.foodName = 'Food number 2';

        CustomFood2 = await CreateCustomFoodInDatabase(tempCustomeFood2, customFoodRepository,customFoodMicroNutrientsRepository);

        ButterChickenSearchResult = {
            foodFile:[
                {
                    id: "H1023",
                    foodName: "Curry, butter chicken, ready to eat, Indian, takeaway",
                    shortName: "Curry, butter chicken, Indian, takeaway",
                    description: null,
                    serving_size: 258.0,
                    group: "Fast foods and ready to eat meals",
                    serving_size_unit: "g",
                    measure_description: "1 cup"
                } as FoodFileShort
            ],
            customFood:[
                {
                    id: CustomFood1.id,
                    userId: CustomFood1.userId,
                    foodName: CustomFood1.foodName,
                    description: CustomFood1.description,
                    serving_size: CustomFood1.serving_size,
                    group: CustomFood1.group,
                    serving_size_unit: CustomFood1.serving_size_unit,
                    measure_description: CustomFood1.measure_description
                } as CustomFoodShort
            ]
        } as SearchResult

        ButterChickenFoodFile = {
            id: "H1023",
            foodName: "Curry, butter chicken, ready to eat, Indian, takeaway",
            shortName: "Curry, butter chicken, Indian, takeaway",
            description: null,
            serving_size: 258.0,
            group: "Fast foods and ready to eat meals",
            serving_size_unit: "g",
            measure_description: "1 cup",
            energy: {
                unit: "kJ",
                qty_per_serving: "1900",
                percent_RDI: "22",
                qty_per_100: "750"
            },
            protein: {
                unit: "g",
                qty_per_serving: "30",
                percent_RDI: "60",
                qty_per_100: "12"
            } as FoodFileNutrients,
            totalFat: {
                unit: "g",
                qty_per_serving: "31",
                percent_RDI: "44",
                qty_per_100: "12"
            } as FoodFileNutrients,
            saturatedFat: {
                unit: "g",
                qty_per_serving: "14",
                percent_RDI: "60",
                qty_per_100: "5.6"
            } as FoodFileNutrients,
            carbohydrate: {
                unit: "g",
                qty_per_serving: "13",
                percent_RDI: "4",
                qty_per_100: "5.1"
            } as FoodFileNutrients,
            sugars: {
                unit: "g",
                qty_per_serving: "13",
                percent_RDI: "14",
                qty_per_100: "5.0"
            } as FoodFileNutrients,
            fiber: {
                unit: "g",
                qty_per_serving: "5.7",
                percent_RDI: "19",
                qty_per_100: "2.2"
            } as FoodFileNutrients,
            sodium: {
                unit: "mg",
                qty_per_serving: "990",
                percent_RDI: "43",
                qty_per_100: "380"
            } as FoodFileNutrients,
            microNutrients: [
                {
                    name: "Calcium",
                    unit: "mg",
                    qty_per_serving: "95",
                    percent_RDI: "12",
                    qty_per_100: "37"
                } as FoodFileMicroNutrients,
                {
                    name: "Copper",
                    unit: "mg",
                    qty_per_serving: "0.31",
                    percent_RDI: "10",
                    qty_per_100: "0.12"
                } as FoodFileMicroNutrients,
                {
                    name: "Iron",
                    unit: "mg",
                    qty_per_serving: "4.6",
                    percent_RDI: "38",
                    qty_per_100: "1.8"
                } as FoodFileMicroNutrients,
                {
                    name: "Folate",
                    unit: "µg",
                    qty_per_serving: "21",
                    percent_RDI: "10",
                    qty_per_100: "8"
                } as FoodFileMicroNutrients,
                {
                    name: "Iodide (iodine)",
                    unit: "µg",
                    qty_per_serving: "57",
                    percent_RDI: "38",
                    qty_per_100: "22"
                } as FoodFileMicroNutrients,
                {
                    name: "Potassium",
                    unit: "mg",
                    qty_per_serving: "940",
                    percent_RDI: undefined,
                    qty_per_100: "360"
                } as FoodFileMicroNutrients,
                {
                    name: "Magnesium",
                    unit: "mg",
                    qty_per_serving: "62",
                    percent_RDI: "19",
                    qty_per_100: "24"
                } as FoodFileMicroNutrients,
                {
                    name: "Manganese",
                    unit: "µg",
                    qty_per_serving: "340",
                    percent_RDI: "7",
                    qty_per_100: "130"
                } as FoodFileMicroNutrients,
                {
                    name: "Niacin (vitamin B3)",
                    unit: "mg",
                    qty_per_serving: "19",
                    percent_RDI: "190",
                    qty_per_100: "7.3"
                } as FoodFileMicroNutrients,
                {
                    name: "Phosphorus",
                    unit: "mg",
                    qty_per_serving: "320",
                    percent_RDI: "32",
                    qty_per_100: "120"
                } as FoodFileMicroNutrients,
                {
                    name: "Riboflavin (vitamin B2)",
                    unit: "mg",
                    qty_per_serving: "0.52",
                    percent_RDI: "30",
                    qty_per_100: "0.20"
                } as FoodFileMicroNutrients,
                {
                    name: "Selenium",
                    unit: "µg",
                    qty_per_serving: "14",
                    percent_RDI: "21",
                    qty_per_100: "5.6"
                } as FoodFileMicroNutrients,
                {
                    name: "Thiamin (vitamin B1)",
                    unit: "mg",
                    qty_per_serving: "0.28",
                    percent_RDI: "26",
                    qty_per_100: "0.11"
                } as FoodFileMicroNutrients,
                {
                    name: "Vitamin A, FSANZ",
                    unit: "µg",
                    qty_per_serving: "300",
                    percent_RDI: "41",
                    qty_per_100: "120"
                } as FoodFileMicroNutrients,
                {
                    name: "Vitamin B12 (cobalamin)",
                    unit: "µg",
                    qty_per_serving: "0.21",
                    percent_RDI: "10",
                    qty_per_100: "0.08"
                } as FoodFileMicroNutrients,
                {
                    name: "Vitamin B6 (pyridoxal phosphate)",
                    unit: "mg",
                    qty_per_serving: "3.1",
                    percent_RDI: "190",
                    qty_per_100: "1.2"
                } as FoodFileMicroNutrients,
                {
                    name: "Vitamin C (ascorbic acid)",
                    unit: "mg",
                    qty_per_serving: "0.0",
                    percent_RDI: "0",
                    qty_per_100: "0.0"
                } as FoodFileMicroNutrients,
                {
                    name: "Vitamin D",
                    unit: "µg",
                    qty_per_serving: "0.00",
                    percent_RDI: "0",
                    qty_per_100: "0.00"
                } as FoodFileMicroNutrients,
                {
                    name: "Vitamin E (tocopherols)",
                    unit: "mg",
                    qty_per_serving: "3.4",
                    percent_RDI: "34",
                    qty_per_100: "1.3"
                } as FoodFileMicroNutrients,
                {
                    name: "Zinc",
                    unit: "mg",
                    qty_per_serving: "2.7",
                    percent_RDI: "22",
                    qty_per_100: "1.0"
                } as FoodFileMicroNutrients
            ] as FoodFileMicroNutrients[]
        }  as FoodFile
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

    it('SearchFoodFileAndCustomInDatabaseAndAPI throws if no user id is invalid', async () => {
        await expect(SearchFoodFileAndCustomInDatabaseAndAPI('butter chicken','notindatabase',customFoodRepository,userRepository)).rejects.toThrow()
        await expect(SearchFoodFileAndCustomInDatabaseAndAPI('butter chichen','notindatabase',customFoodRepository,userRepository)).rejects.toThrow()
    });

    it('SearchFoodFileAndCustomInDatabaseAndAPI returns food that matches', async () =>{
        const expectedSearchResult = {...ButterChickenSearchResult}

        const result = await SearchFoodFileAndCustomInDatabaseAndAPI('butter chicken',user1.id,customFoodRepository,userRepository) 
        

        const resultFoodFile = result.foodFile[0] as FoodFileShort
        const keysFoodFile = Object.keys(resultFoodFile) as Array<keyof FoodFileShort>
        for (const key of keysFoodFile){
            expect(resultFoodFile[key]).toBe(expectedSearchResult.foodFile[0][key])
        }

        const resultCustom = result.customFood[0]
        const keysCustom = Object.keys(resultCustom) as Array<keyof CustomFoodShort>
        for (const key of keysCustom){
            expect(resultCustom[key]).toBe(expectedSearchResult.customFood[0][key])
        }
    });

    it('SearchGetFoodFileFromAPI throws if no food found', async () =>{
        await expect(SearchGetFoodFileFromAPI('notindatabase')).rejects.toThrow()
    });

    it('SearchGetFoodFileFromAPI returns food file that matches', async () =>{
        const expectResult = {...ButterChickenFoodFile}

        const result = await SearchGetFoodFileFromAPI('H1023');

        const keys = Object.keys(expectResult) as Array<keyof FoodFile>
        console.log(result)

        for (const key of keys) {
            const expected = expectResult[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    });

    it('SearchGetCustomFromDatabase throws if no food found', async () =>{
        await expect(SearchGetCustomFromDatabase('notindatabase',customFoodRepository)).rejects.toThrow()
    });

    it('SearchGetCustomFromDatabase returns food file that matches', async () =>{
        const expectResult = {...baseCustomFood}

        const result = await SearchGetCustomFromDatabase(CustomFood1.id,customFoodRepository);

        const keys = Object.keys(expectResult) as Array<keyof CustomFoodDTO>
        
        expect(result).toBeDefined();

        for (const key of keys) {
            const expected = expectResult[key];
            const actual = result[key];
            if (expected && typeof expected === 'object') {
                expect(actual).toStrictEqual(expected);
            } else {
                expect(actual).toBe(expected);
            }
        }
    });
});
