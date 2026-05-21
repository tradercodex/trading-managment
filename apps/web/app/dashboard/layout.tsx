'use client';

import Link from 'next/link';
import { Protected } from '@/components/protected';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { hasRole, hasAnyPermission } from '@/lib/rbac';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Protected>
      <DashboardShell>{children}</DashboardShell>
    </Protected>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-14 items-center justify-between">
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="font-semibold">
              Trading
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Overview
            </Link>
            {hasAnyPermission(user, 'user:read') && (
              <Link
                href="/dashboard/users"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Users
              </Link>
            )}
            {hasRole(user, 'admin') && (
              <Link
                href="/dashboard/admin"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
