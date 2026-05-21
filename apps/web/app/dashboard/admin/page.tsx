'use client';

import { Protected } from '@/components/protected';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <Protected roles={['admin']} permissions={['role:manage']}>
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Only users with the &quot;admin&quot; role can see this.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Here you would render high-privilege controls — e.g. assign roles, manage permissions,
            view audit logs.
          </p>
        </CardContent>
      </Card>
    </Protected>
  );
}
