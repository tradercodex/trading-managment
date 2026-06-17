import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExchangeRateDto, UpdateExchangeRateDto } from './dto';

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.exchangeRate.findMany({
      orderBy: [{ rateDate: 'desc' }, { currency: 'asc' }],
    });
  }

  async get(id: string) {
    const r = await this.prisma.exchangeRate.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Exchange rate not found');
    return r;
  }

  async create(dto: CreateExchangeRateDto) {
    const currency = dto.currency.toUpperCase();
    const rateDate = new Date(dto.rateDate);

    return this.prisma.exchangeRate.upsert({
      where: { currency_rateDate: { currency, rateDate } },
      update: {
        rate: dto.rate,
        symbol: dto.symbol,
        source: dto.source,
        sourceId: dto.sourceId,
      },
      create: {
        currency,
        rateDate,
        rate: dto.rate,
        symbol: dto.symbol,
        source: dto.source,
        sourceId: dto.sourceId,
      },
    });
  }

  async update(id: string, dto: UpdateExchangeRateDto) {
    await this.get(id);
    return this.prisma.exchangeRate.update({
      where: { id },
      data: {
        ...dto,
        currency: dto.currency?.toUpperCase(),
        rateDate: dto.rateDate ? new Date(dto.rateDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.exchangeRate.delete({ where: { id } });
    return { success: true };
  }
}
