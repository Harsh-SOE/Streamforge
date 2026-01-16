import { IsOptional, IsString } from 'class-validator';

export class PreSignedUrlRequestDto {
  @IsOptional()
  @IsString()
  fileName?: string;
}
