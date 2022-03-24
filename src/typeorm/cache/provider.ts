import { DataSource } from "typeorm";
import { DbQueryResultCache } from "typeorm/cache/DbQueryResultCache";

const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: ":memory:",
    dropSchema: true,
    synchronize: true,
    logging: false,
})

export class CacheProvider extends DbQueryResultCache {
    constructor() {
        super(dataSource)
    }
}