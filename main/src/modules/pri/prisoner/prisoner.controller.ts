import { Controller, Get, Post, Param, Query, Req, UseGuards, Body, Delete } from '@nestjs/common';
import { PrisonerService } from './prisoner.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { CreatePrisonerCardPersonalInfoDto } from 'src/dto/validation/pri/prisoner/card/personalInfo.dto';
import { PriDetentionService } from '../detention/detention.service';
import { PriPrisonerAccountBookService } from './account.book.service';
import { PriPrisonerAccountBookValidationDto } from 'src/dto/validation/pri/prisoner/account.book.dto';

@Controller('prisoner')
export class PrisonerController {
	constructor(
    private readonly service: PrisonerService,
    private readonly detentionService: PriDetentionService,
    private readonly accountBookService: PriPrisonerAccountBookService,
  ) { }

  //#region [LIST]

	@UseGuards(JwtAuthGuard)
	@Get('all')
  async listAll(@Req() req, @Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.listAll({ limit, page }, search, req.user);
  }

	@UseGuards(JwtAuthGuard)
	@Get('arrested')
  async listArrested(@Req() req, @Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.listArrested({ limit, page }, search, req.user);
  }

  //#endregion

  //#region [CARD]

  @UseGuards(JwtAuthGuard)
  @Get('/card/:prisonerId')
  async getPrisonerCard(@Req() req, @Param('prisonerId') prisonerId: number) {
    return await this.service.findPrisonerCard(prisonerId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/card/personalinfo')
  async saveCardPersonalInfo(@Req() req, @Body() body: CreatePrisonerCardPersonalInfoDto) {
    return await this.service.saveCardPersonalInfo(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/card/detention/:prisonerId')
  async getPrisonerDetentionCard(@Req() req, @Param('prisonerId') prisonerId: number) {
    return await this.detentionService.findPrisonerDetentionCard(prisonerId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/personalinfo/:prisonerId')
  async getPersonalInfo(@Req() req, @Param('prisonerId') prisonerId: number) {
    return await this.service.findOnePersonalInfo(prisonerId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/jailinfo/:prisonerId')
  async getJailInfo(@Req() req, @Param('prisonerId') prisonerId: number) {
    return await this.service.findOneJailInfo(prisonerId, req.user);
  }

  //#endregion

  //#region [PriPrisonerAccountBook]

  @UseGuards(JwtAuthGuard)
  @Get('/account-book')
  async listAccountBook(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.accountBookService.list({ limit, page }, search);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/account-book')
  async createAndUpdateAccountBook(@Body() dto: PriPrisonerAccountBookValidationDto, @Req() req) {
    await this.accountBookService.createAndUpdate(dto, req.user);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/account-book/:id')
  async deleteAccountBook(@Req() req, @Param('id') id: number) {
    await this.accountBookService.delete(id, req.user);
    return { success: true };
  }

  //#endregion

  //#region [/admin/pri/prisoner/[id] -> GET]

  @UseGuards(JwtAuthGuard)
  @Get('/detail-menu')
  async getPrisonerDetailMenu(@Req() req) {
    return await this.service.getPrisonerDetailMenu(req.user);
  }

  //#endregion

}
