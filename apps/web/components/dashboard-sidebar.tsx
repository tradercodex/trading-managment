'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Settings,
  Users as UsersIcon,
  LineChart,
  BarChart3,
  Receipt,
  FileText,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/configuration', label: 'Configuration', icon: Settings },
  { href: '/dashboard/investor', label: 'Investor', icon: UsersIcon },
  { href: '/dashboard/valuation', label: 'Valuation', icon: LineChart },
  { href: '/dashboard/trading', label: 'Trading', icon: BarChart3 },
  { href: '/dashboard/accounting', label: 'Accounting', icon: Receipt },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  const initials =
    (user?.email ?? '?')
      .split(/[@.]/)[0]
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-fuchsia-500 text-sm font-bold text-white shadow">
          TL
        </div>
        <SidebarLabel className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">Tax Lot Manager</span>
          <span className="text-[11px] text-muted-foreground">Trading Software</span>
        </SidebarLabel>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link href={item.href} className="flex w-full items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <SidebarLabel>{item.label}</SidebarLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={
                'flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-accent ' +
                (state === 'collapsed' ? 'justify-center' : '')
              }
            >
              <Avatar className="h-8 w-8 bg-gradient-to-br from-sky-400 to-fuchsia-500">
                <AvatarFallback className="bg-transparent text-xs font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <SidebarLabel className="flex flex-1 flex-col">
                <span className="truncate text-sm font-medium">{user?.email ?? 'Guest'}</span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user?.roles?.join(', ') || 'Signed in'}
                </span>
              </SidebarLabel>
              {state === 'expanded' && <ChevronsUpDown className="h-3 w-3 text-muted-foreground" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-rose-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
