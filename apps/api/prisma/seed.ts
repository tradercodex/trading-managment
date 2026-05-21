import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Canonical permissions — "<resource>:<action>"
const PERMISSIONS = [
  { key: 'user:read', description: 'Read user records' },
  { key: 'user:write', description: 'Create / update user records' },
  { key: 'user:delete', description: 'Delete users' },
  { key: 'role:manage', description: 'Manage roles & permissions' },
  { key: 'trade:read', description: 'View trades' },
  { key: 'trade:execute', description: 'Execute trades' },
];

// Roles → permission keys
const ROLES: Record<string, { description: string; permissions: string[] }> = {
  admin: {
    description: 'Full system access',
    permissions: PERMISSIONS.map((p) => p.key),
  },
  manager: {
    description: 'Can manage users and view trades',
    permissions: ['user:read', 'user:write', 'trade:read', 'trade:execute'],
  },
  user: {
    description: 'Standard end-user',
    permissions: ['trade:read'],
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

    // Reset role permissions to declared set
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

  const upsertUser = async (email: string, name: string, roleId: string) => {
    const u = await prisma.user.upsert({
      where: { email },
      update: { name, passwordHash },
      create: { email, name, passwordHash },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: u.id, roleId } },
      update: {},
      create: { userId: u.id, roleId },
    });
    return u;
  };

  await upsertUser('admin@example.com', 'Admin User', adminRole.id);
  await upsertUser('manager@example.com', 'Manager User', managerRole.id);
  await upsertUser('user@example.com', 'Regular User', userRole.id);

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
