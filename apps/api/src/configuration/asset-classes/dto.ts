import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PrimaryAssetClass } from '@prisma/client';

export class CreateAssetClassDto {
  @IsEnum(PrimaryAssetClass) primary!: PrimaryAssetClass;
  @IsString() secondary!: string;
  @IsString() valuationSource!: string;
}

export class UpdateAssetClassDto {
  @IsOptional() @IsEnum(PrimaryAssetClass) primary?: PrimaryAssetClass;
  @IsOptional() @IsString() secondary?: string;
  @IsOptional() @IsString() valuationSource?: string;
}
