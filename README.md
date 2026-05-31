# Trading Software — Monorepo

A production-shape monorepo built with **Turborepo + pnpm workspaces**.

- `apps/api` — **NestJS 10** backend with **Prisma 5** (PostgreSQL), JWT access + refresh tokens, and **role / permission** based access control (RBAC).
- `apps/web` — **Next.js 14** (App Router) frontend styled with **Tailwind + shadcn/ui**, with client-side auth provider, protected routes, and role/permission-aware UI.

---

## Folder layout

```
.
├── apps/
│   ├── api/                     # NestJS + Prisma backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # User / Role / Permission / RefreshToken
│   │   │   └── seed.ts          # Seeds admin / manager / user accounts
│   │   ├── src/
│   │   │   ├── auth/            # Module, controller, service, JWT strategies, guards, decorators
│   │   │   ├── users/           # Example RBAC-protected routes
│   │   │   ├── prisma/          # PrismaModule + PrismaService
│   │   │   ├── app.module.ts    # Wires global JWT + Roles + Permissions guards
│   │   │   └── main.ts
│   │   └── package.json
│   └── web/                     # Next.js 14 + shadcn/ui
│       ├── app/
│       │   ├── login/           # Login page
│       │   ├── register/        # Register page
│       │   └── dashboard/       # Protected area (overview / users / admin)
│       ├── components/
│       │   ├── ui/              # shadcn-style primitives (Button, Card, Input, Label, Badge)
│       │   ├── auth-provider.tsx
│       │   └── protected.tsx    # <Protected roles=[...] permissions=[...]/>
│       └── lib/
│           ├── api.ts           # fetch wrapper w/ silent refresh-token retry
│           └── rbac.ts          # hasRole / hasPermission helpers
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── .env.example
```

---

## Prerequisites

- Node.js **>= 18.18**
- pnpm **>= 9** (`npm i -g pnpm`)
- A running **PostgreSQL** instance (locally, Docker, Supabase, Neon…)

---

## 1 · Install

From the monorepo root:

```bash
pnpm install
```

## 2 · Configure environment

Copy the example envs and fill them in:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Set `DATABASE_URL` in `apps/api/.env`, e.g.:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trading?schema=public"
```

If you don't have Postgres locally, the quickest way is Docker:

```bash
docker run --name trading-pg \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=trading \
  -p 5432:5432 -d postgres:16
```

## 3 · Generate Prisma client, migrate & seed

```bash
pnpm db:generate
pnpm db:migrate     # creates the initial migration & applies it
pnpm db:seed        # creates default roles, permissions and 3 demo users
```

The seed creates three accounts (all with password **`Password123!`**):

| Email                 | Role     | Permissions                                                  |
| --------------------- | -------- | ------------------------------------------------------------ |
| admin@example.com     | admin    | user:read, user:write, user:delete, role:manage, trade:*     |
| manager@example.com   | manager  | user:read, user:write, trade:read, trade:execute             |
| user@example.com      | user     | trade:read                                                   |

## 4 · Run everything

```bash
pnpm dev
```

Turborepo will start both apps in parallel:

- API   → http://localhost:4000/api
- Web   → http://localhost:3000

Open http://localhost:3000, sign in with one of the seeded accounts, and explore. Notice that the **Users** and **Admin** nav links only render for accounts that hold the required permission / role.

---

## How the auth flow works

```
Browser  ──login──►  POST /api/auth/login
                    ◄── { accessToken } + HttpOnly cookie: refreshToken
Browser  ──any request──►  Authorization: Bearer <accessToken>
                          ◄── 401 if expired
Browser  ──silent refresh──►  POST /api/auth/refresh (cookie sent automatically)
                              ◄── new { accessToken } + rotated refreshToken cookie
```

- Access tokens are **stateless JWTs** (default 15 min), kept **in memory only**.
- Refresh tokens are **JWTs whose SHA-256 hash is stored in the DB** (`RefreshToken` table) so revocation and rotation work properly. The token itself is delivered as a **secure HttpOnly cookie scoped to `/api/auth`**.
- On every refresh, the old token is marked `revokedAt` and a new one is issued (token rotation).
- `JwtAuthGuard` (global) authenticates every request unless the route is `@Public()`.
- `RolesGuard` (global) enforces `@Roles('admin')` — needs **at least one** of the listed roles.
- `PermissionsGuard` (global) enforces `@Permissions('user:write')` — needs **all** of the listed permissions.

Example controller:

```ts
@Get()
@Roles('admin', 'manager')
@Permissions('user:read')
listUsers() { … }
```

Frontend equivalent:

```tsx
<Protected roles={['admin']} permissions={['role:manage']}>
  <AdminPanel />
