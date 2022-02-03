import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserKey, UserModel } from 'src/users/entities/user.model';
import { ExpenseKey, ExpenseModel } from '../expenses/entities/expense.entity';
import { AddUserIntoGroupDto, CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupKey, GroupModel } from './entities/group.model';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('groups') private groupRepository: Model<GroupModel, GroupKey>,
    @InjectModel('users') private userRepository: Model<UserModel, UserKey>,
    @InjectModel('expenses') private expensesRepository: Model<ExpenseModel, ExpenseKey>,
  ) { }

  // async create(createGroupDto: CreateGroupDto, ownerid: string) {
  //   return await this.groupRepository.create({
  //     ...createGroupDto,
  //     owner: ownerid,
  //   });
  // }

  async create(createGroupDto: any) {

    const group = await this.groupRepository.create(createGroupDto);
    await group.save();
    console.log(group);
    return group;
  }

  async addExpence(addExpenceDto: any) {
    const sender = addExpenceDto?.sender;
    const group = addExpenceDto?.group;
    const amount = addExpenceDto?.amount;
    let amountPerUser = 0;
    let totalParticipants = 0;
    const fullGroup = await this.groupRepository.findById(group);
    const users = fullGroup.users;

    for (let user of users) {
      totalParticipants = totalParticipants + 1;
    }
    amountPerUser = amount / totalParticipants;
    for (let user of users) {
      let expenseObj = {
        sender: sender,
        reciever: user,
        amount: amountPerUser
      }
      await this.expensesRepository.create(expenseObj)
      let sender1 = await this.userRepository.findById(sender)
      let senderBalance = sender1.balance ? sender1.balance : 0;
      let senderObj = {
        ...sender,
        balance: senderBalance - amountPerUser
      }
      await this.userRepository.findByIdAndUpdate(sender, senderObj)
      let reciever1 = await this.userRepository.findById(user)
      let receiverBalance = reciever1.balance ? reciever1.balance : 0;
      let recieverObj = {
        ...sender,
        balance: receiverBalance + amountPerUser
      }
      await this.userRepository.findByIdAndUpdate(user, recieverObj)
    }
    console.log(fullGroup);
    return fullGroup;
  }

  async addExpenceToUser(addExpenceDto: any) {

    const sender = addExpenceDto?.sender;
    const reciever = addExpenceDto?.reciever;
    const amount = addExpenceDto?.amount;
    let expenseObj = {
      sender: sender,
      reciever: reciever,
      amount: amount
    }
    await this.expensesRepository.create(expenseObj)
    let sender1 = await this.userRepository.findById(sender)
    let senderBalance = sender1.balance ? sender1.balance : 0;
    let senderObj = {
      ...sender,
      balance: senderBalance - amount
    }
    await this.userRepository.findByIdAndUpdate(sender, senderObj)
    let reciever1 = await this.userRepository.findById(reciever)
    let receiverBalance = reciever1.balance ? reciever1.balance : 0;
    let recieverObj = {
      ...sender,
      balance: receiverBalance + amount
    }
    await this.userRepository.findByIdAndUpdate(reciever, recieverObj)
    return;
  }

  async getExpenceRelation(expenseDto) {
    const user1 = expenseDto?.user1;
    const user2 = expenseDto?.user2;
    let user1ToUser2 = 0;
    let user2ToUser1 = 0;
    let user1Expenses = await this.expensesRepository.find({ sender: user1, reciever: user2 })
    if (user1Expenses) {
      for (let expense of user1Expenses) {
        user1ToUser2 = user1ToUser2 + expense.amount;
      }
    }
    let user2Expenses = await this.expensesRepository.find({ sender: user2, reciever: user1 })
    if (user2Expenses) {
      for (let expense of user2Expenses) {
        user2ToUser1 = user2ToUser1 + expense.amount;
      }
    }
    let high;
    let low;
    let netAmmount = 0;
    if (user1ToUser2 > user2ToUser1) {
      high = {"name":"user1",id:user1};
      low = {"name":"user2",id:user2};
      netAmmount = user1ToUser2 - user2ToUser1;
    } else {
      high = {"name":"user2",id:user2};
      low = {"name":"user1",id:user1};
      netAmmount = user2ToUser1 - user1ToUser2
    }
    let string1=`${low.name} (${low.id}) owes ${netAmmount} to ${high.name} (${high.id}) `

    return {
      "sendByUser1": user1ToUser2,
      "sendByUser2": user2ToUser1,
      "details": string1
    }

  }

  async addUserIntoGroup(createGroupDto: AddUserIntoGroupDto, ownerid: string) {
    const group = await this.groupRepository.findById({
      _id: createGroupDto.group_id,
    });
    if (!group) {
      throw new NotFoundException('Group Not Found');
    }
    const user = await this.userRepository.findById({
      _id: createGroupDto.user_id,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const userfound = (await group.populate('users')).users.filter(
      (user) => user['id'] === createGroupDto.user_id,
    );
    if (userfound.length !== 0) {
      throw new BadRequestException('User Already In Group');
    }
    var users: UserModel[] = (await group.populate('users')).users;
    if (typeof users === 'undefined') {
      console.log('undefined');
      users = [];
    }
    users.push(user);
    return await this.groupRepository.updateOne(
      { id: createGroupDto.group_id },
      {
        users: users,
      },
    );
  }

  async removeUserfromGroup(
    createGroupDto: AddUserIntoGroupDto,
    ownerid: string,
  ) {
    const group = await this.groupRepository.findById({
      _id: createGroupDto.group_id,
    });
    if (!group) {
      throw new NotFoundException('Group Not Found');
    }
    const user = await this.userRepository.findById({
      _id: createGroupDto.user_id,
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const userfound = (await group.populate('users')).users;
    if (
      userfound.filter((user) => user['id'] === createGroupDto.user_id).length <
      0
    ) {
      throw new BadRequestException('User Not In Group');
    }
    return await this.groupRepository.updateOne(
      { id: createGroupDto.group_id },
      {
        users: userfound.filter(
          (user) => user['id'] !== createGroupDto.user_id,
        ),
      },
    );
  }

  async findAll() {
    return await this.groupRepository.find().populate('owner');
  }

  async findOne(id: string) {
    return await (
      await this.groupRepository.findOne({ id: id })
    ).populate('users');
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  async remove(id: string) {
    const group = await this.groupRepository.findById({ _id: id });
    if (!group) throw new NotFoundException('Group Not Found');
    return this.groupRepository.remove(group);
  }
}
