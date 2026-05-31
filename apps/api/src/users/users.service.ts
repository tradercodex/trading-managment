import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

const userSelect = {
  id: true,
  email: true,
  username: true,
  fullName: true,
  employeeId: true,
  status: true,
  modules: true,
  isActive: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  roles: { select: { role: { select: { id: true, name: true } } } },
  fundAllocations: { select: { fund: { select: { id: true, fundName: true, amcName: true, reportingCurrency: true, rankingMethod: true } } } },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    const u = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async create(dto: CreateUserDto, createdBy?: string) {
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password ?? 'Password123!', 10);

    const role = dto.roleName
      ? await this.prisma.role.findUnique({ where: { name: dto.roleName.toLowerCase() } })
      : await this.prisma.role.findUnique({ where: { name: 'user' } });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email!,
        username: dto.username,
        fullName: dto.fullName,
        employeeId: dto.employeeId,
        status: dto.status ?? 'ACTIVE',
        modules: dto.modules ?? [],
        passwordHash,
        createdBy: createdBy ?? 'system',
        ...(role && { roles: { create: { roleId: role.id } } }),
        ...(dto.fundIds?.length && {
          fundAllocations: { create: dto.fundIds.map((fundId) => ({ fundId })) },
        }),
      },
      select: userSelect,
    });
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.get(id);

    // Reset fund allocations if supplied
    if (dto.fundIds) {
      await this.prisma.userFundAllocation.deleteMany({ where: { userId: id } });
    }
    // Reset role if supplied
    if (dto.roleName) {
      const role = await this.prisma.role.findUnique({ where: { name: dto.roleName.toLowerCase() } });
      if (!role) throw new NotFoundException(`Role "${dto.roleName}" not found`);
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      await this.prisma.userRole.create({ data: { userId: id, roleId: role.id } });
    }

    const passwordHash = dto.password ? await bcrypt.hash(dto.password, 10) : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.username !== undefined && { username: dto.username }),
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.employeeId !== undefined && { employeeId: dto.employeeId }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.modules !== undefined && { modules: dto.modules }),
        ...(passwordHash && { passwordHash }),
        ...(dto.fundIds && {
          fundAllocations: { create: dto.fundIds.map((fundId) => ({ fundId })) },
        }),
      },
      select: userSelect,
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('User not found');
    });
    return { success: true };
  }

  async setActive(id: string, isActive: boolean) {
    await this.get(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive, status: isActive ? 'ACTIVE' : 'INACTIVE' },
      select: userSelect,
    });
  }
}
