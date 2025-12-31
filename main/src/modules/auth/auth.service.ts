import { Body, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = body
    const user = await this.usersService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Нэвтрэх нэр эсвэл Нууц үгээ шалгана уу!');
    }
    const payload = { sub: user.userId, username: user.userName };
    const access_token = this.jwtService.sign(payload);
    
    res.cookie(process.env.TOKEN_NAME || 'pson-token', access_token, {
      httpOnly: true,        // 🔒 JS can't read it
      secure: false,         // true in production (HTTPS)
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { access_token, info: user };
  }
}
