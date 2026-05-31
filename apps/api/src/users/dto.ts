import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class CreateUserDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() employeeId?: string;
  @IsOptional() @MinLength(8) password?: string;
  @IsOptional() @IsString() roleName?: string;
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
  @IsOptional() @IsArray() @IsString({ each: true }) modules?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) fundIds?: string[];
}

export class UpdateUserDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() username?: string;
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() employeeId?: string;
  @IsOptional() @MinLength(8) password?: string;
  @IsOptional() @IsString() roleName?: string;
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;
  @IsOptional() @IsArray() @IsString({ each: true }) modules?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) fundIds?: string[];
}
