'use client';

import { useEffect, useState } from 'react';
import { Protected } from '@/components/protected';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  createdAt: string;
  roles: { role: { name: string } }[];
}

export default function UsersPage() {
  return (
    <Protected permissions={['user:read']}>
      <UsersTable />
    </Protected>
  );
}

function UsersTable() {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<UserRow[]>('/api/users')
      .then(setRows)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!rows && !error && <p className="text-sm text-muted-foreground">Loading…</p>}
        {rows && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Email</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Roles</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.name ?? '—'}</td>
                    <td className="py-2 space-x-1">
                      {u.roles.map((r) => (
                        <Badge key={r.role.name} variant="secondary">
                          {r.role.name}
                        </Badge>
                      ))}
                    </td>
                    <td className="py-2">
                      <Badge variant={u.isActive ? 'default' : 'destructive'}>
                        {u.isActive ? 'active' : 'inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
