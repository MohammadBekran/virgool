import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;

  return {
    type: 'postgres',
    host: DB_HOST,
    database: DB_NAME,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: true,
    autoLoadEntities: false,
    synchronize: true,
    entities: ['dist/**/**/*.entity{.ts, .js}', 'dist/**/*.entity{.ts, .js}'],
  };
}
