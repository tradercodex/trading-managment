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
import { DataToolbar } from '@/components/config/data-toolbar';
import { exchangeRatesApi, type ExchangeRate } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

export function ExchangeRatePanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'valuation:write');

  const [rows, setRows] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    currency: '',
    symbol: '',
    rate: '',
    rateDate: new Date().toISOString().slice(0, 10),
    source: '',
    sourceId: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      setRows(await exchangeRatesApi.list());
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
      await exchangeRatesApi.create({
        currency: form.currency.toUpperCase(),
        symbol: form.symbol || undefined,
        rate: Number(form.rate),
        rateDate: form.rateDate,
        source: form.source || undefined,
        sourceId: form.sourceId || undefined,
      });
      setOpen(false);
      setForm({ ...form, currency: '', symbol: '', rate: '', source: '', sourceId: '' });
      void load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <DataToolbar
        title="Exchange Rates"
        description="Conversion to base currency (USD) per quote date."
        addLabel="Add Rate"
        onAdd={() => setOpen(true)}
        loading={loading}
        canAdd={canWrite}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency Code</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Rate (vs USD)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>SourceID</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No exchange rate data available.
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
                    <TableCell><Badge>{r.currency}</Badge></TableCell>
                    <TableCell className="font-mono">{r.symbol ?? '—'}</TableCell>
                    <TableCell className="text-right font-mono">{fmt(r.rate)}</TableCell>
                    <TableCell>{new Date(r.rateDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground">{r.source ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.sourceId ?? '—'}</TableCell>
                    <TableCell>
                      {canWrite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => exchangeRatesApi.remove(r.id).then(load)}
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
          <DialogHeader><DialogTitle>Add Exchange Rate</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Currency Code *">
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                placeholder="e.g. EUR"
              />
            </Field>
            <Field label="Symbol">
              <Input
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                placeholder="€"
              />
            </Field>
            <Field label="Rate (vs USD) *">
              <Input
                type="number"
                step="any"
                min="0"
                value={form.rate}
                onChange={(e) => setForm({ ...form, rate: e.target.value })}
              />
            </Field>
            <Field label="Date *">
              <Input
                type="date"
                value={form.rateDate}
                onChange={(e) => setForm({ ...form, rateDate: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <Input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              />
            </Field>
            <Field label="SourceID">
              <Input
                value={form.sourceId}
                onChange={(e) => setForm({ ...form, sourceId: e.target.value })}
              />
            </Field>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Add</Button>
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
  return n.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 10 });
}
