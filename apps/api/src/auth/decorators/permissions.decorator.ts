import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
/**
 * @Permissions('user:write', 'role:manage') — user must hold ALL listed permissions
 */
export const Permissions = (...perms: string[]) => SetMetadata(PERMISSIONS_KEY, perms);
