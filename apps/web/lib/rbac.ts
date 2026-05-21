import type { AuthUser } from './api';

/** True if the user has any of the listed roles. */
export function hasRole(user: AuthUser | null, ...roles: string[]) {
  if (!user) return false;
  return roles.some((r) => user.roles.includes(r));
}

/** True if the user has ALL the listed permissions. */
export function hasPermission(user: AuthUser | null, ...permissions: string[]) {
  if (!user) return false;
  return permissions.every((p) => user.permissions.includes(p));
}

/** True if the user has at least one of the listed permissions. */
export function hasAnyPermission(user: AuthUser | null, ...permissions: string[]) {
  if (!user) return false;
  return permissions.some((p) => user.permissions.includes(p));
}
