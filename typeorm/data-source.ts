import "reflect-metadata"
import { DataSource } from "typeorm"
import { GroupChatEntity } from "./entity/GroupChat"
import { GroupMenuEntity } from './entity/GroupMenu';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "192.168.56.102",
    port: 5432,
    username: "user",
    password: "password",
    database: "db_bot_wa",
    synchronize: true,
    logging: false,
    entities: [GroupChatEntity, GroupMenuEntity],
    migrations: [],
    subscribers: [],
})
