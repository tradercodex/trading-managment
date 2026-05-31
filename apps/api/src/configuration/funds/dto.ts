import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { RankingMethod } from '@prisma/client';

export class CreateFundDto {
  @IsString() @MinLength(2) amcName!: string;
  @IsString() @MinLength(2) fundName!: string;
  @IsString() @MaxLength(8) reportingCurrency!: string;
  @IsEnum(RankingMethod) rankingMethod!: RankingMethod;
}

export class UpdateFundDto {
  @IsOptional() @IsString() amcName?: string;
  @IsOptional() @IsString() fundName?: string;
  @IsOptional() @IsString() reportingCurrency?: string;
  @IsOptional() @IsEnum(RankingMethod) rankingMethod?: RankingMethod;
}
