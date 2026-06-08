import 'reflect-metadata';
import { DataSource, Repository } from 'typeorm';
import { CreateUserInDatabase, DeleteUserInDatabase, GetAllUsersFromDatabase, GetUserFromDatabase, LoginUserFromDatabase, UpdateUserInDatabase } from '../src/helpers/user.helper.ts';
import { UserEntity } from '../src/database/entities/user.entity.ts';
import { hashPassword } from '../src/controllers/user.controller.ts';
import CustomerError from '../src/models/error.types.ts';
import { entities } from '../src/database/index.ts';

describe('user.helper.ts with in-memory database', () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserEntity>;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';

        // Create in-memory database
        dataSource = new DataSource({
            type: 'better-sqlite3',
            database: ':memory:',
            synchronize: true,
            dropSchema: true,
            entities: entities,
        });

        await dataSource.initialize();
        userRepository = dataSource.getRepository(UserEntity);
    });

    afterAll(async () => {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Clear users before each test
        await userRepository.clear();
    });

    it('CreateUserInDatabase throws when username or password is missing', async () => {
        await expect(CreateUserInDatabase({ username: '', password: 'abc' }, userRepository)).rejects.toThrow(CustomerError);
        await expect(CreateUserInDatabase({ username: 'user', password: '' }, userRepository)).rejects.toThrow(CustomerError);
    });

    it('CreateUserInDatabase saves a user and returns sanitized object', async () => {
        const result = await CreateUserInDatabase({ username: 'alice', password: 'password123' }, userRepository);

        expect(result.username).toBe('alice');
        expect((result as any).passwordHash).toBeUndefined();
        
        // Verify it was actually saved to the database
        const savedUser = await userRepository.findOneBy({ username: 'alice' });
        expect(savedUser).toBeDefined();
        expect(savedUser?.username).toBe('alice');
    });

    it('GetUserFromDatabase throws if user not found', async () => {
        await expect(GetUserFromDatabase('non-existent-id', userRepository)).rejects.toThrow(CustomerError);
    });

    it('GetUserFromDatabase returns user without passwordHash', async () => {
        // Create a user first
        const created = await CreateUserInDatabase({ username: 'bob', password: 'secret' }, userRepository);
        
        // Retrieve it by ID
        const result = await GetUserFromDatabase(created.id, userRepository);

        expect(result.username).toBe('bob');
        expect((result as any).passwordHash).toBeUndefined();
    });

    it('GetAllUsersFromDatabase throws when no users exist', async () => {
        await expect(GetAllUsersFromDatabase(userRepository)).rejects.toThrow(CustomerError);
    });

    it('GetAllUsersFromDatabase returns all users without passwordHash', async () => {
        // Create multiple users
        await CreateUserInDatabase({ username: 'alice', password: 'pass1' }, userRepository);
        await CreateUserInDatabase({ username: 'bob', password: 'pass2' }, userRepository);
        
        const results = await GetAllUsersFromDatabase(userRepository);

        expect(results).toHaveLength(2);
        expect(results.map(u => u.username)).toEqual(expect.arrayContaining(['alice', 'bob']));
        results.forEach(user => {
            expect((user as any).passwordHash).toBeUndefined();
        });
    });

    it('UpdateUserInDatabase updates an existing user', async () => {
        // Create a user
        const created = await CreateUserInDatabase({ username: 'carol', password: 'oldpass' }, userRepository);
        
        // Update the user
        await UpdateUserInDatabase(created.id, { username: 'carol-updated', password: 'newpass' }, userRepository);
        
        // Verify the update
        const updated = await GetUserFromDatabase(created.id, userRepository);
        expect(updated.username).toBe('carol-updated');
    });

    it('UpdateUserInDatabase throws if user does not exist', async () => {
        await expect(UpdateUserInDatabase('non-existent-id', { username: 'dave', password: 'newpass' }, userRepository)).rejects.toThrow(CustomerError);
    });

    it('LoginUserFromDatabase returns token on valid credentials', async () => {
        const password = 'password123';
        await CreateUserInDatabase({ username: 'eve', password }, userRepository);
        
        const result = await LoginUserFromDatabase({ username: 'eve', password }, userRepository);

        expect(result.token).toBeDefined();
        expect(result.user.username).toBe('eve');
        expect((result.user as any).passwordHash).toBeUndefined();
    });

    it('LoginUserFromDatabase throws when user not found', async () => {
        await expect(LoginUserFromDatabase({ username: 'nonexistent', password: 'pass' }, userRepository)).rejects.toThrow(CustomerError);
    });

    it('LoginUserFromDatabase throws when password is incorrect', async () => {
        await CreateUserInDatabase({ username: 'frank', password: 'correctpass' }, userRepository);
        
        await expect(LoginUserFromDatabase({ username: 'frank', password: 'wrongpass' }, userRepository)).rejects.toThrow(CustomerError);
    });

    it('DeleteUserInDatabase removes a user', async () => {
        // Create a user
        const created = await CreateUserInDatabase({ username: 'grace', password: 'pass' }, userRepository);
        
        // Delete the user
        await DeleteUserInDatabase(created.id, userRepository);
        
        // Verify deletion
        await expect(GetUserFromDatabase(created.id, userRepository)).rejects.toThrow(CustomerError);
    });

    it('DeleteUserInDatabase throws if user does not exist', async () => {
        await expect(DeleteUserInDatabase('non-existent-id', userRepository)).rejects.toThrow(CustomerError);
    });

});
