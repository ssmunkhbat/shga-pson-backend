import { Controller, Get, Post, Param, Query, Req, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriAddressService } from './address.service';

@Controller('address')
export class PriAddressController {
	constructor(
    private readonly service: PriAddressService,
  ) { }

  //#region [LIST]

	@UseGuards(JwtAuthGuard)
	@Get()
  async list(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.list({ limit, page }, search);
  }

  //#endregion

}
