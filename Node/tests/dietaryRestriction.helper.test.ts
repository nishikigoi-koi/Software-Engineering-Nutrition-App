import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import { dietaryRestrictionDTO } from '../src/models/dietaryRestriction.types.ts';
import { DietaryRestrictionEntity } from '../src/database/entities/dietaryRestriction.entity.ts';
import { PatientRestrictionEntity } from '../src/database/entities/patientRestriction.entity.ts';
import { PatientEntity } from '../src/database/entities/patient.entity.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { entities } from '../src/database/index.ts';
import {
    CreateDietaryRestrictionInDatabase,
    GetAllDietaryRestrictionsFromDatabase,
    GetDietaryRestrictionByIdFromDatabase,
    UpdateDietaryRestrictionInDatabase,
    DeleteDietaryRestrictionInDatabase,
    AssignDietaryRestrictionToPatientInDatabase,
    GetPatientDietaryRestrictionsFromDatabase,
    RemoveDietaryRestrictionFromPatientInDatabase,
} from '../src/helpers/dietaryRestriction.helper.ts';

describe('dietaryRestriction.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let dietaryRestrictionRepository: Repository<DietaryRestrictionEntity>;
    let patientRestrictionRepository: Repository<PatientRestrictionEntity>;
    let patientRepository: Repository<PatientEntity>;
    let userRepository: Repository<UserEntity>;
    let existingPatient: PatientEntity;

    beforeAll(async () => {
        dataSource = new DataSource({
            type: 'better-sqlite3',
            database: ':memory:',
            synchronize: true,
            dropSchema: true,
            entities,
        });

        await dataSource.initialize();
        dietaryRestrictionRepository = dataSource.getRepository(DietaryRestrictionEntity);
        patientRestrictionRepository = dataSource.getRepository(PatientRestrictionEntity);
        patientRepository = dataSource.getRepository(PatientEntity);
        userRepository = dataSource.getRepository(UserEntity);

        const savedUser = await userRepository.save({
            username: 'test-user',
            passwordHash: 'test-pass',
        });

        existingPatient = await patientRepository.save({
            user: savedUser,
            firstName: 'Patient',
            lastName: 'User',
            birthDate: '1990-01-01',
            gender: 'Male',
            ethnicity: 'Unknown',
            weight: 70,
            height: 170,
            activityLevel: 'Moderate',
        });
    });

    afterAll(async () => {
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        await patientRestrictionRepository.clear();
        await dietaryRestrictionRepository.clear();
    });

    it('CreateDietaryRestrictionInDatabase throws when required fields are missing', async () => {
        await expect(
            CreateDietaryRestrictionInDatabase({ name: '', description: '' } as dietaryRestrictionDTO, dietaryRestrictionRepository),
        ).rejects.toThrow(CustomerError);

        await expect(
            CreateDietaryRestrictionInDatabase({ name: 'Keto', description: '' } as dietaryRestrictionDTO, dietaryRestrictionRepository),
        ).rejects.toThrow(CustomerError);
    });

    it('CreateDietaryRestrictionInDatabase returns a mapped dietary restriction', async () => {
        const result = await CreateDietaryRestrictionInDatabase(
            { name: 'Vegan', description: 'No animal products' },
            dietaryRestrictionRepository,
        );

        expect(result).toEqual({
            id: expect.any(String),
            name: 'Vegan',
            description: 'No animal products',
        });
    });

    it('GetAllDietaryRestrictionsFromDatabase returns mapped dietary restrictions', async () => {
        await CreateDietaryRestrictionInDatabase({ name: 'Low Sodium', description: 'Limit sodium' }, dietaryRestrictionRepository);
        await CreateDietaryRestrictionInDatabase({ name: 'Nut Free', description: 'No nuts' }, dietaryRestrictionRepository);

        const result = await GetAllDietaryRestrictionsFromDatabase(dietaryRestrictionRepository);

        expect(result).toEqual(
            expect.arrayContaining([
                { id: expect.any(String), name: 'Low Sodium', description: 'Limit sodium' },
                { id: expect.any(String), name: 'Nut Free', description: 'No nuts' },
            ]),
        );
        expect(result).toHaveLength(2);
    });

    it('GetDietaryRestrictionByIdFromDatabase returns the mapped restriction when found', async () => {
        const created = await CreateDietaryRestrictionInDatabase({ name: 'Paleo', description: 'No processed food' }, dietaryRestrictionRepository);

        const result = await GetDietaryRestrictionByIdFromDatabase(created.id as string, dietaryRestrictionRepository);

        expect(result).toEqual({ id: created.id, name: created.name, description: created.description });
    });

    it('GetDietaryRestrictionByIdFromDatabase throws when the restriction is not found', async () => {
        await expect(GetDietaryRestrictionByIdFromDatabase('missing-id', dietaryRestrictionRepository)).rejects.toThrow(CustomerError);
    });

    it('UpdateDietaryRestrictionInDatabase updates an existing restriction', async () => {
        const created = await CreateDietaryRestrictionInDatabase({ name: 'Low Carb', description: 'Less carbs' }, dietaryRestrictionRepository);

        await UpdateDietaryRestrictionInDatabase(
            created.id as string,
            { name: 'Low Carb Updated', description: 'Even fewer carbs' },
            dietaryRestrictionRepository,
        );

        const updated = await GetDietaryRestrictionByIdFromDatabase(created.id as string, dietaryRestrictionRepository);
        expect(updated.name).toBe('Low Carb Updated');
        expect(updated.description).toBe('Even fewer carbs');
    });

    it('UpdateDietaryRestrictionInDatabase throws when the restriction does not exist', async () => {
        await expect(
            UpdateDietaryRestrictionInDatabase('missing-id', { name: 'Missing', description: 'Missing desc' }, dietaryRestrictionRepository),
        ).rejects.toThrow(CustomerError);
    });

    it('DeleteDietaryRestrictionInDatabase removes the restriction', async () => {
        const created = await CreateDietaryRestrictionInDatabase({ name: 'Sugar Free', description: 'No sugar' }, dietaryRestrictionRepository);

        await DeleteDietaryRestrictionInDatabase(created.id as string, dietaryRestrictionRepository);

        await expect(GetDietaryRestrictionByIdFromDatabase(created.id as string, dietaryRestrictionRepository)).rejects.toThrow(CustomerError);
    });

    it('DeleteDietaryRestrictionInDatabase throws when the restriction does not exist', async () => {
        await expect(DeleteDietaryRestrictionInDatabase('missing-id', dietaryRestrictionRepository)).rejects.toThrow(CustomerError);
    });

    it('AssignDietaryRestrictionToPatientInDatabase returns the created mapping', async () => {
        const created = await CreateDietaryRestrictionInDatabase({ name: 'Vegan', description: 'No animal products' }, dietaryRestrictionRepository);

        const result = await AssignDietaryRestrictionToPatientInDatabase(
            { patientId: existingPatient.id, dietaryRestrictionId: created.id as string },
            patientRestrictionRepository,
        );

        expect(result).toEqual({ patientId: existingPatient.id, dietaryRestrictionId: created.id });
    });

    it('GetPatientDietaryRestrictionsFromDatabase returns mapped dietary restrictions for a patient', async () => {
        const restriction1 = await CreateDietaryRestrictionInDatabase({ name: 'Dairy Free', description: 'No dairy' }, dietaryRestrictionRepository);
        const restriction2 = await CreateDietaryRestrictionInDatabase({ name: 'Soy Free', description: 'No soy' }, dietaryRestrictionRepository);

        await AssignDietaryRestrictionToPatientInDatabase(
            { patientId: existingPatient.id, dietaryRestrictionId: restriction1.id as string },
            patientRestrictionRepository,
        );
        await AssignDietaryRestrictionToPatientInDatabase(
            { patientId: existingPatient.id, dietaryRestrictionId: restriction2.id as string },
            patientRestrictionRepository,
        );

        const result = await GetPatientDietaryRestrictionsFromDatabase(existingPatient.id, patientRestrictionRepository);
        expect(result).toEqual(
            expect.arrayContaining([
                { id: restriction1.id, name: restriction1.name, description: restriction1.description },
                { id: restriction2.id, name: restriction2.name, description: restriction2.description },
            ]),
        );
        expect(result).toHaveLength(2);
    });

    it('RemoveDietaryRestrictionFromPatientInDatabase deletes when mapping exists', async () => {
        const created = await CreateDietaryRestrictionInDatabase({ name: 'Gluten Free', description: 'No gluten' }, dietaryRestrictionRepository);
        await AssignDietaryRestrictionToPatientInDatabase(
            { patientId: existingPatient.id, dietaryRestrictionId: created.id as string },
            patientRestrictionRepository,
        );

        await RemoveDietaryRestrictionFromPatientInDatabase(
            { patientId: existingPatient.id, dietaryRestrictionId: created.id as string },
            patientRestrictionRepository,
        );

        const mapping = await patientRestrictionRepository.findOne({ where: { patientId: existingPatient.id, dietaryRestrictionId: created.id as string } });
        expect(mapping).toBeNull();
    });

    it('RemoveDietaryRestrictionFromPatientInDatabase throws when the mapping does not exist', async () => {
        await expect(
            RemoveDietaryRestrictionFromPatientInDatabase(
                { patientId: existingPatient.id, dietaryRestrictionId: 'missing-id' },
                patientRestrictionRepository,
            ),
        ).rejects.toThrow(CustomerError);
    });
});
