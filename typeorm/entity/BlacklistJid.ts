import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { BotLevel } from "../../src/groups/interface"

@Entity('group_chat')
export class BlacklistJidEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

}
