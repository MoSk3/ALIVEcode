import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { AdminUserEntity } from 'nestjs-admin';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db.sqlite3',
  entities: ['dist/src/**/entities/*.entity.js', AdminUserEntity],
  synchronize: true,
};
export default config;
