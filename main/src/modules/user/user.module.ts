import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserKey } from 'src/entity/userKey.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserKey]), // ✅ MUST be here
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
