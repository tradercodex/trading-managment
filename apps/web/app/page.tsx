'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Coins,
  FileText,
  LayoutDashboard,
  LineChart,
  LogIn,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users as UsersIcon,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: ShieldCheck,
    title: 'Roles & permissions',
    body: 'JWT auth with refresh-token rotation. Fine-grained @Roles and @Permissions guards baked into every endpoint.',
    tint: 'from-emerald-400 to-teal-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Configuration first',
    body: 'Funds, custodians, asset classes, chart of accounts and lookups — fully editable from the UI.',
    tint: 'from-sky-400 to-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Trading & valuation',
    body: 'Track tax lots, transfers, market prices and exchange rates with FIFO / LIFO / MFIFO ranking.',
    tint: 'from-amber-400 to-orange-500',
  },
  {
    icon: Receipt,
    title: 'Accounting reports',
    body: 'Balance sheet, income statement, cash flow and reconciliations generated from your trade data.',
    tint: 'from-violet-400 to-fuchsia-500',
  },
  {
    icon: UsersIcon,
    title: 'Investor tracking',
    body: 'Basic info, KYC status, tax info — investors linked to the funds they own.',
    tint: 'from-rose-400 to-pink-500',
  },
  {
    icon: FileText,
    title: 'Audit-ready exports',
    body: 'Every table exports to CSV. Every mutation logged. Every role assignment recorded.',
    tint: 'from-cyan-400 to-indigo-500',
  },
];

const stats = [
  { value: '6', label: 'Configuration modules' },
  { value: '12', label: 'Built-in permissions' },
  { value: '3', label: 'Demo roles to start' },
  { value: '< 1s', label: 'Dev hot reload' },
];

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Animated background blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-600 opacity-30 blur-3xl"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-rose-500 opacity-25 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0], scale: [1, 1.05, 0.9, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 h-[440px] w-[440px] rounded-full bg-gradient-to-tr from-violet-500 via-indigo-500 to-blue-500 opacity-20 blur-3xl"
        animate={{ scale: [1, 1.15, 0.95, 1], rotate: [0, 60, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      <div className="relative z-10">
        {/* ─── Nav ─── */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-fuchsia-500 shadow-lg">
              <LineChart className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">Tax Lot Manager</span>
          </Link>
          <div className="flex items-center gap-2">
            {loading ? null : user ? (
              <Button asChild className="bg-white text-slate-900 hover:bg-white/90">
                <Link href="/dashboard">
                  Open dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  <Link href="/login">
                    <LogIn className="mr-1 h-4 w-4" /> Sign in
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-sky-500 via-fuchsia-500 to-amber-400 text-white">
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </motion.nav>

        {/* ─── Hero ─── */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Now with Configuration, RBAC, and live dashboards.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="bg-gradient-to-br from-white via-sky-100 to-fuchsia-200 bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent md:text-7xl"
          >
            Run your fund
            <br />
            <span className="bg-gradient-to-r from-sky-300 via-fuchsia-300 to-amber-300 bg-clip-text">
              with confidence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
          >
            Trades, tax lots, valuation, accounting and reports — all in one dashboard,
            with role-based access for every team member.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {user ? (
              <Button asChild size="lg" className="group bg-gradient-to-r from-sky-500 via-fuchsia-500 to-amber-400 text-white">
                <Link href="/dashboard">
                  Go to dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="group bg-gradient-to-r from-sky-500 via-fuchsia-500 to-amber-400 text-white">
                  <Link href="/register">
                    Create your account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/login">Try the demo</Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Mock app preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <div className="rounded-2xl bg-gradient-to-br from-sky-400/40 via-fuchsia-400/30 to-amber-300/30 p-[1px] shadow-2xl">
              <div className="rounded-2xl border border-white/5 bg-slate-900/80 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-400/70" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/70" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                  <div className="ml-3 text-xs text-white/40">tax-lot-manager.app / dashboard</div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { l: 'Total Trades', v: '1,284', i: BarChart3, t: 'from-sky-400 to-blue-500' },
                    { l: 'Open Lots', v: '312', i: LineChart, t: 'from-emerald-400 to-teal-500' },
                    { l: 'Notional', v: '$8.4M', i: Coins, t: 'from-amber-400 to-orange-500' },
                    { l: 'P&L (YTD)', v: '+12.4%', i: Zap, t: 'from-violet-400 to-fuchsia-500' },
                  ].map((s, idx) => (
                    <motion.div
                      key={s.l}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.08 }}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-white/50">{s.l}</span>
                        <div className={'flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ' + s.t}>
                          <s.i className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="mt-2 text-xl font-bold">{s.v}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Stats strip ─── */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:grid-cols-4"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-sky-300 to-fuchsia-300 bg-clip-text text-3xl font-bold text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── Features ─── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Everything you need to run the desk.</h2>
            <p className="mt-3 text-white/60">From scope of trades to the audit log — one platform.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-colors hover:border-white/20"
              >
                <div
                  className={
                    'mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow ' +
                    f.tint
                  }
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/60">{f.body}</p>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-tr from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── CTA ─── */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-fuchsia-500 to-amber-400 p-[1px] shadow-2xl"
          >
            <div className="rounded-3xl bg-slate-950/90 p-10 text-center backdrop-blur md:p-14">
              <h2 className="text-3xl font-bold md:text-4xl">Ready to ship?</h2>
              <p className="mt-3 text-white/70">
                Pre-seeded with three demo accounts. Sign in and explore the full dashboard in seconds.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="group bg-white text-slate-900 hover:bg-white/90">
                  <Link href={user ? '/dashboard' : '/login'}>
                    {user ? 'Open dashboard' : 'Sign in'}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                {!user && (
                  <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <Link href="/register">Create account</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-sky-400 to-fuchsia-500">
                <LineChart className="h-3 w-3 text-white" />
              </div>
              <span>Tax Lot Manager · Trading Software</span>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/login" className="hover:text-white">Sign in</Link>
              <Link href="/register" className="hover:text-white">Register</Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
