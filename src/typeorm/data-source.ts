import { DataSource } from "typeorm";
import { AuthEntity } from "./entity/AuthEntity";
import { GroupChatEntity } from "./entity/GroupChatEntity";
import { GroupMenuEntity } from "./entity/GroupMenuEntity";
import { ImageStorageEntity } from './entity/ImageEntity';
import * as UriParser from "pg-connection-string";

const entities = [GroupChatEntity, GroupMenuEntity, AuthEntity, ImageStorageEntity]
const pgUri = UriParser.parse(process.env.DB_PG_URI!)

export const DataSources = {
    betterSqlite3: new DataSource({
        type: 'better-sqlite3',
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        logging: false,
        entities,
        migrations: [],
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
        migrations: [],
        subscribers: [],
    }),
}