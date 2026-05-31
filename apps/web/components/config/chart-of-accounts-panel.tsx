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
import { chartOfAccountsApi, type ChartOfAccount, type AccountType } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

const TYPES: AccountType[] = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'];

export function ChartOfAccountsPanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'coa:write');
  const [rows, setRows] = useState<ChartOfAccount[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', type: 'ASSET' as AccountType, parentCode: '', currency: 'USD', description: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await chartOfAccountsApi.list()); } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await chartOfAccountsApi.create({
        ...form,
        parentCode: form.parentCode || undefined,
        description: form.description || undefined,
      });
      setOpen(false);
      setForm({ code: '', name: '', type: 'ASSET', parentCode: '', currency: 'USD', description: '' });
      load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataToolbar title="Chart of Accounts" addLabel="Add Account" onAdd={() => setOpen(true)} loading={loading} canAdd={canWrite} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No accounts yet.</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><code className="text-xs">{r.code}</code></TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell><Badge>{r.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.parentCode ?? '—'}</TableCell>
                  <TableCell>{r.currency}</TableCell>
                  <TableCell>
                    {canWrite && (
                      <Button variant="ghost" size="icon" onClick={() => chartOfAccountsApi.remove(r.id).then(load)}>
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
        <DialogHeader><DialogTitle>Add Account</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. 1000" /></div>
            <div className="space-y-1.5">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AccountType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cash" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Parent Code</Label><Input value={form.parentCode} onChange={(e) => setForm({ ...form, parentCode: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Currency</Label><Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
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
