import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { AdministrativeDecisionService } from './administrative.decision.service';

@Controller('decision')
export class AdministrativeDecisionController {
	constructor(private readonly service: AdministrativeDecisionService) { }

	@UseGuards(JwtAuthGuard)
	@Get()
  async list(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.list({ limit, page }, search);
  }
}
