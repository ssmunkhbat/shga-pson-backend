import { Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriLeaveValidationDto } from 'src/dto/validation/pri/leave/leave.validation.dto';
import { PriLeaveReceivedValidationDto } from 'src/dto/validation/pri/leave/leaveReceived.validation.dto';
import { Response } from 'express';

@Controller('leave')
export class LeaveController {
  constructor(private readonly service: LeaveService) {
  }
  @Get('hello')
  getHello () : string {
    return this.service.getHello()
  }
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createAndUpdate(@Body() dto: PriLeaveValidationDto, @Req() req) {
    return this.service.createAndUpdate(dto, req.user)
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id: number) {
    return this.service.delete(id, req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Post('received')
  received(@Body() dto: PriLeaveReceivedValidationDto, @Req() req) {
    return this.service.received(dto, req.user)
  }
  
  @Get('download/excel')
  async downloadExcel(@Req() req, @Res() res: Response) {
    return this.service.downloadExcel(res, req.user);
  }
}
