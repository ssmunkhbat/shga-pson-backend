import { Controller, Get, Post, Query, Req, UseGuards, Body } from '@nestjs/common';
import { RefsService } from './refs.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('refs')
export class RefsController {
	constructor(private readonly service: RefsService) { }

	@UseGuards(JwtAuthGuard)
	@Get('/list/:refName')
	async getRefByName(@Req() req, @Query('filters') filters) {
		return await this.service.getList(req.params.refName, filters)
	}

	@UseGuards(JwtAuthGuard)
	@Get('/byid/:id')
	async getRefById(@Req() req, @Query('tbl') tbl, @Query('col') col) {
		return await this.service.getListById(req.params.id, tbl, col)
	}

	//#region [admin/ref - API]

	@UseGuards(JwtAuthGuard)
	@Get('/column-list')
	async getRefColumnList(@Req() req, @Query('filters') filters) {
		return await this.service.getRefColumnList(req.params.refName, filters)
	}

	@UseGuards(JwtAuthGuard)
	@Get('/column-list/data/:refName')
	async list(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
		return this.service.getRefColumnListData({ page, limit }, search, sort, req.user, req.params.refName)
	}

  @UseGuards(JwtAuthGuard)
  @Post('column-list/save')
  create(@Req() req, @Body() body: any) {
    return this.service.saveRefDynamic(body, req.user);
  }

	//#endregion

}
