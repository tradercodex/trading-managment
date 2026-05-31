import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.users.get(user.sub);
  }

  @Get()
  @Permissions('user:read')
  list() {
    return this.users.list();
  }

  @Get(':id')
  @Permissions('user:read')
  get(@Param('id') id: string) {
    return this.users.get(id);
  }

  @Post()
  @Permissions('user:write')
  create(@Body() dto: CreateUserDto, @CurrentUser() me: JwtPayload) {
    return this.users.create(dto, me?.email);
  }

  @Patch(':id')
  @Permissions('user:write')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Patch(':id/active')
  @Permissions('user:write')
  setActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.users.setActive(id, body.isActive);
  }

  @Delete(':id')
  @Roles('admin')
  @Permissions('user:delete')
  remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}
