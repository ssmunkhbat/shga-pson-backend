import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriDetentionService } from './detention.service';

@Controller('pri-detention-time')
export class PriDetentionController {
  constructor(private readonly service: PriDetentionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTsagdanTimeList(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]') {
    return await this.service.getTsagdanTimeList({ page, limit }, search, req.user);
  }
}
