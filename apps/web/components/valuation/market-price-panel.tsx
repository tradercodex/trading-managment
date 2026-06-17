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
import { marketPricesApi, type MarketPrice } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

export function MarketPricePanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'valuation:write');

  const [rows, setRows] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    ticker: '',
    name: '',
    assetClass: 'Cryptocurrencies',
    currency: 'USD',
    price: '',
    priceDate: new Date().toISOString().slice(0, 10),
    source: '',
    sourceId: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      setRows(await marketPricesApi.list());
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
      await marketPricesApi.create({
        ticker: form.ticker.toUpperCase(),
        name: form.name,
        assetClass: form.assetClass,
        currency: form.currency.toUpperCase(),
        price: Number(form.price),
        priceDate: form.priceDate,
        source: form.source || undefined,
        sourceId: form.sourceId || undefined,
      });
      setOpen(false);
      setForm({ ...form, ticker: '', name: '', price: '', source: '', sourceId: '' });
      void load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <DataToolbar
        title="Market Prices"
        description="Latest market price per ticker (used for unrealised P/L)."
        addLabel="Add Market Price"
        onAdd={() => setOpen(true)}
        loading={loading}
        canAdd={canWrite}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Security Name</TableHead>
                <TableHead>Asset Class</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Market Price</TableHead>
                <TableHead>Price Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>SourceID</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                    No market price data. Click <strong>Add Market Price</strong> to add one.
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
                    <TableCell>
                      <Badge>{r.ticker}</Badge>
                    </TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.assetClass}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.currency}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {fmtNumber(r.price)}
                    </TableCell>
                    <TableCell>{new Date(r.priceDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground">{r.source ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.sourceId ?? '—'}</TableCell>
                    <TableCell>
                      {canWrite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => marketPricesApi.remove(r.id).then(load)}
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
          <DialogHeader><DialogTitle>Add Market Price</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
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
            <Field label="Currency *">
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Market Price *">
              <Input
                type="number"
                step="any"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field label="Price Date *">
              <Input
                type="date"
                value={form.priceDate}
                onChange={(e) => setForm({ ...form, priceDate: e.target.value })}
              />
            </Field>
            <Field label="Source">
              <Input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="e.g. CoinMarketCap"
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

function fmtNumber(v: string | number) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (!isFinite(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 10 });
}
