import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { MovementService } from './movement.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { CreateMovementDepartureDto } from './dto/CreateMovementDeparture.dto';
import { CreateMovementArrivalDto } from './dto/CreateMovementArrival.dto';

@Controller('movement')
export class MovementController {
  constructor(private readonly service: MovementService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/departure')
  async getDepartureList(@Query('page') page = 1, @Query('limit') limit = 10, @Query('filters') filters = '[]') {
    return await this.service.getDepartureList({ page, limit }, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/departure')
  async registerDeparture(@Request() req, @Body() dto: CreateMovementDepartureDto) {
    return await this.service.registerDeparture(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/arrival')
  async getArrivalList(@Query('page') page = 1, @Query('limit') limit = 10, @Query('filters') filters = '[]') {
    return await this.service.getArrivalList({ page, limit }, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/arrival')
  async registerArrival(@Request() req, @Body() dto: CreateMovementArrivalDto) {
    return await this.service.registerArrival(req.user, dto);
  }
}
