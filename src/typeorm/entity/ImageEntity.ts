import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable, OneToOne } from "typeorm"
import { GroupMenuEntity } from "./GroupMenuEntity";
import { LocalColumn } from './decorator/LocalColumn';


@Entity('image_storage')
export class ImageStorageEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @LocalColumn(
        { type: 'bytea' },
        { type: 'blob' }
    )
    image!: Uint8Array

    @OneToOne(() => GroupMenuEntity, (m) => m.imageStorage, { onDelete: 'CASCADE' })
    // @JoinColumn()
    groupMenu!: GroupMenuEntity;


}
