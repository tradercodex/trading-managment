'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { hasRole, hasPermission } from '@/lib/rbac';

interface ProtectedProps {
  children: ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: ReactNode;
}

/**
 * Client-side route guard. Redirects to /login when not authenticated.
 * Shows a friendly fallback when the user is logged in but lacks the role/permission.
 */
export function Protected({ children, roles, permissions, fallback }: ProtectedProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const roleOk = !roles?.length || hasRole(user, ...roles);
  const permOk = !permissions?.length || hasPermission(user, ...permissions);

  if (!roleOk || !permOk) {
    return (
      fallback ?? (
        <div className="container mx-auto p-12 text-center">
          <h2 className="text-2xl font-semibold">403 — Forbidden</h2>
          <p className="mt-2 text-muted-foreground">
            You don&apos;t have access to this page.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
