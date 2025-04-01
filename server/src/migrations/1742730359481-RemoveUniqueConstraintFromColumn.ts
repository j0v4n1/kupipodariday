import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraintFromColumn1742730359481 implements MigrationInterface {
    name = 'RemoveUniqueConstraintFromColumn1742730359481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
    }

}
