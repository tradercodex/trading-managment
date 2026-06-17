import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMarketPriceDto, UpdateMarketPriceDto } from './dto';

@Injectable()
export class MarketPricesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.marketPrice.findMany({
      orderBy: [{ priceDate: 'desc' }, { ticker: 'asc' }],
    });
  }

  async get(id: string) {
    const r = await this.prisma.marketPrice.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Market price not found');
    return r;
  }

  async create(dto: CreateMarketPriceDto) {
    const ticker = dto.ticker.toUpperCase();
    const currency = dto.currency.toUpperCase();
    const priceDate = new Date(dto.priceDate);

    // Link to Security if one exists with this ticker/currency
    const sec = await this.prisma.security.findUnique({
      where: { ticker_currency: { ticker, currency } },
    });

    return this.prisma.marketPrice.upsert({
      where: { ticker_priceDate_currency: { ticker, priceDate, currency } },
      update: {
        price: dto.price,
        name: dto.name,
        assetClass: dto.assetClass,
        source: dto.source,
        sourceId: dto.sourceId,
        securityId: sec?.id,
      },
      create: {
        ticker,
        currency,
        priceDate,
        price: dto.price,
        name: dto.name,
        assetClass: dto.assetClass,
        source: dto.source,
        sourceId: dto.sourceId,
        securityId: sec?.id,
      },
    });
  }

  async update(id: string, dto: UpdateMarketPriceDto) {
    await this.get(id);
    return this.prisma.marketPrice.update({
      where: { id },
      data: {
        ...dto,
        ticker: dto.ticker?.toUpperCase(),
        currency: dto.currency?.toUpperCase(),
        priceDate: dto.priceDate ? new Date(dto.priceDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.marketPrice.delete({ where: { id } });
    return { success: true };
  }
}
