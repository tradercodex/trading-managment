import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Canonical permissions
const PERMISSIONS = [
  // Identity
  { key: 'user:read', description: 'Read user records' },
  { key: 'user:write', description: 'Create / update users' },
  { key: 'user:delete', description: 'Delete users' },
  { key: 'role:manage', description: 'Manage roles & permissions' },
  // Trading
  { key: 'trade:read', description: 'View trades' },
  { key: 'trade:execute', description: 'Execute trades' },
  // Configuration
  { key: 'config:read', description: 'View configuration' },
  { key: 'fund:write', description: 'Manage funds' },
  { key: 'custodian:write', description: 'Manage custodians' },
  { key: 'assetclass:write', description: 'Manage asset classes' },
  { key: 'predefine:write', description: 'Manage pre-define lookups' },
  { key: 'coa:write', description: 'Manage chart of accounts' },
];

const ROLES: Record<string, { description: string; permissions: string[] }> = {
  admin: {
    description: 'Full system access',
    permissions: PERMISSIONS.map((p) => p.key),
  },
  manager: {
    description: 'Manages users, configuration and trades',
    permissions: [
      'user:read',
      'user:write',
      'trade:read',
      'trade:execute',
      'config:read',
      'fund:write',
      'custodian:write',
      'assetclass:write',
      'predefine:write',
      'coa:write',
    ],
  },
  user: {
    description: 'Standard end-user',
    permissions: ['trade:read', 'config:read'],
  },
};

async function main() {
  console.log('Seeding permissions…');
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: p.key },
      update: { description: p.description },
      create: p,
    });
  }

  console.log('Seeding roles…');
  for (const [name, def] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: { description: def.description },
      create: { name, description: def.description },
    });
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    const perms = await prisma.permission.findMany({
      where: { key: { in: def.permissions } },
    });
    await prisma.rolePermission.createMany({
      data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })),
      skipDuplicates: true,
    });
  }

  console.log('Seeding users…');
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'admin' } });
  const managerRole = await prisma.role.findUniqueOrThrow({ where: { name: 'manager' } });
  const userRole = await prisma.role.findUniqueOrThrow({ where: { name: 'user' } });

  const upsertUser = async (
    email: string,
    username: string,
    fullName: string,
    employeeId: string,
    roleId: string,
  ) => {
    const u = await prisma.user.upsert({
      where: { email },
      update: { username, fullName, employeeId, passwordHash },
      create: { email, username, fullName, employeeId, passwordHash, createdBy: 'seed' },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: u.id, roleId } },
      update: {},
      create: { userId: u.id, roleId },
    });
    return u;
  };

  await upsertUser('admin@example.com', 'admin', 'Admin User', 'EMP-00001', adminRole.id);
  await upsertUser('manager@example.com', 'manager', 'Manager User', 'EMP-00002', managerRole.id);
  await upsertUser('user@example.com', 'user', 'Regular User', 'EMP-00003', userRole.id);

  console.log('Seeding configuration sample data…');

  // Funds
  const fund1 = await prisma.fund.upsert({
    where: { fundName: 'Oracle Growth Fund' },
    update: {},
    create: {
      amcName: 'Oracle Asset Management',
      fundName: 'Oracle Growth Fund',
      reportingCurrency: 'USD',
      rankingMethod: 'FIFO',
    },
  });
  await prisma.fund.upsert({
    where: { fundName: 'Apex Capital Fund' },
    update: {},
    create: {
      amcName: 'Apex Capital',
      fundName: 'Apex Capital Fund',
      reportingCurrency: 'USD',
      rankingMethod: 'LIFO',
    },
  });

  // Custodian
  await prisma.custodian.upsert({
    where: { id: 'seed-custodian-1' },
    update: {},
    create: {
      id: 'seed-custodian-1',
      fundId: fund1.id,
      fundName: fund1.fundName,
      custodianName: 'Binance',
      accountNumber: 'Binance Main_001',
      reportingCurrency: 'USD',
    },
  });

  // Asset classes
  for (const [primary, secondary, source] of [
    ['EQUITIES', 'Large Cap Growth', 'Bloomberg'],
    ['CRYPTOCURRENCIES', 'Layer-1', 'CoinMarketCap'],
    ['FIXED_INCOME', 'Investment Grade', 'Refinitiv'],
  ] as const) {
    await prisma.assetClass.upsert({
      where: { primary_secondary: { primary, secondary } },
      update: { valuationSource: source },
      create: { primary, secondary, valuationSource: source },
    });
  }

  // Pre Define
  for (const [category, code, label] of [
    ['Trade Type', 'TRD-001', 'Buy Trade'],
    ['Trade Type', 'TRD-002', 'Sell Trade'],
    ['Side', 'B', 'Buy'],
    ['Side', 'S', 'Sell'],
  ] as const) {
    await prisma.preDefine.upsert({
      where: { category_code: { category, code } },
      update: { label },
      create: { category, code, label },
    });
  }

  // Chart of Accounts
  for (const [code, name, type] of [
    ['1000', 'Cash and Cash Equivalents', 'ASSET'],
    ['1200', 'Investments', 'ASSET'],
    ['2000', 'Accounts Payable', 'LIABILITY'],
    ['3000', 'Capital', 'EQUITY'],
    ['4000', 'Trading Revenue', 'REVENUE'],
    ['5000', 'Operating Expenses', 'EXPENSE'],
  ] as const) {
    await prisma.chartOfAccount.upsert({
      where: { code },
      update: { name, type },
      create: { code, name, type, currency: 'USD' },
    });
  }

  console.log('Seed complete.');
  console.log('Login with:');
  console.log('  admin@example.com   / Password123!');
  console.log('  manager@example.com / Password123!');
  console.log('  user@example.com    / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
