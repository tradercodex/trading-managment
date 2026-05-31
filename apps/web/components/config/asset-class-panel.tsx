'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataToolbar } from './data-toolbar';
import { assetClassesApi, type AssetClass, type PrimaryAssetClass } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

const PRIMARIES: PrimaryAssetClass[] = ['EQUITIES', 'FUTURES', 'OPTIONS', 'CRYPTOCURRENCIES', 'FIXED_INCOME'];

export function AssetClassPanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'assetclass:write');
  const [rows, setRows] = useState<AssetClass[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ primary: 'EQUITIES' as PrimaryAssetClass, secondary: '', valuationSource: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await assetClassesApi.list()); } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await assetClassesApi.create(form);
      setOpen(false);
      setForm({ primary: 'EQUITIES', secondary: '', valuationSource: '' });
      load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataToolbar title="Asset Classes" addLabel="Add Asset Class" onAdd={() => setOpen(true)} loading={loading} canAdd={canWrite} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Primary</TableHead>
                <TableHead>Secondary</TableHead>
                <TableHead>Valuation Source</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No asset classes.</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><Badge>{r.primary}</Badge></TableCell>
                  <TableCell>{r.secondary}</TableCell>
                  <TableCell className="text-muted-foreground">{r.valuationSource}</TableCell>
                  <TableCell>
                    {canWrite && (
                      <Button variant="ghost" size="icon" onClick={() => assetClassesApi.remove(r.id).then(load)}>
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DialogContent>
        <DialogHeader><DialogTitle>Add Asset Class</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label>Primary *</Label>
            <Select value={form.primary} onValueChange={(v) => setForm({ ...form, primary: v as PrimaryAssetClass })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIMARIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Secondary *</Label>
            <Input value={form.secondary} onChange={(e) => setForm({ ...form, secondary: e.target.value })} placeholder="e.g. Large Cap Growth" />
          </div>
          <div className="space-y-1.5">
            <Label>Valuation Source *</Label>
            <Input value={form.valuationSource} onChange={(e) => setForm({ ...form, valuationSource: e.target.value })} placeholder="e.g. Bloomberg" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
