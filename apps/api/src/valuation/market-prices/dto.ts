import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMarketPriceDto {
  @IsString() ticker!: string;
  @IsString() name!: string;
  @IsString() assetClass!: string;
  @IsString() currency!: string;
  @Type(() => Number) @IsNumber() price!: number;
  @IsDateString() priceDate!: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() sourceId?: string;
}

export class UpdateMarketPriceDto {
  @IsOptional() @IsString() ticker?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() assetClass?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @Type(() => Number) @IsNumber() price?: number;
  @IsOptional() @IsDateString() priceDate?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() sourceId?: string;
}
