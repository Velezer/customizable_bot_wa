import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('auth')
export class AuthEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true, nullable: false })
    name!: string

    @Column()
    authInfo!: string

}
