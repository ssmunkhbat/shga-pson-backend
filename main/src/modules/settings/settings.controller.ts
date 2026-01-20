import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RoleService } from './role.service';
import { CreateRoleDto } from 'src/dto/validation/createRole.dto';
import { SaveMenuSettingsDto } from 'src/dto/settings/saveMenuSettings.dto';

@Controller('settings')
export class SettingsController {
	constructor(
		private readonly service: SettingsService,
		private readonly roleService: RoleService,
	) { }

  //#region [MENU]

	@UseGuards(JwtAuthGuard)
	@Get('menu')
	async getMenuList(@Req() req) {
		return await this.service.getMenuList(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('menu/default')
	async getDefaultMenu(@Req() req) {
		return await this.service.getDefaultMenu(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('menu/top')
	async getMenuTop(@Req() req) {
		return await this.service.getMenu(req.user);
	}

	@UseGuards(JwtAuthGuard)
	@Get('menu/role')
	async geMenuByRole(@Req() req, @Query('roleId') roleId: number) {
		// return await this.service.getMenuAndAction(roleId, req.user);
		return await this.service.getMenuTree(roleId, req.user);
	}
  	@UseGuards(JwtAuthGuard)
	@Post('menu/save')
	async saveRoleMenuSettings(@Body() dto: SaveMenuSettingsDto, @Req() req) {
		await this.service.saveRoleMenuSettings(dto, req.user);
		return { success: true, message: 'Settings saved successfully' };
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
	async rolePost(@Req() req, @Body() body: CreateRoleDto) {
		return await this.roleService.create(body, req.user)
	}
	
	@UseGuards(JwtAuthGuard)
	@Put('/roles')
	async rolePut(@Req() req, @Body() body) {
		return await this.roleService.update(body, req.user)
	}

  //#endregion

}
