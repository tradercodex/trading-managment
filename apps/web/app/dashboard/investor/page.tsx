'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { hasPermission } from '@/lib/rbac';
import { investorsApi, type Investor } from '@/lib/config-api';
import { InvestorBasicPanel } from '@/components/investor/investor-basic-panel';
import { InvestorKycPanel } from '@/components/investor/investor-kyc-panel';
import { InvestorTaxPanel } from '@/components/investor/investor-tax-panel';
import { AddInvestorDialog } from '@/components/investor/add-investor-dialog';

export default function InvestorPage() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'investor:write');

  const [rows, setRows] = useState<Investor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      setRows(await investorsApi.list(q?.trim() || undefined));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => void load(search), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const stats = [
    { label: 'Total Investors', value: rows.length, tint: 'from-sky-400 to-blue-500' },
    {
      label: 'Individuals',
      value: rows.filter((r) => r.entityType === 'INDIVIDUAL').length,
      tint: 'from-emerald-400 to-teal-500',
    },
    {
      label: 'Entities',
      value: rows.filter((r) => r.entityType !== 'INDIVIDUAL').length,
      tint: 'from-violet-400 to-fuchsia-500',
    },
    {
      label: 'KYC Complete',
      value: rows.filter((r) => !!r.kyc).length,
      tint: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Top header / nav row ── */}
      <div className="flex items-center gap-2">
        <div className="rounded-md bg-gradient-to-br from-sky-500 to-fuchsia-500 p-2 text-white">
          <Users className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Investor Management</h2>
          <p className="text-xs text-muted-foreground">
            Basic info, KYC and tax tracking for fund investors.
          </p>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{s.value}</div>
                  </div>
                  <div
                    className={`h-8 w-8 rounded-md bg-gradient-to-br ${s.tint}`}
                    aria-hidden
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email…"
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setOpen(true)}
          disabled={!canWrite}
          className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Sub-tabs ── */}
      <Tabs defaultValue="basic-info">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-card p-1 shadow-sm">
          <TabsTrigger
            value="basic-info"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/10 data-[state=active]:to-fuchsia-500/10"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="kyc"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/10 data-[state=active]:to-fuchsia-500/10"
          >
            KYC / Address
          </TabsTrigger>
          <TabsTrigger
            value="tax"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/10 data-[state=active]:to-fuchsia-500/10"
          >
            Tax Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="pt-3">
          <InvestorBasicPanel rows={rows} canWrite={canWrite} onChange={() => void load(search)} />
        </TabsContent>
        <TabsContent value="kyc" className="pt-3">
          <InvestorKycPanel rows={rows} />
        </TabsContent>
        <TabsContent value="tax" className="pt-3">
          <InvestorTaxPanel rows={rows} />
        </TabsContent>
      </Tabs>

      <AddInvestorDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={() => void load(search)}
      />

      {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
    </div>
  );
}
