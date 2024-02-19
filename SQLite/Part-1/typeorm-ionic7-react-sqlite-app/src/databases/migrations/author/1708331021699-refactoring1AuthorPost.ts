import { MigrationInterface, QueryRunner } from "typeorm";

export class Refactoring1AuthorPost1708331021699 implements MigrationInterface {
    name = 'Refactoring1AuthorPost1708331021699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_author" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "birthday" varchar, "email" varchar NOT NULL, "company" varchar, CONSTRAINT "UQ_384deada87eb62ab31c5d5afae5" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_author"("id", "name", "birthday", "email") SELECT "id", "name", "birthday", "email" FROM "author"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`ALTER TABLE "temporary_author" RENAME TO "author"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "author" RENAME TO "temporary_author"`);
        await queryRunner.query(`CREATE TABLE "author" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "birthday" varchar, "email" varchar NOT NULL, CONSTRAINT "UQ_384deada87eb62ab31c5d5afae5" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "author"("id", "name", "birthday", "email") SELECT "id", "name", "birthday", "email" FROM "temporary_author"`);
        await queryRunner.query(`DROP TABLE "temporary_author"`);
    }

}
