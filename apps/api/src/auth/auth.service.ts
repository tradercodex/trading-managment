import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─────────── Registration ───────────
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const defaultRole = await this.prisma.role.findUnique({ where: { name: 'user' } });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.name,
        passwordHash,
        ...(defaultRole && {
          roles: { create: { roleId: defaultRole.id } },
        }),
      },
    });

    return this.issueTokens(user.id);
  }

  // ─────────── Login ───────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id);
  }

  // ─────────── Refresh (rotation) ───────────
  async refresh(userId: string, refreshToken: string) {
    const tokenHash = this.hash(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });

    if (!stored || stored.userId !== userId || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old, issue new pair
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    return this.issueTokens(userId);
  }

  // ─────────── Logout ───────────
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hash(refreshToken);
      await this.prisma.refreshToken
        .update({ where: { tokenHash }, data: { revokedAt: new Date() } })
        .catch(() => undefined);
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { success: true };
  }

  // ─────────── Build authenticated user payload ───────────
  async buildPayload(userId: string): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const roles = user.roles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.key)),
      ),
    );
    return { sub: user.id, email: user.email, roles, permissions };
  }

  // ─────────── Token issuance ───────────
  private async issueTokens(userId: string) {
    const payload = await this.buildPayload(userId);

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    // Persist a HASH of the refresh token only
    const expiresAt = this.parseExpiry(
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    );
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hash(refreshToken),
        expiresAt,
      },
    });

    return { accessToken, refreshToken, user: payload };
  }

  private hash(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiry(input: string): Date {
    // Supports formats like "15m", "7d", "12h", "30s"
    const m = /^(\d+)([smhd])$/.exec(input);
    const now = Date.now();
    if (!m) return new Date(now + 7 * 24 * 3600 * 1000);
    const n = parseInt(m[1], 10);
    const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[m[2]]!;
    return new Date(now + n * unit);
  }
}
