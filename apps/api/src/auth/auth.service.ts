import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';

interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  avatarfull: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly users: UsersService,
  ) {}

  buildSteamAuthUrl(): string {
    const returnUrl = this.config.getOrThrow<string>('STEAM_RETURN_URL');
    const realm = new URL(returnUrl).origin;

    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': returnUrl,
      'openid.realm': realm,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });

    return `https://steamcommunity.com/openid/login?${params.toString()}`;
  }

  async verifySteamCallback(query: Record<string, string>): Promise<string> {
    if (query['openid.mode'] !== 'id_res') {
      throw new UnauthorizedException('Steam auth cancelled or failed');
    }

    const verifyParams = new URLSearchParams({ ...query, 'openid.mode': 'check_authentication' });

    const response = await fetch('https://steamcommunity.com/openid/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verifyParams.toString(),
    });

    const text = await response.text();
    if (!text.includes('is_valid:true')) {
      throw new UnauthorizedException('Steam OpenID verification failed');
    }

    const claimedId = query['openid.claimed_id'] ?? '';
    const match = claimedId.match(/https:\/\/steamcommunity\.com\/openid\/id\/(\d+)/);
    if (!match) throw new UnauthorizedException('Invalid Steam claimed_id');

    return match[1]!;
  }

  async fetchSteamProfile(steamId: string): Promise<{ username: string; avatar: string }> {
    const apiKey = this.config.getOrThrow<string>('STEAM_API_KEY');
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`;

    const response = await fetch(url);
    const data = (await response.json()) as { response: { players: SteamPlayerSummary[] } };
    const player = data.response.players[0];

    if (!player) throw new UnauthorizedException('Steam profile not found');

    return { username: player.personaname, avatar: player.avatarfull };
  }

  async loginWithSteam(steamId: string): Promise<{ user: User; token: string }> {
    const profile = await this.fetchSteamProfile(steamId);
    const user = await this.users.createOrUpdate({ steamId, ...profile });
    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user: User): string {
    return this.jwt.sign({ sub: user.id, steamId: user.steamId });
  }
}
