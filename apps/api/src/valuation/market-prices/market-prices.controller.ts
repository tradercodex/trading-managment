import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MarketPricesService } from './market-prices.service';
import { CreateMarketPriceDto, UpdateMarketPriceDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('valuation/market-prices')
export class MarketPricesController {
  constructor(private readonly svc: MarketPricesService) {}

  @Get() @Permissions('valuation:read') list() { return this.svc.list(); }
  @Get(':id') @Permissions('valuation:read') get(@Param('id') id: string) { return this.svc.get(id); }
  @Post() @Permissions('valuation:write') create(@Body() dto: CreateMarketPriceDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('valuation:write') update(@Param('id') id: string, @Body() dto: UpdateMarketPriceDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('valuation:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
