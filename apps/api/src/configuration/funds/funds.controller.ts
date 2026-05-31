import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { FundsService } from './funds.service';
import { CreateFundDto, UpdateFundDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('configuration/funds')
export class FundsController {
  constructor(private readonly svc: FundsService) {}

  @Get() @Permissions('config:read') list() { return this.svc.list(); }
  @Get(':id') @Permissions('config:read') get(@Param('id') id: string) { return this.svc.get(id); }
  @Post() @Permissions('fund:write') create(@Body() dto: CreateFundDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('fund:write') update(@Param('id') id: string, @Body() dto: UpdateFundDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('fund:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
