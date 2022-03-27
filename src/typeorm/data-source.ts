import { DataSource } from "typeorm";
import { AuthEntity } from "./entity/AuthEntity";
import { GroupChatEntity } from "./entity/GroupChatEntity";
import { GroupMenuEntity } from "./entity/GroupMenuEntity";
import { ImageStorageEntity } from './entity/ImageEntity';
import * as UriParser from "pg-connection-string";

const entities = [GroupChatEntity, GroupMenuEntity, AuthEntity, ImageStorageEntity]
const uriDevpg = UriParser.parse(process.env.DEVPG_URI!)

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
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: false,
        logging: false,
        entities,
        migrations: [],
        subscribers: [],
    }),
    devpg: new DataSource({
        type: "postgres",
        host: uriDevpg.host!,
        port: +uriDevpg.port!,
        username: uriDevpg.user,
        password: uriDevpg.password,
        database: uriDevpg.database!,
        synchronize: true,
        logging: false,
        entities,
        migrations: [],
        subscribers: [],
    }),

}