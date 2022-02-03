import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsDefined()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  profile_img?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  currency?: string;
}
