import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSelectFalseToColumnPassword1742738790355 implements MigrationInterface {
    name = 'AddSelectFalseToColumnPassword1742738790355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
    }

}
