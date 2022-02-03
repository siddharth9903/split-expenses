import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  name: string;
  @ApiPropertyOptional()
  profile_img?: string;
  @ApiPropertyOptional()
  phone?: string;
  @ApiPropertyOptional()
  currency?: string;
}
