import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePreDefineDto {
  @IsString() @MinLength(1) category!: string;
  @IsString() @MinLength(1) code!: string;
  @IsString() @MinLength(1) label!: string;
  @IsOptional() @IsString() description?: string;
}

export class UpdatePreDefineDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() description?: string;
}
