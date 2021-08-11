import {MigrationInterface, QueryRunner} from "typeorm";

export class updatePwd1628567454085 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*await queryRunner.query(
      'UPDATE "adminUser" SET password = "$2a$12$L6h0CQ0usv0aHSD6NbNqAedHFD/NTjDPqtqHwqZiWIpiWTHbB5Dgu" WHERE username = "enric"',
    );*/
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }
}
