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
import { preDefinesApi, type PreDefine } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

export function PreDefinePanel() {
  const { user } = useAuth();
  const canWrite = hasPermission(user, 'predefine:write');
  const [rows, setRows] = useState<PreDefine[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ category: '', code: '', label: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setRows(await preDefinesApi.list()); } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await preDefinesApi.create(form);
      setOpen(false);
      setForm({ category: '', code: '', label: '', description: '' });
      load();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataToolbar title="Pre Define" description="Lookup values (categories + codes)" addLabel="Add Pre Define" onAdd={() => setOpen(true)} loading={loading} canAdd={canWrite} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No pre-defines yet.</TableCell></TableRow>
              ) : rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><Badge variant="secondary">{r.category}</Badge></TableCell>
                  <TableCell><code className="text-xs">{r.code}</code></TableCell>
                  <TableCell className="font-medium">{r.label}</TableCell>
                  <TableCell className="text-muted-foreground">{r.description ?? '—'}</TableCell>
                  <TableCell>
                    {canWrite && (
                      <Button variant="ghost" size="icon" onClick={() => preDefinesApi.remove(r.id).then(load)}>
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
        <DialogHeader><DialogTitle>Add Pre Define</DialogTitle></DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Category *</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Trade Type" /></div>
            <div className="space-y-1.5"><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. TRD-001" /></div>
          </div>
          <div className="space-y-1.5"><Label>Label *</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Buy Trade" /></div>
          <div className="space-y-1.5"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional…" /></div>
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
