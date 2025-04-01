import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOwnerColumnToWishlist1742975855299 implements MigrationInterface {
    name = 'AddOwnerColumnToWishlist1742975855299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishlists" ADD CONSTRAINT "FK_fb4ebe59fc41632038a442821db" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlists" DROP CONSTRAINT "FK_fb4ebe59fc41632038a442821db"`);
        await queryRunner.query(`ALTER TABLE "offers" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "raised" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishes" ALTER COLUMN "price" TYPE integer`);
        await queryRunner.query(`ALTER TABLE "wishlists" DROP COLUMN "ownerId"`);
    }

}
