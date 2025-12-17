import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getUsers(@Query('limit') limit, @Query('page') page, @Query('search') search) {
        return await this.userService.getUsers({ limit, page }, search);
    }
}
