import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExchangeRateDto {
  @IsString() currency!: string;
  @IsOptional() @IsString() symbol?: string;
  @Type(() => Number) @IsNumber() rate!: number;
  @IsDateString() rateDate!: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() sourceId?: string;
}

export class UpdateExchangeRateDto {
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() symbol?: string;
  @IsOptional() @Type(() => Number) @IsNumber() rate?: number;
  @IsOptional() @IsDateString() rateDate?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() sourceId?: string;
}
