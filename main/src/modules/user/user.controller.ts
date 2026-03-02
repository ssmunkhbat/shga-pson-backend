import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BaseRoleDtoValidator } from 'src/dto/validation/basePerson.dto.validator';
import { ChangePasswordValidationDto } from 'src/dto/validation/changePassword.dto.validator';
import { UmSystemUserValidationDto } from 'src/dto/validation/settings/um.system.user.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getUsers(@Query('limit') limit, @Query('page') page, @Query('search') search) {
        return await this.userService.getUsers({ limit, page }, search);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('find/:id')
    async getUserById(@Param('id') id: number) {
        return await this.userService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile/update')
    async saveBasePerson(@Body() dto: BaseRoleDtoValidator, @Req() req) {
        await this.userService.saveBasePerson(dto, req.user);
        return { success: true, message: 'Settings saved successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('changePassword')
    changePassword(@Req() req : any, @Body() body: ChangePasswordValidationDto) {
        return this.userService.changePassword(req.user, body)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createAndUpdate(@Req() req : any, @Body() body: UmSystemUserValidationDto) {
        return this.userService.createAndUpdate(body, req.user)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('roles/:userId')
    async findUserRoles(@Param('userId') userId: number) {
        return await this.userService.findUserRoles(userId);
    }
    
}
