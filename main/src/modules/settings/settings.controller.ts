import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('settings')
export class SettingsController {
	constructor(private readonly service: SettingsService) { }

	@UseGuards(JwtAuthGuard)
	@Get('menu/top')
	async getMenuTop(@Req() req) {
		return await this.service.getMenu(req.user);
	}
}
