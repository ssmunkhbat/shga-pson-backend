
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { Request } from 'express';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	async getList(@Req() req, @Query('type') type) {
		return await this.service.getList(req.user, type);
	}

}
