'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataToolbar } from './data-toolbar';
import { usersApi, fundsApi, type ManagedUser, type Fund } from '@/lib/config-api';
import { hasPermission } from '@/lib/rbac';
import { useAuth } from '@/components/auth-provider';

const ROLES = ['admin', 'manager', 'user'];
const MODULES = ['Trading', 'Reports', 'Dashboard', 'Valuation', 'Configuration'];

export function UserMgmtPanel() {
  const { user: me } = useAuth();
  const canWrite = hasPermission(me, 'user:write');
  const [rows, setRows] = useState<ManagedUser[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '', username: '', fullName: '', employeeId: '',
    password: 'Password123!',
    roleName: 'user',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'LOCKED',
    modules: [] as string[],
    fundIds: [] as string[],
  });

  const load = async () => {
    setLoading(true);
    try {
      const [u, f] = await Promise.all([usersApi.list(), fundsApi.list().catch(() => [])]);
      setRows(u);
      setFunds(f);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    setError(null);
    try {
      await usersApi.create(form);
      setOpen(false);
      setForm({ email: '', username: '', fullName: '', employeeId: '', password: 'Password123!', roleName: 'user', status: 'ACTIVE', modules: [], fundIds: [] });
      load();
    } catch (e) { setError((e as Error).message); }
  };

  const toggleArr = (key: 'modules' | 'fundIds', value: string) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value] }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DataToolbar
        title="User Management"
        description="Manage users — basic info, access & roles, status, and fund allocations."
        addLabel="Add User"
        onAdd={() => setOpen(true)}
        loading={loading}
        canAdd={canWrite}
      />

      <Tabs defaultValue="basic-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="access-roles">Access &amp; Roles</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="fund-allocated">Fund Allocated</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Username</TableHead><TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead><TableHead>Employee ID</TableHead>
                <TableHead className="w-12" />
              </TableRow></TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No users.</TableCell></TableRow>
                ) : rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.username ?? '—'}</TableCell>
                    <TableCell>{u.fullName ?? '—'}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><code className="text-xs">{u.employeeId ?? '—'}</code></TableCell>
                    <TableCell>
                      {canWrite && (
                        <Button variant="ghost" size="icon" onClick={() => usersApi.remove(u.id).then(load)}>
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="access-roles">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Username</TableHead><TableHead>Role</TableHead>
                <TableHead>Assigned Modules</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.username ?? u.email}</TableCell>
                    <TableCell className="space-x-1">{u.roles.map((r) => <Badge key={r.role.id}>{r.role.name}</Badge>)}</TableCell>
                    <TableCell className="space-x-1">{u.modules.length ? u.modules.map((m) => <Badge key={m} variant="secondary">{m}</Badge>) : <span className="text-muted-foreground">—</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="status">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Username</TableHead><TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead><TableHead>Created By</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.username ?? u.email}</TableCell>
                    <TableCell><Badge variant={u.status === 'ACTIVE' ? 'default' : 'destructive'}>{u.status}</Badge></TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground">{u.createdBy ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="fund-allocated">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Username</TableHead><TableHead>Funds</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.username ?? u.email}</TableCell>
                    <TableCell className="space-x-1">
                      {u.fundAllocations.length ? u.fundAllocations.map((a) => (
                        <Badge key={a.fund.id} variant="secondary">{a.fund.fundName}</Badge>
                      )) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
        <Tabs defaultValue="basic" className="space-y-3">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="access">Access &amp; Roles</TabsTrigger>
            <TabsTrigger value="funds">Fund Allocation</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Username *</Label><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="john.doe" /></div>
              <div className="space-y-1.5"><Label>Full Name *</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" /></div>
              <div className="space-y-1.5"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john.doe@company.com" /></div>
              <div className="space-y-1.5"><Label>Employee ID</Label><Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} placeholder="EMP-00123" /></div>
              <div className="space-y-1.5"><Label>Password *</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="LOCKED">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="access">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Role *</Label>
                <Select value={form.roleName} onValueChange={(v) => setForm({ ...form, roleName: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Assigned Modules</Label>
                <div className="flex flex-wrap gap-2">
                  {MODULES.map((m) => (
                    <button key={m} type="button" onClick={() => toggleArr('modules', m)}
                      className={'rounded-md border px-3 py-1 text-xs ' + (form.modules.includes(m) ? 'border-sky-500 bg-sky-500/10 text-sky-700' : 'border-input hover:bg-muted')}
                    >{m}</button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="funds">
            <div className="space-y-2">
              <Label>Select funds to allocate</Label>
              {funds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No funds available. Add some in the Fund Detail tab first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {funds.map((f) => (
                    <button key={f.id} type="button" onClick={() => toggleArr('fundIds', f.id)}
                      className={'rounded-md border px-3 py-1 text-xs ' + (form.fundIds.includes(f.id) ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-700' : 'border-input hover:bg-muted')}
                    >{f.fundName}</button>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Add User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
