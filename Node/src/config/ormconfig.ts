import {DataSource,DataSourceOptions} from "typeorm";
import {entities} from "../database/index.ts";

const config: DataSourceOptions = {
    type: "better-sqlite3",
    database: "database.sqlite",
    synchronize: true,
    logging: process.env.NODE_ENV === "development" ? false : true,
    entities: entities,
    migrations: ["dist/models/migrations/*.{ts,js}"],
};

export default config;

export const AppDataSource = new DataSource(config);