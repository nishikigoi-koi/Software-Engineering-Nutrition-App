import 'reflect-metadata';
import config, {AppDataSource} from '../config/ormconfig.ts';
import { DataSource } from 'typeorm';

let appDataSource = AppDataSource;

(async () => {
    if (!appDataSource) {
        appDataSource = new DataSource(config);
    }

    appDataSource.initialize()
        .then(() => {
            console.log('[Database]: connected successfull');
        })
        .catch((error) => {
            console.error('[Database]: connection failed', error);
        });
})();