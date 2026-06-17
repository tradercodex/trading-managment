import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestorDto, UpdateInvestorDto } from './dto';

@Injectable()
export class InvestorService {
  constructor(private readonly prisma: PrismaService) {}

  list(search?: string) {
    return this.prisma.investor.findMany({
      where: search
        ? {
            OR: [
              { investorId: { contains: search, mode: 'insensitive' } },
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { kyc: true, tax: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const inv = await this.prisma.investor.findFirst({
      where: { OR: [{ id }, { investorId: id }] },
      include: { kyc: true, tax: true },
    });
    if (!inv) throw new NotFoundException('Investor not found');
    return inv;
  }

  async create(dto: CreateInvestorDto) {
    // Auto-generate friendly business key
    const investorId = await this.nextInvestorId();

    const existingEmail = await this.prisma.investor.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictException('Investor with that email already exists');

    return this.prisma.investor.create({
      data: {
        investorId,
        fullName: dto.fullName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        entityType: dto.entityType,
        ssnTin: dto.ssnTin,
        email: dto.email,
        phone: dto.phone,
        ...(dto.kyc && { kyc: { create: dto.kyc } }),
        ...(dto.tax && {
          tax: {
            create: {
              ...dto.tax,
              backupWithholding: dto.tax.backupWithholding ?? false,
            },
          },
        }),
      },
      include: { kyc: true, tax: true },
    });
  }

  async update(id: string, dto: UpdateInvestorDto) {
    const existing = await this.get(id);
    const { kyc, tax, dateOfBirth, ...rest } = dto;

    return this.prisma.investor.update({
      where: { id: existing.id },
      data: {
        ...rest,
        ...(dateOfBirth !== undefined && {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        }),
        ...(kyc && {
          kyc: {
            upsert: { create: kyc, update: kyc },
          },
        }),
        ...(tax && {
          tax: {
            upsert: {
              create: { ...tax, backupWithholding: tax.backupWithholding ?? false },
              update: tax,
            },
          },
        }),
      },
      include: { kyc: true, tax: true },
    });
  }

  async remove(id: string) {
    const existing = await this.get(id);
    await this.prisma.investor.delete({ where: { id: existing.id } });
    return { success: true };
  }

  // ─── helpers ───
  private async nextInvestorId(): Promise<string> {
    // Cheap & unique-enough: random 6-char base36, prefixed.
    // Retry up to 5x in the (astronomically unlikely) case of collision.
    for (let i = 0; i < 5; i++) {
      const id = 'INV-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      const clash = await this.prisma.investor.findUnique({ where: { investorId: id } });
      if (!clash) return id;
    }
    return 'INV-' + Date.now().toString(36).toUpperCase();
  }
}
