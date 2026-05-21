'use client';

import { useAuth } from '@/components/auth-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome{user?.email ? `, ${user.email}` : ''}</h1>
        <p className="text-muted-foreground">Here&apos;s your account snapshot.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Roles</CardTitle>
            <CardDescription>What groups you belong to.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user?.roles.length ? (
              user.roles.map((r) => <Badge key={r}>{r}</Badge>)
            ) : (
              <span className="text-sm text-muted-foreground">No roles assigned.</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Permissions</CardTitle>
            <CardDescription>What actions you can perform.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {user?.permissions.length ? (
              user.permissions.map((p) => (
                <Badge key={p} variant="secondary">
                  {p}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No permissions.</span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
