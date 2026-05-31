import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PreDefinesService } from './pre-defines.service';
import { CreatePreDefineDto, UpdatePreDefineDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('configuration/pre-defines')
export class PreDefinesController {
  constructor(private readonly svc: PreDefinesService) {}

  @Get() @Permissions('config:read') list() { return this.svc.list(); }
  @Post() @Permissions('predefine:write') create(@Body() dto: CreatePreDefineDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('predefine:write') update(@Param('id') id: string, @Body() dto: UpdatePreDefineDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('predefine:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
