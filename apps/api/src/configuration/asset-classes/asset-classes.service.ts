import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssetClassDto, UpdateAssetClassDto } from './dto';

@Injectable()
export class AssetClassesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.assetClass.findMany({ orderBy: [{ primary: 'asc' }, { secondary: 'asc' }] });
  }

  create(dto: CreateAssetClassDto) {
    return this.prisma.assetClass.create({ data: dto });
  }

  async update(id: string, dto: UpdateAssetClassDto) {
    const exists = await this.prisma.assetClass.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Asset class not found');
    return this.prisma.assetClass.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.assetClass.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Asset class not found');
    });
    return { success: true };
  }
}
