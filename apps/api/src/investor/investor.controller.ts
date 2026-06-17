import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InvestorService } from './investor.service';
import { CreateInvestorDto, UpdateInvestorDto } from './dto';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('investors')
export class InvestorController {
  constructor(private readonly svc: InvestorService) {}

  @Get()
  @Permissions('investor:read')
  list(@Query('search') search?: string) {
    return this.svc.list(search);
  }

  @Get(':id')
  @Permissions('investor:read')
  get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  @Permissions('investor:write')
  create(@Body() dto: CreateInvestorDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  @Permissions('investor:write')
  update(@Param('id') id: string, @Body() dto: UpdateInvestorDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Permissions('investor:write')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
