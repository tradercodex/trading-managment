'use client';

import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserMgmtPanel } from '@/components/config/user-mgmt-panel';
import { FundDetailPanel } from '@/components/config/fund-detail-panel';
import { CustodianPanel } from '@/components/config/custodian-panel';
import { AssetClassPanel } from '@/components/config/asset-class-panel';
import { PreDefinePanel } from '@/components/config/pre-define-panel';
import { ChartOfAccountsPanel } from '@/components/config/chart-of-accounts-panel';

const tabs = [
  { value: 'user-management', label: '👤 User Management', component: UserMgmtPanel },
  { value: 'fund-detail', label: '🏢 Fund Detail', component: FundDetailPanel },
  { value: 'custodian', label: '🏦 Custodian', component: CustodianPanel },
  { value: 'asset-class', label: '🗂️ Asset Class', component: AssetClassPanel },
  { value: 'pre-define', label: '📌 Pre Define', component: PreDefinePanel },
  { value: 'chart-of-accounts', label: '📒 Chart of Accounts', component: ChartOfAccountsPanel },
];

export default function ConfigurationPage() {
  return (
    <Tabs defaultValue="user-management" className="space-y-4">
      <TabsList className="h-auto flex-wrap justify-start gap-1 bg-card p-1 shadow-sm">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/10 data-[state=active]:to-fuchsia-500/10">
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
  );
}
