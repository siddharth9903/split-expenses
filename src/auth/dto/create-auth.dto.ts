import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {}

export class LoginDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
