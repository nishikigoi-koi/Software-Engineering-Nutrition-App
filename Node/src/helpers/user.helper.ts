import { UserDTO , UserDatabaseObject, UserLogin} from "../models/user.types.ts";
import { UserEntity } from "../database/entities/user.entity.ts";
import { Repository } from "typeorm";
import CustomerError from '../models/error.types.ts';
import { comparePassword, generateToken, hashPassword } from '../controllers/user.controller.ts';

export async function CreateUserInDatabase(userDTO: UserDTO, databaseRepo: Repository<UserEntity>): Promise<UserDatabaseObject> {
    const username = userDTO.username;
    const password = userDTO.password;
    if (!username || !password) {
        throw new CustomerError(400, 'Username and password are required');
    }
    const passwordHash = await hashPassword(password);
    const user = await databaseRepo.save({ username, passwordHash });
    user.passwordHash = undefined as unknown as string;
    return user as unknown as UserDatabaseObject;
}

export async function GetUserFromDatabase(id: string, databaseRepo: Repository<UserEntity>): Promise<UserDatabaseObject> {
    const user = await databaseRepo.findOneBy({
        id: id
    }); 
    if (!user) {
        throw new CustomerError(404, 'User not found');
    }
    user.passwordHash = undefined as unknown as string;
    return user as unknown as UserDatabaseObject;
}

export async function GetAllUsersFromDatabase(databaseRepo: Repository<UserEntity>) : Promise<UserDatabaseObject[]>{
    const users = await databaseRepo.find();
    if (!users || users.length === 0) {
        throw new CustomerError(404, 'User not found');
    }
    users.forEach(user => user.passwordHash = undefined as unknown as string);
    const returnUsers = users as unknown as UserDatabaseObject[];
    return returnUsers;
}

export async function UpdateUserInDatabase(id: string, userDTO: UserDTO, databaseRepo: Repository<UserEntity>){
    const username = userDTO.username;
    const password = userDTO.password;
    const passwordHash = await hashPassword(password);
    await GetUserFromDatabase(id,databaseRepo); //checks if user exist
    await databaseRepo.update(id, { username, passwordHash });
    return
}

export async function DeleteUserInDatabase(id: string, databaseRepo: Repository<UserEntity>){
    await GetUserFromDatabase(id, databaseRepo); // checks if user exists
    await databaseRepo.delete(id);
}

export async function LoginUserFromDatabase(userDTO: UserDTO, databaseRepo: Repository<UserEntity>) : Promise<UserLogin> {
    const username = userDTO.username
    const password = userDTO.password  
    const user = await databaseRepo.findOneBy({
        username: username
    });
    if (!user) {
        throw new CustomerError(404, 'User not found');
    }
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
        throw new CustomerError(401, 'Username or password is invalid');
    }
    const token = generateToken(user.id) as string;
    user.passwordHash = undefined as unknown as string;
    const userDatabase = user as unknown as UserDatabaseObject;
    const userLogin: UserLogin = {token: token, user: userDatabase}
    return userLogin as UserLogin;
}