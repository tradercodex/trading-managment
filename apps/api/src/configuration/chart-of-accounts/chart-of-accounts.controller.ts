import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CreateChartOfAccountDto, UpdateChartOfAccountDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('configuration/chart-of-accounts')
export class ChartOfAccountsController {
  constructor(private readonly svc: ChartOfAccountsService) {}

  @Get() @Permissions('config:read') list() { return this.svc.list(); }
  @Post() @Permissions('coa:write') create(@Body() dto: CreateChartOfAccountDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('coa:write') update(@Param('id') id: string, @Body() dto: UpdateChartOfAccountDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('coa:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
