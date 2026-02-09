import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriLeaveValidationDto } from 'src/dto/validation/pri/leave/leave.validation.dto';
@Controller('leave')
export class LeaveController {
  constructor(private readonly service: LeaveService) {
  }
  @Get('hello')
  getHello () : string {
    return this.service.getHello()
  }
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createAndUpdate(@Body() dto: PriLeaveValidationDto, @Req() req) {
    return this.service.createAndUpdate(dto, req.user)
  }
}
