import { Controller, Get, Query, Redirect, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('steam')
  @Public()
  @ApiOperation({ summary: 'Redirect to Steam login' })
  @Redirect()
  steamLogin() {
    return { url: this.authService.buildSteamAuthUrl() };
  }

  @Get('steam/callback')
  @Public()
  @ApiOperation({ summary: 'Steam OAuth callback — redirects to frontend with token' })
  @Redirect()
  async steamCallback(@Query() query: Record<string, string>) {
    const steamId = await this.authService.verifySteamCallback(query);
    const { token } = await this.authService.loginWithSteam(steamId);
    const webUrl = this.config.get<string>('WEB_URL', 'http://localhost:3000');
    return { url: `${webUrl}/auth/callback?token=${token}` };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@CurrentUser() user: User) {
    return user;
  }
}
