import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  name: string;
}

export class AddUserIntoGroupDto {
  @ApiProperty()
  group_id: string;
  @ApiProperty()
  user_id: string;
}
