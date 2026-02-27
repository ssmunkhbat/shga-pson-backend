import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SymptomService } from './symptom.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriRotlValidationDto } from 'src/dto/validation/pri/rotl/rotl.validation.dto';
@Controller('symptom')
export class SymptomController {
  constructor(private readonly service: SymptomService) {
  }
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createAndUpdate(@Body() dto: PriRotlValidationDto, @Req() req) {
    return this.service.createAndUpdate(dto, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return this.service.delete(id, req.user)
  }

}
