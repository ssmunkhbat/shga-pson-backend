import { Controller, Get, Post, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { PriReleaseService } from './release.service';

@Controller('release')
export class PriReleaseController {
  constructor(private readonly service: PriReleaseService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '[]',
    @Query('sort') sort = '{}',
  ) {
    return this.service.getList({ page, limit }, search, sort, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('return/:id')
  async returnEscaped(
    @Param('id') id: number,
    @Req() req,
  ) {
    return this.service.returnEscaped(id, req.user);
  }
}
