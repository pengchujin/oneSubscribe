import {MigrationInterface, QueryRunner} from "typeorm";

export class default1543503641364 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "subscribe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_3e91e772184cd3feb30688ef1b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(20) NOT NULL, "encryptedPassword" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user"  ("username") `);
        await queryRunner.query(`CREATE TYPE "node_type_enum" AS ENUM('SSR', 'V2RAY', 'SS')`);
        await queryRunner.query(`CREATE TABLE "node" ("id" SERIAL NOT NULL, "type" "node_type_enum" NOT NULL DEFAULT 'SS', "info" jsonb NOT NULL, "serial" integer NOT NULL DEFAULT 0, "userId" uuid, CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscribe_nodes_node" ("subscribeId" uuid NOT NULL, "nodeId" integer NOT NULL, CONSTRAINT "PK_1a8bb4946e1da27bdadd7ec93f6" PRIMARY KEY ("subscribeId", "nodeId"))`);
        await queryRunner.query(`ALTER TABLE "subscribe" ADD CONSTRAINT "FK_78138550e21d8b67790d761148d" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_49e3f89e68914252136980d77ac" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "subscribe_nodes_node" ADD CONSTRAINT "FK_5431255c89447391dcbb89c547c" FOREIGN KEY ("subscribeId") REFERENCES "subscribe"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "subscribe_nodes_node" ADD CONSTRAINT "FK_bfe7ead80efc6fdba7761b745b1" FOREIGN KEY ("nodeId") REFERENCES "node"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "subscribe_nodes_node" DROP CONSTRAINT "FK_bfe7ead80efc6fdba7761b745b1"`);
        await queryRunner.query(`ALTER TABLE "subscribe_nodes_node" DROP CONSTRAINT "FK_5431255c89447391dcbb89c547c"`);
        await queryRunner.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_49e3f89e68914252136980d77ac"`);
        await queryRunner.query(`ALTER TABLE "subscribe" DROP CONSTRAINT "FK_78138550e21d8b67790d761148d"`);
        await queryRunner.query(`DROP TABLE "subscribe_nodes_node"`);
        await queryRunner.query(`DROP TABLE "node"`);
        await queryRunner.query(`DROP TYPE "node_type_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "subscribe"`);
    }

}
