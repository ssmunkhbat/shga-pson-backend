import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BodyAttributeService } from './body-attribute.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriPrisonerBodyAttributeValidationDto } from 'src/dto/validation/pri/body-attribute/body-attribute.validation.dto';
@Controller('body/attribute')
export class BodyAttributeController {
  constructor(private readonly service: BodyAttributeService) {
  }
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createAndUpdate(@Body() dto: PriPrisonerBodyAttributeValidationDto, @Req() req) {
    return this.service.createAndUpdate(dto, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return this.service.delete(id, req.user)
  }

}
