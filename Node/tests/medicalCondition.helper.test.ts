import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import CustomerError from '../src/models/error.types.ts';
import { medicalConditionDTO } from '../src/models/medicalCondition.types.ts';
import { MedicalConditionEntity } from '../src/database/entities/medicalCondition.entity.ts';
import { PatientConditionEntity } from '../src/database/entities/patientConditions.entity.ts';
import { PatientEntity } from '../src/database/entities/patient.entity.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { entities } from '../src/database/index.ts';
import {
    CreateMedicalConditionInDatabase,
    GetAllMedicalConditionsFromDatabase,
    GetMedicalConditionByIdFromDatabase,
    UpdateMedicalConditionInDatabase,
    DeleteMedicalConditionInDatabase,
    AssignMedicalConditionToPatientInDatabase,
    GetPatientMedicalConditionsFromDatabase,
    RemoveMedicalConditionFromPatientInDatabase,
} from '../src/helpers/medicalCondition.helper.ts';

describe('medicalCondition.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let medicalConditionRepository: Repository<MedicalConditionEntity>;
    let patientConditionRepository: Repository<PatientConditionEntity>;
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
        medicalConditionRepository = dataSource.getRepository(MedicalConditionEntity);
        patientConditionRepository = dataSource.getRepository(PatientConditionEntity);
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
        await patientConditionRepository.clear();
        await medicalConditionRepository.clear();
    });

    it('CreateMedicalConditionInDatabase throws when required fields are missing', async () => {
        await expect(
            CreateMedicalConditionInDatabase({ name: '', description: '' } as medicalConditionDTO, medicalConditionRepository),
        ).rejects.toThrow(CustomerError);

        await expect(
            CreateMedicalConditionInDatabase({ name: 'Keto', description: '' } as medicalConditionDTO, medicalConditionRepository),
        ).rejects.toThrow(CustomerError);
    });

    it('CreateMedicalConditionInDatabase returns a mapped medical condition', async () => {
        const result = await CreateMedicalConditionInDatabase(
            { name: 'Vegan', description: 'No animal products' },
            medicalConditionRepository,
        );

        expect(result).toEqual({
            id: expect.any(String),
            name: 'Vegan',
            description: 'No animal products',
        });
    });

    it('GetAllMedicalConditionsFromDatabase returns mapped medical conditions', async () => {
        await CreateMedicalConditionInDatabase({ name: 'Low Sodium', description: 'Limit sodium' }, medicalConditionRepository);
        await CreateMedicalConditionInDatabase({ name: 'Nut Free', description: 'No nuts' }, medicalConditionRepository);

        const result = await GetAllMedicalConditionsFromDatabase(medicalConditionRepository);

        expect(result).toEqual(
            expect.arrayContaining([
                { id: expect.any(String), name: 'Low Sodium', description: 'Limit sodium' },
                { id: expect.any(String), name: 'Nut Free', description: 'No nuts' },
            ]),
        );
        expect(result).toHaveLength(2);
    });

    it('GetMedicalConditionByIdFromDatabase returns the mapped condition when found', async () => {
        const created = await CreateMedicalConditionInDatabase({ name: 'Paleo', description: 'No processed food' }, medicalConditionRepository);

        const result = await GetMedicalConditionByIdFromDatabase(created.id as string, medicalConditionRepository);

        expect(result).toEqual({ id: created.id, name: created.name, description: created.description });
    });

    it('GetMedicalConditionByIdFromDatabase throws when the condition is not found', async () => {
        await expect(GetMedicalConditionByIdFromDatabase('missing-id', medicalConditionRepository)).rejects.toThrow(CustomerError);
    });

    it('UpdateMedicalConditionInDatabase updates an existing condition', async () => {
        const created = await CreateMedicalConditionInDatabase({ name: 'Low Carb', description: 'Less carbs' }, medicalConditionRepository);

        await UpdateMedicalConditionInDatabase(
            created.id as string,
            { name: 'Low Carb Updated', description: 'Even fewer carbs' },
            medicalConditionRepository,
        );

        const updated = await GetMedicalConditionByIdFromDatabase(created.id as string, medicalConditionRepository);
        expect(updated.name).toBe('Low Carb Updated');
        expect(updated.description).toBe('Even fewer carbs');
    });

    it('UpdateMedicalConditionInDatabase throws when the condition does not exist', async () => {
        await expect(
            UpdateMedicalConditionInDatabase('missing-id', { name: 'Missing', description: 'Missing desc' }, medicalConditionRepository),
        ).rejects.toThrow(CustomerError);
    });

    it('DeleteMedicalConditionInDatabase removes the condition', async () => {
        const created = await CreateMedicalConditionInDatabase({ name: 'Sugar Free', description: 'No sugar' }, medicalConditionRepository);

        await DeleteMedicalConditionInDatabase(created.id as string, medicalConditionRepository);

        await expect(GetMedicalConditionByIdFromDatabase(created.id as string, medicalConditionRepository)).rejects.toThrow(CustomerError);
    });

    it('DeleteMedicalConditionInDatabase throws when the condition does not exist', async () => {
        await expect(DeleteMedicalConditionInDatabase('missing-id', medicalConditionRepository)).rejects.toThrow(CustomerError);
    });

    it('AssignMedicalConditionToPatientInDatabase returns the created mapping', async () => {
        const created = await CreateMedicalConditionInDatabase({ name: 'Vegan', description: 'No animal products' }, medicalConditionRepository);

        const result = await AssignMedicalConditionToPatientInDatabase(
            { patientId: existingPatient.id, medicalConditionId: created.id as string },
            patientConditionRepository,
        );

        expect(result).toEqual({ patientId: existingPatient.id, medicalConditionId: created.id });
    });

    it('GetPatientMedicalConditionsFromDatabase returns mapped medical conditions for a patient', async () => {
        const condition1 = await CreateMedicalConditionInDatabase({ name: 'Dairy Free', description: 'No dairy' }, medicalConditionRepository);
        const condition2 = await CreateMedicalConditionInDatabase({ name: 'Soy Free', description: 'No soy' }, medicalConditionRepository);

        await AssignMedicalConditionToPatientInDatabase(
            { patientId: existingPatient.id, medicalConditionId: condition1.id as string },
            patientConditionRepository,
        );
        await AssignMedicalConditionToPatientInDatabase(
            { patientId: existingPatient.id, medicalConditionId: condition2.id as string },
            patientConditionRepository,
        );

        const result = await GetPatientMedicalConditionsFromDatabase(existingPatient.id, patientConditionRepository);
        expect(result).toEqual(
            expect.arrayContaining([
                { id: condition1.id, name: condition1.name, description: condition1.description },
                { id: condition2.id, name: condition2.name, description: condition2.description },
            ]),
        );
        expect(result).toHaveLength(2);
    });

    it('RemoveMedicalConditionFromPatientInDatabase deletes when mapping exists', async () => {
        const created = await CreateMedicalConditionInDatabase({ name: 'Gluten Free', description: 'No gluten' }, medicalConditionRepository);
        await AssignMedicalConditionToPatientInDatabase(
            { patientId: existingPatient.id, medicalConditionId: created.id as string },
            patientConditionRepository,
        );

        await RemoveMedicalConditionFromPatientInDatabase(
            { patientId: existingPatient.id, medicalConditionId: created.id as string },
            patientConditionRepository,
        );

        const mapping = await patientConditionRepository.findOne({ where: { patientId: existingPatient.id, medicalConditionId: created.id as string } });
        expect(mapping).toBeNull();
    });

    it('RemoveMedicalConditionFromPatientInDatabase throws when the mapping does not exist', async () => {
        await expect(
            RemoveMedicalConditionFromPatientInDatabase(
                { patientId: existingPatient.id, medicalConditionId: 'missing-id' },
                patientConditionRepository,
            ),
        ).rejects.toThrow(CustomerError);
    });
});
