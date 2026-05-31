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
import { DataToolbar } from './data-toolbar';
import { custodiansApi, type Custodian } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

export function CustodianPanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'custodian:write');
  const [rows, setRows] = useState<Custodian[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fundName: '', custodianName: '', accountNumber: '', reportingCurrency: 'USD',
    apiKey: '', secretKey: '', passphrase: '',
  });

  const load = async () => {
    setLoading(true);
    try { setRows(await custodiansApi.list()); } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await custodiansApi.create(form);
      setOpen(false);
      load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataToolbar
        title="Custodians"
        description="Per-fund custodian + account credentials"
        addLabel="Add Custodian"
        onAdd={() => setOpen(true)}
        loading={loading}
        canAdd={canWrite}
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund</TableHead>
                <TableHead>Custodian</TableHead>
                <TableHead>Account #</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No custodians configured.</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.fundName}</TableCell>
                  <TableCell className="font-medium">{r.custodianName}</TableCell>
                  <TableCell><code className="text-xs">{r.accountNumber}</code></TableCell>
                  <TableCell><Badge variant="secondary">{r.reportingCurrency}</Badge></TableCell>
                  <TableCell><code className="text-xs text-muted-foreground">{r.apiKey ?? '—'}</code></TableCell>
                  <TableCell>
                    {canWrite && (
                      <Button variant="ghost" size="icon" onClick={() => custodiansApi.remove(r.id).then(load)}>
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
        <DialogHeader><DialogTitle>Add Custodian</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fund Name *" value={form.fundName} onChange={(v) => setForm({ ...form, fundName: v })} />
            <Field label="Custodian *" value={form.custodianName} onChange={(v) => setForm({ ...form, custodianName: v })} />
            <Field label="Account Number *" value={form.accountNumber} onChange={(v) => setForm({ ...form, accountNumber: v })} />
            <Field label="Reporting Currency" value={form.reportingCurrency} onChange={(v) => setForm({ ...form, reportingCurrency: v.toUpperCase() })} />
          </div>
          <Field label="API Key" type="password" value={form.apiKey} onChange={(v) => setForm({ ...form, apiKey: v })} />
          <Field label="Secret Key" type="password" value={form.secretKey} onChange={(v) => setForm({ ...form, secretKey: v })} />
          <Field label="Passphrase" type="password" value={form.passphrase} onChange={(v) => setForm({ ...form, passphrase: v })} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Add Custodian</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} />
    </div>
  );
}
