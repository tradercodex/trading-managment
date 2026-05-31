import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePreDefineDto, UpdatePreDefineDto } from './dto';

@Injectable()
export class PreDefinesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.preDefine.findMany({ orderBy: [{ category: 'asc' }, { code: 'asc' }] });
  }

  create(dto: CreatePreDefineDto) {
    return this.prisma.preDefine.create({ data: dto });
  }

  async update(id: string, dto: UpdatePreDefineDto) {
    const exists = await this.prisma.preDefine.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Pre-define not found');
    return this.prisma.preDefine.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.preDefine.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Pre-define not found');
    });
    return { success: true };
  }
}
