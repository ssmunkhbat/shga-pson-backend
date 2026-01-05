import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
	constructor(private readonly service: EmployeeService) { }

	@UseGuards(JwtAuthGuard)
	@Get()
  async list(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.list({ limit, page }, search);
  }
}
