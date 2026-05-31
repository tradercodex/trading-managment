'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Coins,
  TrendingUp,
  Layers,
  ShieldCheck,
  Users as UsersIcon,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: 'Total Trades', value: '0', sub: '0 records', icon: BarChart3, tint: 'from-sky-400 to-blue-500' },
  { label: 'Open Tax Lots', value: '2', sub: 'Active positions', icon: Layers, tint: 'from-emerald-400 to-teal-500' },
  { label: 'Total Notional', value: '$0', sub: 'Base currency', icon: Coins, tint: 'from-amber-400 to-orange-500' },
  { label: 'Fund Valuation', value: '$2.0K', sub: 'Cost basis', icon: TrendingUp, tint: 'from-violet-400 to-fuchsia-500' },
];

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h2>
        <p className="text-sm text-muted-foreground">Portfolio overview &amp; key metrics.</p>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="mt-1 text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.sub}</div>
                  </div>
                  <div
                    className={
                      'flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br text-white ' +
                      s.tint
                    }
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Your roles
            </CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-base">
              <UsersIcon className="h-4 w-4 text-sky-500" />
              Your permissions
            </CardTitle>
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
