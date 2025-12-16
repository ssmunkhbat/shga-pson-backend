import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './typeorm.config';
import { OracleProvider } from './oracle.provider';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  providers: [OracleProvider],
  exports: [OracleProvider],
})
export class DatabaseModule {}
