import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AssetClassesService } from './asset-classes.service';
import { CreateAssetClassDto, UpdateAssetClassDto } from './dto';
import { Permissions } from '../../auth/decorators/permissions.decorator';

@Controller('configuration/asset-classes')
export class AssetClassesController {
  constructor(private readonly svc: AssetClassesService) {}

  @Get() @Permissions('config:read') list() { return this.svc.list(); }
  @Post() @Permissions('assetclass:write') create(@Body() dto: CreateAssetClassDto) { return this.svc.create(dto); }
  @Patch(':id') @Permissions('assetclass:write') update(@Param('id') id: string, @Body() dto: UpdateAssetClassDto) { return this.svc.update(id, dto); }
  @Delete(':id') @Permissions('assetclass:write') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
