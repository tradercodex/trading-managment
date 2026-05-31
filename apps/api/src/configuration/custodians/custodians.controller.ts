import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CustodiansService } from './custodians.service';
import { CreateCustodianDto, UpdateCustodianDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('configuration/custodians')
export class CustodiansController {
  constructor(private readonly svc: CustodiansService) {}

  @Get() @Permissions('config:read') list() { return this.svc.list(); }
  @Get(':id') @Permissions('config:read') get(@Param('id') id: string) { return this.svc.get(id); }
  @Post() @Permissions('custodian:write') create(@Body() dto: CreateCustodianDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('custodian:write') update(@Param('id') id: string, @Body() dto: UpdateCustodianDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('custodian:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
