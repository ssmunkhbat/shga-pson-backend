import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PrisonerService } from './prisoner.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';

@Controller('prisoner')
export class PrisonerController {
	constructor(private readonly service: PrisonerService) { }

	@UseGuards(JwtAuthGuard)
	@Get('all')
  async listAll(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.listAll({ limit, page }, search);
  }
}
