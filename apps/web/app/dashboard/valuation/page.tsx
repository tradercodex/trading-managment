'use client';

import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MarketPricePanel } from '@/components/valuation/market-price-panel';
import { ExchangeRatePanel } from '@/components/valuation/exchange-rate-panel';
import { SecuritiesMasterPanel } from '@/components/valuation/securities-master-panel';

const tabs = [
  { value: 'market-price', label: '📈 Market Price', component: MarketPricePanel },
  { value: 'exchange-rate', label: '💱 Exchange Rate', component: ExchangeRatePanel },
  { value: 'securities-master', label: '🗂️ Securities Master', component: SecuritiesMasterPanel },
];

export default function ValuationPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-gradient-to-br from-sky-500 to-fuchsia-500 p-2 text-white">
          <LineChart className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Valuation</h2>
          <p className="text-xs text-muted-foreground">
            Market prices, exchange rates and the securities master.
          </p>
        </div>
      </div>

      <Tabs defaultValue="market-price" className="space-y-4">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-card p-1 shadow-sm">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/10 data-[state=active]:to-fuchsia-500/10"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const Panel = t.component;
          return (
            <TabsContent key={t.value} value={t.value}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Panel />
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
