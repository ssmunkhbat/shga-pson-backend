import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { modules } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // envFilePath: '.env-production',
    }),
    TypeOrmModule.forFeature(Entities),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
