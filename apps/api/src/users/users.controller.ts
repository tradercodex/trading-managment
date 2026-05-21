import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** Anyone authenticated can read their own profile */
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.users.findOne(user.sub);
  }

  /** Admin OR users with `user:read` may list */
  @Get()
  @Permissions('user:read')
  list() {
    return this.users.findAll();
  }

  @Get(':id')
  @Permissions('user:read')
  get(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  /** Only admins can assign roles */
  @Patch(':id/role')
  @Roles('admin')
  @Permissions('role:manage')
  assignRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.users.assignRole(id, body.role);
  }

  /** Activate / deactivate a user — requires user:write */
  @Patch(':id/active')
  @Permissions('user:write')
  setActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.users.setActive(id, body.isActive);
  }
}
