import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db.sqlite3',
  entities: ['dist/src/**/entities/*.entity.js', 'node_modules/nestjs-admin/**/*.entity.js'],
  synchronize: true,
  migrations: ['dist/src/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
export default config;
