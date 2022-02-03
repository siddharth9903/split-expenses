import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AddUserIntoGroupDto, CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Groups')
@Controller('group')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // @Post('create')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Post('create')
  create(@Req() req, @Body() createGroupDto: any) {
    return this.groupsService.create(createGroupDto);
  }

  @Post('addExpence')
  addExpence(@Req() req, @Body() addExpenceDto: any) {
    return this.groupsService.addExpence(addExpenceDto);
  }


  @Post('addUserIntoGroup')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  addUserIntoGroup(@Req() req, @Body() addUserIntoGroup: AddUserIntoGroupDto) {
    const id = req?.user?.payload?.id;
    return this.groupsService.addUserIntoGroup(addUserIntoGroup, id);
  }

  // @Post('removeUserfromGroup')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Post('removeUserfromGroup')
  removeUserfromGroup(
    @Req() req,
    @Body() addUserIntoGroup: AddUserIntoGroupDto,
  ) {
    const id = req?.user?.payload?.id;
    return this.groupsService.removeUserfromGroup(addUserIntoGroup, id);
  }

  @Get('getbyid/:id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}

@Controller('user')
export class UserExpenseController{
  constructor(private readonly groupsService: GroupsService) {}

  @Post('addExpence')
  addExpence(@Req() req, @Body() addExpenceDto: any) {
    return this.groupsService.addExpenceToUser(addExpenceDto);
  }

  @Post('expense-relation')
  getExpense(@Body() expenseDto: any) {
    return this.groupsService.getExpenceRelation(expenseDto);
  }

}