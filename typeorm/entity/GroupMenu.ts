import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable } from "typeorm"
import { GroupChatEntity } from './GroupChat';
import { AwareColumn } from '../helper/awarecolumn.decorator.ts';

export enum GroupMenuType {
    TEXT = 'text',
    IMAGE = 'image'
}

@Entity('group_menu')
export class GroupMenuEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    key!: string

    @Column()
    value!: string

    @AwareColumn({ type: 'enum', enum: GroupMenuType })
    type!: GroupMenuType

    @ManyToOne(() => GroupChatEntity, (gc) => gc.groupMenu)
    groupChat!: GroupChatEntity;


}
