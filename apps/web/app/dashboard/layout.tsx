'use client';

import { Protected } from '@/components/protected';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/configuration': 'Configuration',
  '/dashboard/investor': 'Investor',
  '/dashboard/valuation': 'Valuation',
  '/dashboard/trading': 'Trading',
  '/dashboard/accounting': 'Accounting',
  '/dashboard/reports': 'Reports',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/dashboard';
  const title =
    titles[pathname] ??
    Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ??
    'Dashboard';

  return (
    <Protected>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mx-1 h-6" />
            <h1 className="text-sm font-medium text-muted-foreground">{title}</h1>
          </header>
          <main className="flex-1 bg-muted/30 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </Protected>
  );
}
