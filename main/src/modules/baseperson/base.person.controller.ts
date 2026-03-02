import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { BasePersonService } from './base.person.service';

@Controller('person')
export class BasePersonController {
	constructor(private readonly service: BasePersonService) { }

	@UseGuards(JwtAuthGuard)
	@Get()
  async list(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.list({ limit, page }, search);
  }
}
