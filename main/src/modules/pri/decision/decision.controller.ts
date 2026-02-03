import { Controller, Get, Post, Param, Query, Req, UseGuards, Body, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriDecisionService } from './decision.service';
import { PriDecisionValidationDto } from 'src/dto/validation/pri/decision.dto';

@Controller('decision')
export class PriDecisionController {
	constructor(
    private readonly service: PriDecisionService,
  ) { }

  //#region [LIST]

	@UseGuards(JwtAuthGuard)
	@Get()
  async list(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.list({ limit, page }, search);
  }

  //#endregion

  //#region [CRUD]

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAndUpdate(@Body() dto: PriDecisionValidationDto, @Req() req) {
    await this.service.createAndUpdate(dto, req.user);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Req() req, @Param('id') id: number) {
    await this.service.delete(id, req.user);
    return { success: true };
  }

  //#endregion

}
