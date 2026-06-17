import { Module } from '@nestjs/common';
import { SecuritiesController } from './securities/securities.controller';
import { SecuritiesService } from './securities/securities.service';
import { MarketPricesController } from './market-prices/market-prices.controller';
import { MarketPricesService } from './market-prices/market-prices.service';
import { ExchangeRatesController } from './exchange-rates/exchange-rates.controller';
import { ExchangeRatesService } from './exchange-rates/exchange-rates.service';

@Module({
  controllers: [SecuritiesController, MarketPricesController, ExchangeRatesController],
  providers: [SecuritiesService, MarketPricesService, ExchangeRatesService],
  exports: [SecuritiesService, MarketPricesService, ExchangeRatesService],
})
export class ValuationModule {}
