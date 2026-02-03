import { Controller, Get, Query, Req } from '@nestjs/common';
import { LeaveService } from './leave.service';
@Controller('leave')
export class LeaveController {
  constructor(private readonly service: LeaveService) {
  }
  @Get('hello')
  getHello () : string {
    return this.service.getHello()
  }
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]') {
    return this.service.getList({ page, limit }, search, req.user)
  }
}
