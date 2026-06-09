import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { UserDTO,UserDatabaseObject } from '../src/models/user.types.ts';
import { FoodLogEntity} from '../src/database/entities/foodLog.entity.ts';
import { entities } from '../src/database/index.ts';
import { CreateUserInDatabase } from '../src/helpers/user.helper.ts';
import {CustomFoodDTO, CustomFood, CustomFoodNutrients, CustomFoodShort} from '../src/models/customFood.types.ts';
import { CustomFoodEntity} from '../src/database/entities/customFood.entity.ts';
import { CreateCustomFoodInDatabase, UpdateCustomFoodInDatabase, DeleteCustomFoodInDatabase, GetCustomFoodByUserIdFromDatabase, GetCustomFoodByIdFromDatabase} from '../src/helpers/customFood.helper.ts'

import {SearchResult, FoodFile ,FoodFileShort, FoodFileNutrients} from '../src/models/search.types.ts'
import {SearchFoodFileAndCustomInDatabaseAndAPI, SearchGetFoodFileFromAPI, SearchGetCustomFromDatabase} from '../src/helpers/search.helper.ts'

describe('patient.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;

    let foodLogRepository: Repository<FoodLogEntity>;
    let customFoodRepository: Repository<CustomFoodEntity>;
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


        CustomFood1 = await CreateCustomFoodInDatabase(baseCustomFood, customFoodRepository);

        const tempCustomeFood2 = {...baseCustomFood};
        tempCustomeFood2.foodName = 'Food number 2';

        CustomFood2 = await CreateCustomFoodInDatabase(tempCustomeFood2, customFoodRepository);

        ButterChickenSearchResult = {
            foodFile:[
                {
                    id: "H1023",
                    foodName: "Curry, butter chicken, ready to eat, Indian, takeaway",
                    sortName: "Curry, butter chicken, Indian, takeaway",
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
            Id: "H1023",
            foodName: "Curry, butter chicken, ready to eat, Indian, takeaway",
            shortName: "Curry, butter chicken, Indian, takeaway",
            description: null,
            serving_size: 258.0,
            group: "Fast foods and ready to eat meals",
            serving_size_unit: "g",
            measure_description: "1 cup",
            energy: {
                unit: "KJ",
                qty_per_serving: "1900",
                percent_RQI: "22",
                qty_per_100: "750"
            } as FoodFileNutrients,
            protein: {
                unit: "g",
                qty_per_serving: "30",
                percent_RQI: "60",
                qty_per_100: "12"
            } as FoodFileNutrients,
            totalFat: {
                unit: "g",
                qty_per_serving: "31",
                percent_RQI: "44",
                qty_per_100: "12"
            } as FoodFileNutrients,
            saturatedFat: {
                unit: "g",
                qty_per_serving: "14",
                percent_RQI: "60",
                qty_per_100: "5.6"
            } as FoodFileNutrients,
            carbohydrate: {
                unit: "g",
                qty_per_serving: "13",
                percent_RQI: "4",
                qty_per_100: "5.1"
            } as FoodFileNutrients,
            sugars: {
                unit: "g",
                qty_per_serving: "13",
                percent_RQI: "14",
                qty_per_100: "5.0"
            } as FoodFileNutrients,
            fiber: {
                unit: "g",
                qty_per_serving: "5.7",
                percent_RQI: "19",
                qty_per_100: "2.2"
            } as FoodFileNutrients,
            sodium: {
                unit: "mg",
                qty_per_serving: "990",
                percent_RQI: "43",
                qty_per_100: "380"
            } as FoodFileNutrients
        } as FoodFile
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
        await expect(SearchFoodFileAndCustomInDatabaseAndAPI('butter chicken','notindatabase',customFoodRepository)).rejects.toThrow()
        await expect(SearchFoodFileAndCustomInDatabaseAndAPI('butter chichen','notindatabase',customFoodRepository)).rejects.toThrow()
    });

    it('SearchFoodFileAndCustomInDatabaseAndAPI returns food that matches', async () =>{
        const expectedSearchResult = {...ButterChickenSearchResult}

        const result = await SearchFoodFileAndCustomInDatabaseAndAPI('butter chicken',user1.id,customFoodRepository)
        

        const resultFoodFile = result.foodFile[0]
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
        for (const key of keys){
            expect(result[key]).toBe(expectResult[key]);
        }
    });

    it('SearchGetCustomFromDatabase throws if no food found', async () =>{
        await expect(SearchGetCustomFromDatabase('notindatabase')).rejects.toThrow()
    });

    it('SearchGetCustomFromDatabase returns food file that matches', async () =>{
        const expectResult = {...baseCustomFood}

        const result = await SearchGetCustomFromDatabase(CustomFood1.id,user1.id,customFoodRepository);

        const keys = Object.keys(expectResult) as Array<keyof CustomFood>
        for (const key of keys){
            expect(result[key]).toBe(expectResult[key]);
        }
    });
});
