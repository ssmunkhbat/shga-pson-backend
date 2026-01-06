import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RoleService } from './role.service';

@Controller('settings')
export class SettingsController {
	constructor(
		private readonly service: SettingsService,
		private readonly roleService: RoleService,
	) { }

  //#region [MENU]

	@UseGuards(JwtAuthGuard)
	@Get('menu/top')
	async getMenuTop(@Req() req) {
		return await this.service.getMenu(req.user);
	}

  //#endregion

  //#region [ROLE]

	@UseGuards(JwtAuthGuard)
	@Get('/roles')
	async roleList(@Req() req, @Query('limit') limit, @Query('page') page, @Query('search') search) {
		return await this.roleService.getList({ limit, page }, search, req.user)
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('/roles')
	async rolePost(@Req() req, @Body() body) {
		return await this.roleService.create(body, req.user)
	}
	
	@UseGuards(JwtAuthGuard)
	@Put('/roles')
	async rolePut(@Req() req, @Body() body) {
		return await this.roleService.update(body, req.user)
	}

  //#endregion

}
