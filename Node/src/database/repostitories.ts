import { AppDataSource } from "../config/ormconfig.ts";
import { UserEntity } from "./entities/user.entity.ts";


export const userRepository = AppDataSource.getRepository(UserEntity);

