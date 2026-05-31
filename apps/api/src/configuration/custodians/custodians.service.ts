import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustodianDto, UpdateCustodianDto } from './dto';

// Mask sensitive fields for list/get responses
const maskedSelect = {
  id: true,
  fundId: true,
  fundName: true,
  custodianName: true,
  accountNumber: true,
  reportingCurrency: true,
  apiKey: true,
  secretKey: true,
  passphrase: true,
  createdAt: true,
  updatedAt: true,
} as const;

const mask = (v: string | null | undefined) =>
  v ? `${'•'.repeat(Math.max(0, v.length - 4))}${v.slice(-4)}` : null;

function maskRow<T extends { apiKey: string | null; secretKey: string | null; passphrase: string | null }>(row: T) {
  return { ...row, apiKey: mask(row.apiKey), secretKey: mask(row.secretKey), passphrase: mask(row.passphrase) };
}

@Injectable()
export class CustodiansService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const rows = await this.prisma.custodian.findMany({ select: maskedSelect, orderBy: { createdAt: 'desc' } });
    return rows.map(maskRow);
  }

  async get(id: string) {
    const c = await this.prisma.custodian.findUnique({ where: { id }, select: maskedSelect });
    if (!c) throw new NotFoundException('Custodian not found');
    return maskRow(c);
  }

  create(dto: CreateCustodianDto) {
    return this.prisma.custodian.create({ data: dto });
  }

  async update(id: string, dto: UpdateCustodianDto) {
    await this.prisma.custodian.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException('Custodian not found');
    });
    return this.prisma.custodian.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.custodian.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Custodian not found');
    });
    return { success: true };
  }
}
