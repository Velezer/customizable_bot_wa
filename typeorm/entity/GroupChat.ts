import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { BotLevel } from "../../src/groups/interface"
import { GroupMenuEntity } from './GroupMenu'
import { LocalColumn } from '../helper/LocalColumn'

@Entity('group_chat')
export class GroupChatEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

    @Column({ nullable: true })
    welcome!: string

    @LocalColumn({ type: 'enum', enum: BotLevel, default: BotLevel.BASIC }, 'simple-enum')
    botLevel!: BotLevel

    @Column({ default: false })
    blacklist!: boolean

    @OneToMany(() => GroupMenuEntity, groupMenu => groupMenu.groupChat)
    groupMenu!: GroupMenuEntity[]

    @LocalColumn({ type: 'timestamp', default: null }, 'datetime')
    trialExpiredAt!: Date

    @LocalColumn({ type: 'timestamp', default: null }, 'datetime')
    sewaExpiredAt!: Date
}
