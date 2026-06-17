import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SecurityType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateSecurityDto {
  @IsEnum(SecurityType) type!: SecurityType;
  @IsString() @MinLength(1) @MaxLength(20) ticker!: string;
  @IsString() name!: string;
  @IsString() assetClass!: string;
  @IsOptional() @IsString() exchange?: string;
  @IsString() currency!: string;
  @IsOptional() @Type(() => Number) @IsNumber() multiplier?: number;
  @IsOptional() @IsString() valuationSource?: string;
  @IsOptional() @IsString() valuationSourceId?: string;
}

export class UpdateSecurityDto {
  @IsOptional() @IsEnum(SecurityType) type?: SecurityType;
  @IsOptional() @IsString() ticker?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() assetClass?: string;
  @IsOptional() @IsString() exchange?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @Type(() => Number) @IsNumber() multiplier?: number;
  @IsOptional() @IsString() valuationSource?: string;
  @IsOptional() @IsString() valuationSourceId?: string;
}
