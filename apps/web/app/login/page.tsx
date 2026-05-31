'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LineChart, ShieldCheck, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Password123!');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Animated gradient blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-600 opacity-40 blur-3xl"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-rose-500 opacity-40 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0], scale: [1, 1.05, 0.9, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-500 via-indigo-500 to-blue-500 opacity-25 blur-3xl"
        animate={{ scale: [1, 1.15, 0.95, 1], rotate: [0, 60, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-12 md:grid-cols-2">
        {/* Branding side */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hidden flex-col gap-8 md:flex"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500 shadow-lg">
              <LineChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold">Tax Lot Manager</div>
              <div className="text-sm text-white/60">Trading Software · v1.0</div>
            </div>
          </div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-gradient-to-r from-white via-sky-200 to-fuchsia-200 bg-clip-text text-4xl font-bold leading-tight text-transparent md:text-5xl"
            >
              Welcome back.
              <br />
              Let&apos;s get to work.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4 max-w-md text-white/70"
            >
              A single dashboard for trades, valuation, accounting and reports — with role-based
              access for every team member.
            </motion.p>
          </div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
            }}
            className="grid gap-3"
          >
            {[
              { icon: ShieldCheck, label: 'JWT auth with refresh-token rotation' },
              { icon: Sparkles, label: 'Roles & permissions enforced end-to-end' },
              { icon: LineChart, label: 'Funds, custodians and CoA configuration built-in' },
            ].map((f) => (
              <motion.li
                key={f.label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
              >
                <f.icon className="h-5 w-5 text-cyan-300" />
                <span className="text-sm text-white/80">{f.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        {/* Login card side */}
        <motion.section
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto w-full max-w-md"
        >
          {/* Gradient border wrapper */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-400/60 via-fuchsia-400/40 to-amber-300/40 p-[1px] shadow-2xl">
            <div className="rounded-2xl bg-slate-900/80 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3 md:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500">
                  <LineChart className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Tax Lot Manager</span>
              </div>

              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="mt-1 text-sm text-white/60">Use your work account.</p>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-sky-400"
                    placeholder="you@example.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/80">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="text-xs text-white/50 hover:text-white"
                    >
                      {showPwd ? (
                        <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> Hide</span>
                      ) : (
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Show</span>
                      )}
                    </button>
                  </div>
                  <Input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="border-white/15 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-fuchsia-400"
                    placeholder="••••••••"
                  />
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full overflow-hidden bg-gradient-to-r from-sky-500 via-fuchsia-500 to-amber-400 text-white hover:opacity-95"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <p className="text-center text-sm text-white/50">
                  No account?{' '}
                  <Link href="/register" className="text-sky-300 underline-offset-4 hover:underline">
                    Create one
                  </Link>
                </p>
              </form>

              <div className="mt-6 rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs text-white/50">
                Demo accounts — all use password{' '}
                <code className="rounded bg-white/10 px-1 py-0.5 text-white/80">Password123!</code>
                <br />
                <span className="text-white/70">admin@example.com</span> ·{' '}
                <span className="text-white/70">manager@example.com</span> ·{' '}
                <span className="text-white/70">user@example.com</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
