'use client';

// Minimal shadcn-style sidebar primitive (single-file, collapsible on desktop).
import * as React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

type SidebarState = 'expanded' | 'collapsed';

interface SidebarContextValue {
  state: SidebarState;
  toggle: () => void;
  setState: (s: SidebarState) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>');
  return ctx;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [state, setState] = React.useState<SidebarState>(defaultOpen ? 'expanded' : 'collapsed');
  const toggle = React.useCallback(
    () => setState((s) => (s === 'expanded' ? 'collapsed' : 'expanded')),
    [],
  );
  return (
    <SidebarContext.Provider value={{ state, toggle, setState }}>
      <div className="flex min-h-screen w-full bg-background">{children}</div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();
  return (
    <aside
      data-state={state}
      className={cn(
        'sticky top-0 flex h-screen flex-col border-r bg-card text-card-foreground transition-[width] duration-200 ease-in-out',
        state === 'expanded' ? 'w-64' : 'w-[68px]',
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-2 border-b px-3 py-3', className)}>{children}</div>
  );
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-y-auto py-2', className)}>{children}</div>;
}

export function SidebarFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t p-3', className)}>{children}</div>;
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('flex flex-col gap-1 px-2', className)}>{children}</ul>;
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn(className)}>{children}</li>;
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
  asChild?: boolean;
  children: React.ReactNode;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, children, isActive, tooltip, ...props }, ref) => {
    const { state } = useSidebar();
    return (
      <button
        ref={ref}
        title={state === 'collapsed' ? tooltip : undefined}
        data-active={isActive}
        className={cn(
          'group/menu-btn flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'data-[active=true]:bg-gradient-to-r data-[active=true]:from-sky-500/15 data-[active=true]:to-fuchsia-500/15 data-[active=true]:text-foreground',
          state === 'collapsed' && 'justify-center px-0',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

/** Hides text labels when sidebar is collapsed. */
export function SidebarLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  const { state } = useSidebar();
  if (state === 'collapsed') return null;
  return <span className={cn('truncate', className)}>{children}</span>;
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggle } = useSidebar();
  return (
    <Button variant="ghost" size="icon" className={cn('h-8 w-8', className)} onClick={toggle}>
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen w-full flex-1 flex-col">{children}</div>;
}
