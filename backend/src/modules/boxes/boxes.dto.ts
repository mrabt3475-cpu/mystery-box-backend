import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class OpenBoxDto {
  @IsNotEmpty()
  @IsString()
  boxId: string;

  @IsOptional()
  @IsString()
  userSeed?: string;
}
