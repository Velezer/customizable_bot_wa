import { MigrationInterface, QueryRunner } from "typeorm";

export class BeforeSetLeave1650118480668 implements MigrationInterface {
    name = 'BeforeSetLeave1650118480668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "authInfo" character varying NOT NULL, CONSTRAINT "UQ_62079b42ede8798e6ea2bb6d144" UNIQUE ("name"), CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image_storage" ("id" SERIAL NOT NULL, "image" bytea NOT NULL, CONSTRAINT "PK_836ba481402ccd8bd3bb977fbb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_menu_type_enum" AS ENUM('text', 'image')`);
        await queryRunner.query(`CREATE TABLE "group_menu" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "type" "public"."group_menu_type_enum" NOT NULL, "groupChatId" integer, "imageStorageId" integer, CONSTRAINT "REL_aae9a0212907ab8e8b1a5aace7" UNIQUE ("imageStorageId"), CONSTRAINT "PK_fc2a87b7e6a800424f43acd2cd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_chat_botlevel_enum" AS ENUM('basic', 'elegant')`);
        await queryRunner.query(`CREATE TABLE "group_chat" ("id" SERIAL NOT NULL, "jid" character varying NOT NULL, "welcome" character varying, "botLevel" "public"."group_chat_botlevel_enum" NOT NULL DEFAULT 'basic', "blacklist" boolean NOT NULL DEFAULT false, "trialExpiredAt" TIMESTAMP WITH TIME ZONE, "sewaExpiredAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_9d83b091452c5d53f1ff7bbfebe" UNIQUE ("jid"), CONSTRAINT "PK_a8789ac3c3d35b199a2b9e9b9c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_menu" ADD CONSTRAINT "FK_7424a00332e6116baa619a8f565" FOREIGN KEY ("groupChatId") REFERENCES "group_chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu" ADD CONSTRAINT "FK_aae9a0212907ab8e8b1a5aace75" FOREIGN KEY ("imageStorageId") REFERENCES "image_storage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_menu" DROP CONSTRAINT "FK_aae9a0212907ab8e8b1a5aace75"`);
        await queryRunner.query(`ALTER TABLE "group_menu" DROP CONSTRAINT "FK_7424a00332e6116baa619a8f565"`);
        await queryRunner.query(`DROP TABLE "group_chat"`);
        await queryRunner.query(`DROP TYPE "public"."group_chat_botlevel_enum"`);
        await queryRunner.query(`DROP TABLE "group_menu"`);
        await queryRunner.query(`DROP TYPE "public"."group_menu_type_enum"`);
        await queryRunner.query(`DROP TABLE "image_storage"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
