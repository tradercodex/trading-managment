import { Module } from '@nestjs/common';
import { FundsController } from './funds/funds.controller';
import { FundsService } from './funds/funds.service';
import { CustodiansController } from './custodians/custodians.controller';
import { CustodiansService } from './custodians/custodians.service';
import { AssetClassesController } from './asset-classes/asset-classes.controller';
import { AssetClassesService } from './asset-classes/asset-classes.service';
import { PreDefinesController } from './pre-defines/pre-defines.controller';
import { PreDefinesService } from './pre-defines/pre-defines.service';
import { ChartOfAccountsController } from './chart-of-accounts/chart-of-accounts.controller';
import { ChartOfAccountsService } from './chart-of-accounts/chart-of-accounts.service';

@Module({
  controllers: [
    FundsController,
    CustodiansController,
    AssetClassesController,
    PreDefinesController,
    ChartOfAccountsController,
  ],
  providers: [
    FundsService,
    CustodiansService,
    AssetClassesService,
    PreDefinesService,
    ChartOfAccountsService,
  ],
  exports: [
    FundsService,
    CustodiansService,
    AssetClassesService,
    PreDefinesService,
    ChartOfAccountsService,
  ],
})
export class ConfigurationModule {}
