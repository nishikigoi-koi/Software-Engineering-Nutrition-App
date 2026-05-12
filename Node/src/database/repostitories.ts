import { AppDataSource } from "../config/ormconfig.ts";
import { UserEntity } from "./entities/user.entity";


export const userRepository = AppDataSource.getRepository(UserEntity);

