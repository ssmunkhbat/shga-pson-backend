import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { RefsService } from './refs.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('refs')
export class RefsController {
	constructor(private readonly service: RefsService) { }

	@UseGuards(JwtAuthGuard)
	@Get('/:refName')
	async getRefByName(@Req() req, @Query('filters') filters) {
		return await this.service.getList(req.params.refName, filters)
	}

	@UseGuards(JwtAuthGuard)
	@Get('/byid/:id')
	async getRefById(@Req() req, @Query('tbl') tbl, @Query('col') col) {
		return await this.service.getListById(req.params.id, tbl, col)
	}
}
