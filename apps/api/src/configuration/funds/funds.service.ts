import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFundDto, UpdateFundDto } from './dto';

@Injectable()
export class FundsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.fund.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    const fund = await this.prisma.fund.findUnique({
      where: { id },
      include: { custodians: true, userAllocations: { include: { user: true } } },
    });
    if (!fund) throw new NotFoundException('Fund not found');
    return fund;
  }

  create(dto: CreateFundDto) {
    return this.prisma.fund.create({ data: dto });
  }

  async update(id: string, dto: UpdateFundDto) {
    await this.get(id);
    return this.prisma.fund.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.fund.delete({ where: { id } });
    return { success: true };
  }
}
