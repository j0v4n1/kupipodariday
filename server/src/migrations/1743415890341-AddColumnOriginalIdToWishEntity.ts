import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnOriginalIdToWishEntity1743415890341 implements MigrationInterface {
    name = 'AddColumnOriginalIdToWishEntity1743415890341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishes" ADD "originalId" integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" DROP COLUMN "originalId"`);
    }

}
