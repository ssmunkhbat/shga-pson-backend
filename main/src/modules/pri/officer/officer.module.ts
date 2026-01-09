
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfficerController } from './officer.controller';
import { OfficerService } from './officer.service';
import { PriOfficer } from 'src/entity/pri/officer/PriOfficer';

@Module({
  imports: [TypeOrmModule.forFeature([PriOfficer])],
  controllers: [OfficerController],
  providers: [OfficerService],
  exports: [OfficerService],
})
export class OfficerModule {}
