import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialUserPost1708269424717 implements MigrationInterface {
    name = 'InitialUserPost1708269424717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "phoneNumber" integer NOT NULL, "userId" integer, CONSTRAINT "UQ_16893374de30754b867843fb52e" UNIQUE ("phoneNumber"))`);
        await queryRunner.query(`CREATE TABLE "temporary_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "phoneNumber" integer NOT NULL, "userId" integer, CONSTRAINT "UQ_16893374de30754b867843fb52e" UNIQUE ("phoneNumber"), CONSTRAINT "FK_5369db3bd33839fd3b0dd5525d1" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_item"("id", "name", "phoneNumber", "userId") SELECT "id", "name", "phoneNumber", "userId" FROM "item"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`ALTER TABLE "temporary_item" RENAME TO "item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item" RENAME TO "temporary_item"`);
        await queryRunner.query(`CREATE TABLE "item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "phoneNumber" integer NOT NULL, "userId" integer, CONSTRAINT "UQ_16893374de30754b867843fb52e" UNIQUE ("phoneNumber"))`);
        await queryRunner.query(`INSERT INTO "item"("id", "name", "phoneNumber", "userId") SELECT "id", "name", "phoneNumber", "userId" FROM "temporary_item"`);
        await queryRunner.query(`DROP TABLE "temporary_item"`);
        await queryRunner.query(`DROP TABLE "item"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
