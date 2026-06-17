import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SecuritiesService } from './securities.service';
import { CreateSecurityDto, UpdateSecurityDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('valuation/securities')
export class SecuritiesController {
  constructor(private readonly svc: SecuritiesService) {}

  @Get() @Permissions('valuation:read') list() { return this.svc.list(); }
  @Get(':id') @Permissions('valuation:read') get(@Param('id') id: string) { return this.svc.get(id); }
  @Post() @Permissions('valuation:write') create(@Body() dto: CreateSecurityDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('valuation:write') update(@Param('id') id: string, @Body() dto: UpdateSecurityDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('valuation:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
