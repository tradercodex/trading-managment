import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * @Roles('admin', 'manager') — user must have AT LEAST ONE listed role
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
