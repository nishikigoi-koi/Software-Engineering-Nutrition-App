import { NextFunction, Request, Response } from 'express';
import { UserDTO , User} from "../models/user.types.ts";
import CustomerError from '../models/error.types.ts';
import { userRepository } from '../database/repostitories.ts';
import { comparePassword, hashPassword } from '../controllers/user.controller.ts';
import { generateToken } from '../controllers/user.controller.ts';
import { CreateUserInDatabase , GetUserFromDatabase , GetAllUsersFromDatabase, UpdateUserInDatabase,DeleteUserInDatabase, LoginUserFromDatabase} from '../helpers/user.helper.ts';

export async function CreateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userDTO = req.body as UserDTO;
        const user = await CreateUserInDatabase(userDTO, userRepository);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function GetUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const user = await GetUserFromDatabase(id, userRepository)
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export async function GetAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await GetAllUsersFromDatabase(userRepository)
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export async function UpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const userDTO = req.body as UserDTO;
        await UpdateUserInDatabase(id,userDTO,userRepository)
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        next(error);
    }
}

export async function DeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        await DeleteUserInDatabase(id, userRepository)
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function LoginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const userDTO = req.body as UserDTO;
        const userLogin = await LoginUserFromDatabase(userDTO,userRepository)
        res.status(200 as number).json(userLogin);
    } catch (error) {
        next(error);
    }
}


