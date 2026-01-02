import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MovementService } from './movement.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';

@Controller('movement')
export class MovementController {
  constructor(private readonly service: MovementService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/departure')
  async getDepartureList(@Query('page') page = 1, @Query('limit') limit = 10, @Query('filters') filters = '[]') {
    return await this.service.getDepartureList({ page, limit }, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/arrival')
  async getArrivalList(@Query('page') page = 1, @Query('limit') limit = 10, @Query('filters') filters = '[]') {
    return await this.service.getArrivalList({ page, limit }, filters);
  }
}