</Protected>
```

---

## Useful commands

```bash
pnpm dev               # Start API + Web in parallel
pnpm build             # Build everything
pnpm lint              # Lint all packages
pnpm db:migrate        # Create / apply a new Prisma migration (dev)
pnpm db:seed           # Re-run the seed
pnpm db:studio         # Open Prisma Studio
```

---

## Adding a new shadcn component

Components are already wired up via `apps/web/components.json`. From inside `apps/web`:

```bash
pnpm dlx shadcn@latest add dialog
```

This will drop the new primitive into `apps/web/components/ui/`.

---

## Configuration module (NEW)

A full **Configuration** area was added — sidebar item `Configuration` opens a 6-tab page that mirrors the Tax Lot Manager reference:

| Tab | Backend endpoints | Write permission |
| --- | --- | --- |
| 👤 User Management | `GET/POST/PATCH/DELETE /api/users` | `user:write` (`user:delete` for delete) |
| 🏢 Fund Detail | `…/api/configuration/funds` | `fund:write` |
| 🏦 Custodian | `…/api/configuration/custodians` (api/secret/passphrase masked on read) | `custodian:write` |
| 🗂️ Asset Class | `…/api/configuration/asset-classes` | `assetclass:write` |
| 📌 Pre Define | `…/api/configuration/pre-defines` | `predefine:write` |
| 📒 Chart of Accounts | `…/api/configuration/chart-of-accounts` | `coa:write` |

All read endpoints require `config:read`. The seed populates a few sample funds, custodians, asset classes, pre-defines and chart-of-account rows so the tables aren't empty on first run.

User Management has 4 inner sub-tabs (Basic Info · Access & Roles · Status · Fund Allocated) matching the reference. The Add-User dialog has a tabbed form (Basic Info / Access & Roles / Fund Allocation) that drives a single `POST /api/users` payload — `username`, `fullName`, `employeeId`, `status`, `modules[]`, `roleName`, `fundIds[]`.

## UI redesign (NEW)

- **Login page** — full-bleed dark gradient with three animated `framer-motion` blobs, a gradient-bordered card, motion fade-ins on each field, and a gradient sign-in button. Demo accounts are listed inside the card for one-click testing.
- **Dashboard** — full **shadcn-style sidebar** (`Dashboard, Configuration, Investor, Valuation, Trading, Accounting, Reports`) with a collapsible chevron toggle in the header. User profile dropdown lives in the sidebar footer (matches the reference).
- **Dashboard home** — gradient stat tiles (Total Trades, Open Tax Lots, Total Notional, Fund Valuation) animated with a staggered entrance.

## File map of new code

```
apps/api/src/configuration/
├── configuration.module.ts
├── funds/                {controller, service, dto}
├── custodians/           {controller, service, dto}
├── asset-classes/        {controller, service, dto}
├── pre-defines/          {controller, service, dto}
└── chart-of-accounts/    {controller, service, dto}

apps/web/app/dashboard/
├── configuration/page.tsx        # 6-tab page
├── investor|valuation|trading|accounting|reports/page.tsx   # placeholders
└── (others)

apps/web/components/
├── dashboard-sidebar.tsx         # shadcn-style sidebar with user dropdown
├── coming-soon.tsx
├── config/
│   ├── user-mgmt-panel.tsx       # tabs + Add-User dialog
│   ├── fund-detail-panel.tsx
│   ├── custodian-panel.tsx
│   ├── asset-class-panel.tsx
│   ├── pre-define-panel.tsx
│   ├── chart-of-accounts-panel.tsx
│   └── data-toolbar.tsx
└── ui/                           # sidebar, tabs, dialog, select, dropdown-menu, avatar,
                                  # tooltip, separator, table, button, input, label, card, badge

apps/web/lib/config-api.ts        # typed API helpers for every config entity
```

## Next things to wire up

- Email verification + password reset flows.
- A `Trades` module on the API to demonstrate `trade:execute` enforcement end-to-end.
- A `<DataTable>` with TanStack Table on the frontend.
- Audit logging for permission-sensitive mutations.
# Crypto_reco_2026
