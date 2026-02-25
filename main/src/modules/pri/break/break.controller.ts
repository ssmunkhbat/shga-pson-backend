
import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriPrisonerBreakService } from './break.service';
import { PriPrisonerBreakValidationDto } from 'src/dto/validation/pri/break.dto';
import { PriBreakFoundValidationDto } from 'src/dto/validation/pri/breakFound.dto';

@Controller('pri-break')
export class PriPrisonerBreakController {
  constructor(private readonly breakService: PriPrisonerBreakService) {}

  @UseGuards(JwtAuthGuard)
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.breakService.getList({ page, limit }, search, sort, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAndUpdate(@Body() data: PriPrisonerBreakValidationDto, @Req() req) {
    return this.breakService.createAndUpdate(data, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return this.breakService.delete(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('found')
  found(@Body() dto: PriBreakFoundValidationDto, @Req() req) {
    return this.breakService.found(dto, req.user);
  }
}
