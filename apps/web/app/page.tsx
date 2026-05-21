'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div>
        <h1 className="text-5xl font-bold tracking-tight">Trading Software</h1>
        <p className="mt-4 text-muted-foreground">
          Next.js 14 + NestJS + Prisma + JWT auth with roles & permissions.
        </p>
      </div>

      <div className="flex gap-3">
        {loading ? null : user ? (
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
