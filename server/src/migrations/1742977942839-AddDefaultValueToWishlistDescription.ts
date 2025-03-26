import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultValueToWishlistDescription1742977942839 implements MigrationInterface {
    name = 'AddDefaultValueToWishlistDescription1742977942839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" ALTER COLUMN "description" SET DEFAULT 'Подборка подарков для любого случая.'`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishlists" ALTER COLUMN "description" DROP DEFAULT`);
    }

}
