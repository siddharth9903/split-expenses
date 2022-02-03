import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User, UserModel } from './entities/user.model';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto:any) {
    return this.usersService.create(createUserDto);
  }

  @Get('getall')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('test')
  test() {
    return this.usersService.test();
  }

  @Get('findByEmail/:email')
  findOne(@Param('email') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('update/:email')
  update(@Param('email') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('delete/:email')
  remove(@Param('email') id: string) {
    return this.usersService.remove(id);
  }
}
