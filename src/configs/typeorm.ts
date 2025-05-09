import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

const { DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;

const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  database: DB_NAME,
  port: Number(DB_PORT ?? 5432),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: true,
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});

export default dataSource;
