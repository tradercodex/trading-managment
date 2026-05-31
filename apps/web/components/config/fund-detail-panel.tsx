'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DataToolbar } from './data-toolbar';
import { fundsApi, type Fund } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

export function FundDetailPanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'fund:write');
  const [rows, setRows] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amcName: '',
    fundName: '',
    reportingCurrency: 'USD',
    rankingMethod: 'FIFO' as Fund['rankingMethod'],
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await fundsApi.list()); } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await fundsApi.create(form);
      setOpen(false);
      setForm({ amcName: '', fundName: '', reportingCurrency: 'USD', rankingMethod: 'FIFO' });
      load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DataToolbar
          title="Funds"
          description="Funds (AMC + reporting currency + ranking method)"
          addLabel="Add Fund"
          onAdd={() => setOpen(true)}
          loading={loading}
          canAdd={canWrite}
        />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>AMC&apos;s Name</TableHead>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Reporting Currency</TableHead>
                  <TableHead>Ranking Method</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No funds configured.</TableCell></TableRow>
                ) : rows.map((r) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b hover:bg-muted/50">
                    <TableCell>{r.amcName}</TableCell>
                    <TableCell className="font-medium">{r.fundName}</TableCell>
                    <TableCell><Badge variant="secondary">{r.reportingCurrency}</Badge></TableCell>
                    <TableCell><Badge>{r.rankingMethod}</Badge></TableCell>
                    <TableCell>
                      {canWrite && (
                        <Button variant="ghost" size="icon" onClick={() => fundsApi.remove(r.id).then(load)}>
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DialogContent>
          <DialogHeader><DialogTitle>Add Fund</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label>AMC&apos;s Name *</Label>
              <Input value={form.amcName} onChange={(e) => setForm({ ...form, amcName: e.target.value })} placeholder="e.g. Oracle Asset Management" />
            </div>
            <div className="space-y-1.5">
              <Label>Fund Name *</Label>
              <Input value={form.fundName} onChange={(e) => setForm({ ...form, fundName: e.target.value })} placeholder="e.g. Oracle Growth Fund" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Reporting Currency *</Label>
                <Input value={form.reportingCurrency} onChange={(e) => setForm({ ...form, reportingCurrency: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-1.5">
                <Label>Ranking Method *</Label>
                <Select value={form.rankingMethod} onValueChange={(v) => setForm({ ...form, rankingMethod: v as Fund['rankingMethod'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIFO">FIFO — First In, First Out</SelectItem>
                    <SelectItem value="LIFO">LIFO — Last In, First Out</SelectItem>
                    <SelectItem value="MFIFO">MFIFO — Minimum FIFO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Add Fund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
