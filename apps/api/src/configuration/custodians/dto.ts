import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCustodianDto {
  @IsOptional() @IsString() fundId?: string;
  @IsString() @MinLength(1) fundName!: string;
  @IsString() @MinLength(1) custodianName!: string;
  @IsString() @MinLength(1) accountNumber!: string;
  @IsString() reportingCurrency!: string;
  @IsOptional() @IsString() apiKey?: string;
  @IsOptional() @IsString() secretKey?: string;
  @IsOptional() @IsString() passphrase?: string;
}

export class UpdateCustodianDto {
  @IsOptional() @IsString() fundId?: string;
  @IsOptional() @IsString() fundName?: string;
  @IsOptional() @IsString() custodianName?: string;
  @IsOptional() @IsString() accountNumber?: string;
  @IsOptional() @IsString() reportingCurrency?: string;
  @IsOptional() @IsString() apiKey?: string;
  @IsOptional() @IsString() secretKey?: string;
  @IsOptional() @IsString() passphrase?: string;
}
