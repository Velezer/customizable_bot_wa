import { AppDatabase } from '../index';
import { DataSources } from '../data-source';

export class TestDatabase extends AppDatabase {
    constructor() {
        process.env.NODE_ENV = 'test'
        super(DataSources.betterSqlite3)
    }
}