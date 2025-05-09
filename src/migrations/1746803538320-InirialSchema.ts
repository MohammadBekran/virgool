import { MigrationInterface, QueryRunner } from 'typeorm';

export class $InitialSchema1746803538320 implements MigrationInterface {
  name = ' $InitialSchema1746803538320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "priority" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "categoryId" uuid NOT NULL, CONSTRAINT "PK_32b67ddf344608b5c2fb95bc90c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_bookmark" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "userId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_308a2c00d2e1caa1cb97a6a72a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "userId" uuid NOT NULL, "parentId" uuid, "content" character varying NOT NULL, "accepted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9966897a2479f8064249ee9cf9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_like" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "userId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d585611bb427ede279c3f55572" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "time_to_read" character varying NOT NULL, "description" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying, "authorId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0dc7e58d73a1390874a663bd599" UNIQUE ("slug"), CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "location" character varying NOT NULL, "alt" character varying NOT NULL, "userId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "follow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "followingId" uuid NOT NULL, "followerId" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expiresIn" TIMESTAMP NOT NULL, "method" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nick_name" character varying NOT NULL, "biography" character varying, "profile_image" character varying, "background_image" character varying, "gender" character varying, "birthday" TIMESTAMP, "linkedin_profile" character varying, "x_profile" character varying, "userId" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'block')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying, "phone" character varying, "new_phone" character varying, "email" character varying, "new_email" character varying, "is_email_verified" boolean DEFAULT false, "is_phone_verified" boolean DEFAULT false, "password" character varying, "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{user}', "status" "public"."user_status_enum" NOT NULL DEFAULT 'active', "otpId" uuid, "profileId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_483a6adaf636e520039e97ef61" UNIQUE ("otpId"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_category" ADD CONSTRAINT "FK_2aaa4f0c0157842269566dd7dcd" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_category" ADD CONSTRAINT "FK_ddc1b5494f40c12c5e71c0150ec" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_bookmark" ADD CONSTRAINT "FK_b300c1b6a11c87ae319e21db579" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_bookmark" ADD CONSTRAINT "FK_452da4c8db194029913db436f65" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comment" ADD CONSTRAINT "FK_7b819552c1addfd07b5ae00aa54" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comment" ADD CONSTRAINT "FK_d8b02d6727c5fde43cf353c83dd" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comment" ADD CONSTRAINT "FK_ceb37dcb23a71bf6d2fdcaa9999" FOREIGN KEY ("parentId") REFERENCES "blog_comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_like" ADD CONSTRAINT "FK_8593bfadb48f1d071b7f870a3ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_like" ADD CONSTRAINT "FK_829d592b8a4efff93ce9dd5a1c6" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_dc40417dfa0c7fbd70b8eb880cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_483a6adaf636e520039e97ef617" FOREIGN KEY ("otpId") REFERENCES "otp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_483a6adaf636e520039e97ef617"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_dc40417dfa0c7fbd70b8eb880cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" DROP CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_like" DROP CONSTRAINT "FK_829d592b8a4efff93ce9dd5a1c6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_like" DROP CONSTRAINT "FK_8593bfadb48f1d071b7f870a3ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comment" DROP CONSTRAINT "FK_ceb37dcb23a71bf6d2fdcaa9999"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comment" DROP CONSTRAINT "FK_d8b02d6727c5fde43cf353c83dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comment" DROP CONSTRAINT "FK_7b819552c1addfd07b5ae00aa54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_bookmark" DROP CONSTRAINT "FK_452da4c8db194029913db436f65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_bookmark" DROP CONSTRAINT "FK_b300c1b6a11c87ae319e21db579"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_category" DROP CONSTRAINT "FK_ddc1b5494f40c12c5e71c0150ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_category" DROP CONSTRAINT "FK_2aaa4f0c0157842269566dd7dcd"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
    await queryRunner.query(`DROP TABLE "profile"`);
    await queryRunner.query(`DROP TABLE "otp"`);
    await queryRunner.query(`DROP TABLE "follow"`);
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TABLE "blog_like"`);
    await queryRunner.query(`DROP TABLE "blog_comment"`);
    await queryRunner.query(`DROP TABLE "blog_bookmark"`);
    await queryRunner.query(`DROP TABLE "blog_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
