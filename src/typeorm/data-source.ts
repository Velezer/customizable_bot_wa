import { DataSource } from "typeorm";
import { GroupChatEntity } from "./entity/GroupChatEntity";
import { GroupMenuEntity } from "./entity/GroupMenuEntity";

export const DataSources = {
    betterSqlite3: new DataSource({
        type: 'better-sqlite3',
        database: ":memory:",
        dropSchema: true,
        synchronize: true,
        logging: false,
        entities: [GroupChatEntity, GroupMenuEntity],
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
        synchronize: true,
        logging: false,
        entities: [GroupChatEntity, GroupMenuEntity],
        migrations: [],
        subscribers: [],
    })

}