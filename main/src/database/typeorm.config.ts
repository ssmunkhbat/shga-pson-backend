import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'oracle',
  host:  process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  synchronize: false,
  sid: process.env.DB_SID,
  autoLoadEntities: true,
  poolSize: 90
};

export default typeOrmConfig;