import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('settings')
export class SettingsController {
	constructor(private readonly service: SettingsService) { }

	@UseGuards(JwtAuthGuard)
	@Get('/:refName')
	async getRefByName(@Req() req, @Query('filters') filters) {
		return await this.service.getList(req.params.refName, filters)
	}
}
