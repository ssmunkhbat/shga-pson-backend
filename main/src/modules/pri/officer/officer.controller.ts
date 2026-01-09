
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { OfficerService } from './officer.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { Request } from 'express';

@Controller('officer')
@UseGuards(JwtAuthGuard)
export class OfficerController {
  constructor(private readonly officerService: OfficerService) {}

  @Get('list')
  async getList(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Req() req: Request,
  ) {
    return this.officerService.getList(
      {
        page,
        limit,
      },
      search,
    );
  }
}
