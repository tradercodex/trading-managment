import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ExchangeRatesService } from './exchange-rates.service';
import { CreateExchangeRateDto, UpdateExchangeRateDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('valuation/exchange-rates')
export class ExchangeRatesController {
  constructor(private readonly svc: ExchangeRatesService) {}

  @Get() @Permissions('valuation:read') list() { return this.svc.list(); }
  @Get(':id') @Permissions('valuation:read') get(@Param('id') id: string) { return this.svc.get(id); }
  @Post() @Permissions('valuation:write') create(@Body() dto: CreateExchangeRateDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('valuation:write') update(@Param('id') id: string, @Body() dto: UpdateExchangeRateDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('valuation:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
