import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateChartOfAccountDto, UpdateChartOfAccountDto } from './dto';

@Injectable()
export class ChartOfAccountsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.chartOfAccount.findMany({ orderBy: { code: 'asc' } });
  }

  create(dto: CreateChartOfAccountDto) {
    return this.prisma.chartOfAccount.create({ data: dto });
  }

  async update(id: string, dto: UpdateChartOfAccountDto) {
    const exists = await this.prisma.chartOfAccount.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Account not found');
    return this.prisma.chartOfAccount.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.chartOfAccount.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Account not found');
    });
    return { success: true };
  }
}
