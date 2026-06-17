'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { DataToolbar } from '@/components/config/data-toolbar';
import { securitiesApi, type Security, type SecurityType } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

const TYPES: { value: SecurityType; label: string }[] = [
  { value: 'EQUITY', label: 'Equity' },
  { value: 'FUTURE', label: 'Future' },
  { value: 'OPTION', label: 'Option' },
  { value: 'CRYPTO', label: 'Crypto' },
  { value: 'BOND', label: 'Bond' },
  { value: 'CASH', label: 'Cash' },
  { value: 'OTHER', label: 'Other' },
];

export function SecuritiesMasterPanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'valuation:write');

  const [rows, setRows] = useState<Security[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: 'CRYPTO' as SecurityType,
    ticker: '',
    name: '',
    assetClass: 'Cryptocurrencies',
    exchange: '',
    currency: 'USD',
    multiplier: 1,
    valuationSource: '',
    valuationSourceId: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      setRows(await securitiesApi.list());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await securitiesApi.create({
        type: form.type,
        ticker: form.ticker.toUpperCase(),
        name: form.name,
        assetClass: form.assetClass,
        exchange: form.exchange || undefined,
        currency: form.currency.toUpperCase(),
        multiplier: form.multiplier,
        valuationSource: form.valuationSource || undefined,
        valuationSourceId: form.valuationSourceId || undefined,
      });
      setOpen(false);
      setForm({ ...form, ticker: '', name: '', exchange: '', valuationSource: '', valuationSourceId: '' });
      void load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <DataToolbar
        title="Securities Master"
        description="Master list of tradable securities — equities, crypto, futures and more."
        addLabel="Add Security"
        onAdd={() => setOpen(true)}
        loading={loading}
        canAdd={canWrite}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SM ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ticker</TableHead>
                <TableHead>Security Name</TableHead>
                <TableHead>Asset Class</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Multiplier</TableHead>
                <TableHead>Valuation Source</TableHead>
                <TableHead>Source ID</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-10 text-center text-muted-foreground">
                    No securities. Click <strong>Add Security</strong> to add one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-xs">{r.smId}</TableCell>
                    <TableCell><Badge variant="secondary">{r.type}</Badge></TableCell>
                    <TableCell><Badge>{r.ticker}</Badge></TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.assetClass}</TableCell>
                    <TableCell>{r.exchange ?? '—'}</TableCell>
                    <TableCell><Badge variant="secondary">{r.currency}</Badge></TableCell>
                    <TableCell className="text-right font-mono">{fmt(r.multiplier)}</TableCell>
                    <TableCell className="text-muted-foreground">{r.valuationSource ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.valuationSourceId ?? '—'}</TableCell>
                    <TableCell>
                      {canWrite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => securitiesApi.remove(r.id).then(load)}
                        >
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Security</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type *">
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as SecurityType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ticker *">
              <Input
                value={form.ticker}
                onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                placeholder="e.g. USDT"
              />
            </Field>
            <Field label="Security Name *">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Tether"
              />
            </Field>
            <Field label="Asset Class *">
              <Input
                value={form.assetClass}
                onChange={(e) => setForm({ ...form, assetClass: e.target.value })}
              />
            </Field>
            <Field label="Exchange">
              <Input
                value={form.exchange}
                onChange={(e) => setForm({ ...form, exchange: e.target.value })}
                placeholder="e.g. Binance"
              />
            </Field>
            <Field label="Currency *">
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Multiplier">
              <Input
                type="number"
                step="any"
                value={form.multiplier}
                onChange={(e) => setForm({ ...form, multiplier: Number(e.target.value) || 1 })}
              />
            </Field>
            <Field label="Valuation Source">
              <Input
                value={form.valuationSource}
                onChange={(e) => setForm({ ...form, valuationSource: e.target.value })}
              />
            </Field>
            <Field label="Source ID">
              <Input
                value={form.valuationSourceId}
                onChange={(e) => setForm({ ...form, valuationSourceId: e.target.value })}
              />
            </Field>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Add Security</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function fmt(v: string | number) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (!isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 6 });
}
