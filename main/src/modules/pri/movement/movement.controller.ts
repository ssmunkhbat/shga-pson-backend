import { Body, Controller, Get, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { MovementService } from './movement.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { CreateMovementDepartureDto } from 'src/dto/validation/pri/movement/movementDeparture.dto';
import { CreateMovementArrivalDto } from 'src/dto/validation/pri/movement/movementArrival.dto';

@Controller('movement')
export class MovementController {
  constructor(private readonly service: MovementService) { }

  @UseGuards(JwtAuthGuard)
  @Post('/arrival/register')
  async registerArrival(@Body() dto: CreateMovementArrivalDto, @Req() req) {
    return await this.service.registerArrival(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/departure')
  async getDepartureList(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]') {
    return await this.service.getDepartureList({ page, limit }, search, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/departure')
  async registerDeparture(@Request() req, @Body() dto: CreateMovementDepartureDto) {
    return await this.service.registerDeparture(req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/arrival')
  async getArrivalList(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]') {
    return await this.service.getArrivalList({ page, limit }, search, req.user);
  }
}
