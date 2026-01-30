import { Controller, Get, Post, Param, Query, Req, UseGuards, Body } from '@nestjs/common';
import { PrisonerService } from './prisoner.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { CreatePrisonerCardPersonalInfoDto } from 'src/dto/validation/pri/prisoner/card/personalInfo.dto';
import { PriDetentionService } from '../detention/detention.service';

@Controller('prisoner')
export class PrisonerController {
	constructor(
    private readonly service: PrisonerService,
    private readonly detentionService: PriDetentionService,
  ) { }

  //#region [LIST]

	@UseGuards(JwtAuthGuard)
	@Get('all')
  async listAll(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.listAll({ limit, page }, search);
  }

	@UseGuards(JwtAuthGuard)
	@Get('arrested')
  async listArrested(@Query('limit') limit, @Query('page') page, @Query('search') search) {
    return await this.service.listArrested({ limit, page }, search);
  }

  //#endregion

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
}
