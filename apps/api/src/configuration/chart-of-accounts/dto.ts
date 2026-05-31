import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateChartOfAccountDto {
  @IsString() @MinLength(1) code!: string;
  @IsString() @MinLength(1) name!: string;
  @IsEnum(AccountType) type!: AccountType;
  @IsOptional() @IsString() parentCode?: string;
  @IsString() currency!: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdateChartOfAccountDto {
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(AccountType) type?: AccountType;
  @IsOptional() @IsString() parentCode?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() description?: string;
}
