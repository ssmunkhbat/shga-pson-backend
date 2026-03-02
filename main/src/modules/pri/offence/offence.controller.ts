import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { OffenceService } from './offence.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Response } from 'express';
import { PriOffenceValidationDto } from 'src/dto/validation/pri/offence/offence.validation.dto';

@Controller('offence')
export class OffenceController {
  constructor(private readonly service: OffenceService) {
  }
  @Get('hello')
  getHello () : string {
    return this.service.getHello()
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getOffenceList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getOffenceList({ page, limit }, search, sort, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('action')
  getOffenceActionList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getOffenceActionList({ page, limit }, search, sort, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAndUpdate(@Body() dto: PriOffenceValidationDto, @Req() req) {
    return this.service.createAndUpdate(dto, req.user)
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return this.service.delete(id, req.user)
  }

  @Get('download/excel')
  async downloadExcel(@Req() req, @Res() res: Response) {
    return this.service.downloadExcel(res, req.user);
  }
}
