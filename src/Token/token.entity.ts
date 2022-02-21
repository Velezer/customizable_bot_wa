import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { tokenSession } from "venom-bot/dist/config/tokenSession.config";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    sessionName!: string;

    @Column('jsonb')
    session!: tokenSession;

}