import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import { entities } from '../src/database/index.ts';
import { CreatePatientInDatabase, GetPatientByIdInDatabase, GetAllPatientsByUserIdInDatabase, UpdatePatientInDatabase, DeletePatientInDatabase} from '../src/helpers/patient.helper.ts';
import { PatientEntity } from '../src/database/entities/patient.entity.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { Patient, PatientDTO } from '../src/models/patient.types.ts';
import { CreateUserInDatabase } from '../src/helpers/user.helper.ts';
import { UserDTO } from '../src/models/user.types.ts';
import { UserDatabaseObject } from '../src/models/user.types.ts';

describe('patient.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;
    let patientRepository: Repository<PatientEntity>;
    let user1: UserDatabaseObject;
    let user2: UserDatabaseObject;

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
    });

    afterAll(async () => {
        // Only destroy this suite's dataSource
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Clear users before each test
        await patientRepository.clear();
    });

    it('CreatePatientInDatabase throws when any param is missing', async () =>{
        const testPatient = {           
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
        // Get an array of all the keys in the patient object
        const keys = Object.keys(testPatient) as Array<keyof PatientDTO>;

        for (const key of keys) {
            // Create a fresh copy of the patient object for each iteration
            const incompletePatient = { ...testPatient };
            
            // Remove one parameter
            delete incompletePatient[key]; 

            // Assert that the function throws an error for this missing parameter
            await expect(CreatePatientInDatabase(incompletePatient,patientRepository)).rejects.toThrow(CustomerError);
        }
    });

    it('CreatePatientInDatabase throws when user id doesnt match any', async () =>{
        const testPatient = {           
            userId: "notinthedatabase",
            firstName: "John",
            lastName: "Doe",
            birthDate: "1990-01-01",
            gender: "Male",
            ethnicity: "Caucasian",
            weight: 70,
            height: 180,
            activityLevel: "Moderate"
        } as PatientDTO
        await expect(CreatePatientInDatabase(testPatient,patientRepository)).rejects.toThrow();
    });

        it('CreatePatientInDatabase returns sanitized object', async () =>{
        const testPatient = {           
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
        const result = await CreatePatientInDatabase(testPatient,patientRepository);

        const keys = Object.keys(testPatient) as Array<keyof PatientDTO>;

        for (const key of keys) {
            expect(result[key]).toBe(testPatient[key]);
        }

    });

    it('GetPatientByIdInDatabase throws if patient not found', async () =>{
        await expect(GetPatientByIdInDatabase('not-a-valid-id', patientRepository)).rejects.toThrow(CustomerError)
    });

    it('GetPatientByIdInDatabase retuns', async () =>{
        const testPatient = {           
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
        const created = await CreatePatientInDatabase(testPatient,patientRepository);

        const result = await GetPatientByIdInDatabase(created.id as string, patientRepository)

        const keys = Object.keys(testPatient) as Array<keyof PatientDTO>;

        const savedPatient = await GetPatientByIdInDatabase(result.id as string,patientRepository);
        expect(savedPatient).toBeDefined();
        for (const key of keys) {
            expect(savedPatient[key as keyof Patient]).toBe(testPatient[key]);
        }
    });

    it('GetAllPatientsByUserIdInDatabase throws if no user id or invalid', async () =>{
        await expect(GetAllPatientsByUserIdInDatabase('notindatabase', patientRepository)).rejects.toThrow()
        await expect(GetAllPatientsByUserIdInDatabase('', patientRepository)).rejects.toThrow()
    });

    it('GetAllPatientsByUserIdInDatabase returns right patients for a given user id', async () => {
        const testPatient = {           
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
        const created = await CreatePatientInDatabase(testPatient,patientRepository);

        const testPatient2 = {           
            userId: user2.id,
            firstName: "John2",
            lastName: "Doe",
            birthDate: "1990-01-01",
            gender: "Male",
            ethnicity: "Caucasian",
            weight: 70,
            height: 180,
            activityLevel: "Moderate"
        } as PatientDTO
        const created2 = await CreatePatientInDatabase(testPatient2,patientRepository);

        const result= await GetAllPatientsByUserIdInDatabase(user1.id, patientRepository);
        expect(result[0].firstName).toBe(testPatient.firstName)

        const result2= await GetAllPatientsByUserIdInDatabase(user2.id, patientRepository);
        expect(result2[0].firstName).toBe(testPatient2.firstName)
    });

    it('UpdatePatientInDatabase updates an existing patient', async () => {
        const testPatient = {           
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
        const created = await CreatePatientInDatabase(testPatient,patientRepository);

        const updatedTestPatient = {           
            userId: user1.id,
            firstName: "Jane",
            lastName: "Doe",
            birthDate: "1990-01-01",
            gender: "Female",
            ethnicity: "Caucasian",
            weight: 65,
            height: 165,
            activityLevel: "Low"
        } as PatientDTO
        await UpdatePatientInDatabase(created.id as string, updatedTestPatient, patientRepository);

        const updated = await GetPatientByIdInDatabase(created.id as string, patientRepository);
        expect(updated.firstName).toBe(updatedTestPatient.firstName)
    });

    it('UpdatePatientInDatabase throws if patient doesnt exist', async () =>{
        const updatedTestPatient = {           
            userId: user1.id,
            firstName: "Jane",
            lastName: "Doe",
            birthDate: "1990-01-01",
            gender: "Female",
            ethnicity: "Caucasian",
            weight: 65,
            height: 165,
            activityLevel: "Low"
        } as PatientDTO
        await expect(UpdatePatientInDatabase('notindatabase', updatedTestPatient, patientRepository )).rejects.toThrow()
    });

    it('DeletePatientInDatabase removes a patient', async () =>{
        const testPatient = {           
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
        const created = await CreatePatientInDatabase(testPatient,patientRepository);

        await DeletePatientInDatabase(created.id as string, patientRepository)

        await expect(GetPatientByIdInDatabase(created.id as string, patientRepository)).rejects.toThrow()
    });

    it('DeletePatientInDatabase throws if user doesnt exist', async () => {
        await expect(DeletePatientInDatabase('notindatabase',patientRepository)).rejects.toThrow()
    });
});
