import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupChatLeave1650165115316 implements MigrationInterface {
    name = 'GroupChatLeave1650165115316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_chat" ADD "leave" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_chat" DROP COLUMN "leave"`);
    }

}
