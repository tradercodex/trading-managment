import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  InvestorEntityType,
  FormStatus,
  W8Status,
  FatcaClassification,
} from '@prisma/client';

export class InvestorKycInput {
  @IsString() @MinLength(2) primaryAddress!: string;
  @IsOptional() @IsString() mailingAddress?: string;
  @IsString() cityStateZip!: string;
  @IsString() country!: string;
  @IsString() citizenship!: string;
  @IsOptional() @IsString() taxResidency?: string;
}

export class InvestorTaxInput {
  @IsOptional() @IsString() tinSsnEin?: string;
  @IsOptional() @IsEnum(FormStatus) w9Status?: FormStatus;
  @IsOptional() @IsEnum(W8Status) w8Status?: W8Status;
  @IsOptional() @IsEnum(FatcaClassification) fatca?: FatcaClassification;
  @IsOptional() @IsBoolean() backupWithholding?: boolean;
}

export class CreateInvestorDto {
  @IsString() @MinLength(2) @MaxLength(160) fullName!: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsEnum(InvestorEntityType) entityType!: InvestorEntityType;
  @IsOptional() @IsString() ssnTin?: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;

  @IsOptional() @ValidateNested() @Type(() => InvestorKycInput) kyc?: InvestorKycInput;
  @IsOptional() @ValidateNested() @Type(() => InvestorTaxInput) tax?: InvestorTaxInput;
}

export class UpdateInvestorDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsEnum(InvestorEntityType) entityType?: InvestorEntityType;
  @IsOptional() @IsString() ssnTin?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;

  @IsOptional() @ValidateNested() @Type(() => InvestorKycInput) kyc?: InvestorKycInput;
  @IsOptional() @ValidateNested() @Type(() => InvestorTaxInput) tax?: InvestorTaxInput;
}
