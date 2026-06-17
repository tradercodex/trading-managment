import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSecurityDto, UpdateSecurityDto } from './dto';

@Injectable()
export class SecuritiesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.security.findMany({ orderBy: { smId: 'asc' } });
  }

  async get(id: string) {
    const s = await this.prisma.security.findFirst({
      where: { OR: [{ id }, { smId: id }] },
    });
    if (!s) throw new NotFoundException('Security not found');
    return s;
  }

  async create(dto: CreateSecurityDto) {
    const clash = await this.prisma.security.findUnique({
      where: { ticker_currency: { ticker: dto.ticker.toUpperCase(), currency: dto.currency.toUpperCase() } },
    });
    if (clash) throw new ConflictException(`Security ${dto.ticker}/${dto.currency} already exists`);

    return this.prisma.security.create({
      data: {
        smId: await this.nextSmId(),
        type: dto.type,
        ticker: dto.ticker.toUpperCase(),
        name: dto.name,
        assetClass: dto.assetClass,
        exchange: dto.exchange,
        currency: dto.currency.toUpperCase(),
        multiplier: dto.multiplier ?? 1,
        valuationSource: dto.valuationSource,
        valuationSourceId: dto.valuationSourceId,
      },
    });
  }

  async update(id: string, dto: UpdateSecurityDto) {
    const existing = await this.get(id);
    return this.prisma.security.update({
      where: { id: existing.id },
      data: {
        ...dto,
        ticker: dto.ticker?.toUpperCase(),
        currency: dto.currency?.toUpperCase(),
      },
    });
  }

  async remove(id: string) {
    const existing = await this.get(id);
    await this.prisma.security.delete({ where: { id: existing.id } });
    return { success: true };
  }

  private async nextSmId(): Promise<string> {
    // Find highest existing numeric suffix and add one. Falls back to count+1.
    const last = await this.prisma.security.findFirst({
      orderBy: { smId: 'desc' },
      select: { smId: true },
    });
    let n = 1;
    if (last?.smId) {
      const m = /(\d+)$/.exec(last.smId);
      if (m) n = parseInt(m[1], 10) + 1;
    }
    return 'SM-' + String(n).padStart(6, '0');
  }
}
