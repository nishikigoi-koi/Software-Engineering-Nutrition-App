import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO , User} from "../models/user.types.ts";
import CustomerError from '../models/error.types.ts';
import { userRepository } from '../database/repostitories.ts';

export async function CreateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, passwordHash } = req.body as CreateUserDTO;
        if (!username || !passwordHash) {
            throw new CustomerError(400, 'Username and passwordHash are required');
        }
        const user = await userRepository.create({ username, passwordHash });
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function GetUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const user = await userRepository.findOneBy({
            id: id
        });
        if (!user) {
            throw new CustomerError(404, 'User not found');
        }
        res.status(200 as number).json(user);
    } catch (error) {
        next(error);
    }
}

export async function GetAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userRepository.find();
        if (!users || users.length === 0) {
            throw new CustomerError(404, 'User not found');
        }
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export async function UpdateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const { username, passwordHash } = req.body as CreateUserDTO;
        const user = await userRepository.update(id, { username, passwordHash });
        if (!user) {
            throw new CustomerError(404, 'User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export async function DeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id as string;
        const user = await userRepository.delete(id);
        if (!user) {
            throw new CustomerError(404, 'User not found');
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function GetUserByPasswordHash(req: Request, res: Response, next: NextFunction) {
    try {
        const passwordHash = req.params.passwordHash as string;
        const user = await userRepository.findOneBy({
            passwordHash: passwordHash
        });
        if (!user) {
            throw new CustomerError(404, 'User not found');
        }
        res.status(200 as number).json(user);
    } catch (error) {
        next(error);
    }
}
