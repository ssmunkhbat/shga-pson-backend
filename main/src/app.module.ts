import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { modules } from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from './entities';
import { controllers } from './controllers';
import { services } from './services';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forFeature(Entities),
    ...modules,
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}
