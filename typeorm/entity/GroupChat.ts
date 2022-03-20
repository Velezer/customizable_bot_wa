import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { BotLevel } from "../../src/groups/interface"

@Entity('group_chat')
export class GroupChatEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    jid!: string

    @Column({ nullable: true })
    welcome!: string

    @Column({ type: 'enum', enum: BotLevel, default: BotLevel.BASIC })
    botLevel!: BotLevel

    @Column({
        type: 'timestamp', 
        default: (() => {
            const now = new Date()
            const add1day = new Date(now)
            add1day.setDate(now.getDate() + 1)
            return add1day
        })()
    })
    trialExpiredAt!: boolean

    @Column({ type: 'timestamp', default: null })
    sewaExpiredAt!: Date
}
