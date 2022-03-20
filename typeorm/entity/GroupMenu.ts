import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

enum GroupMenuType {
    TEXT = 'text',
    IMAGE = 'image'
}

@Entity('group_menu')
export class GroupMenuEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    jid!: string

    @Column()
    key!: string

    @Column()
    value!: string

    @Column({type: 'enum', enum: GroupMenuType })
    type!: GroupMenuType

    
}
