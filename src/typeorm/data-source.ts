require('dotenv').config()
import { DataSource } from "typeorm";
import { AuthEntity } from "./entity/AuthEntity";
import { GroupChatEntity } from "./entity/GroupChatEntity";
import { GroupMenuEntity } from "./entity/GroupMenuEntity";
import { ImageStorageEntity } from './entity/ImageEntity';
import * as UriParser from "pg-connection-string";
import { BeforeSetLeave1650118480668 } from './../../migrations/1650118480668-BeforeSetLeave';
import { GroupChatLeave1650165115316 } from "../../migrations/1650165115316-GroupChatLeave";

const entities = [GroupChatEntity, GroupMenuEntity, AuthEntity, ImageStorageEntity]
let pgUri: UriParser.ConnectionOptions = {
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}
if (process.env.DB_PG_URI) {
    pgUri = UriParser.parse(process.env.DB_PG_URI!)
}

export const DataSources = {
    betterSqlite3: new DataSource({
        type: 'better-sqlite3',
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        logging: false,
        entities,
        subscribers: [],
    }),
    postgres: new DataSource({
        type: "postgres",
        host: process.env.DB_HOST || pgUri.host!,
        port: +process.env.DB_PORT! || +pgUri.port!,
        username: process.env.DB_USERNAME || pgUri.user,
        password: process.env.DB_PASSWORD || pgUri.password,
        database: process.env.DB_DATABASE || pgUri.database!,
        synchronize: process.env.DB_SYNC === 'true' || false,
        logging: false,
        entities,
        migrations: [
            // BeforeSetLeave1650118480668, 
            GroupChatLeave1650165115316
        ],
        subscribers: [],
    }),
}

export default DataSources.postgres