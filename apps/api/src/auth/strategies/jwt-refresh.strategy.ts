import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const fromCookie = (req?.cookies as Record<string, string> | undefined)?.refreshToken;
          if (fromCookie) return fromCookie;
          const fromBody = (req?.body as { refreshToken?: string } | undefined)?.refreshToken;
          return fromBody ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET')!,
      passReqToCallback: false,
    });
  }

  async validate(payload: { sub: string }) {
    return payload;
  }
}
