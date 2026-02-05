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
  async list(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
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
