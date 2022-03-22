import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { GroupChatEntity } from "../entity/GroupChatEntity"
import { AppDatabase } from './../db/index';
import { DataSources } from './../db/data-source';

export class TestDatabase extends AppDatabase {
    constructor() {
        process.env.NODE_ENV = 'test'
        super(DataSources.betterSqlite3)
    }
}