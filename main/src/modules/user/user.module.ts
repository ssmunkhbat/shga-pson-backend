import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UmSystemUser } from 'src/entity/um/um-system-user.entity';
import { UmUserRole } from 'src/entity/um/um-user-role';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UmSystemUser, UmUserRole]), // ✅ MUST be here
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
