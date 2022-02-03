import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserKey, UserModel } from './entities/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users') private userRepository: Model<UserModel, UserKey>,
  ) { }

  async create(createUserDto:any) {
    
    const user1=await this.userRepository.create(createUserDto)
    await user1.save();
    return user1;
    // return await this.userRepository.create({
    //   ...createUserDto,
    //   ...{ id: uuidv4() },
    // });
  }

  async test() {
    const user1=await this.userRepository.create({ name: 'siddd' })
    await user1.save();
    return user1;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.findOne({ email: email });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.updateOne(
      { email: email },
      { ...updateUserDto },
    );
  }

  async remove(email: string) {
    const user = await this.userRepository.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.remove({ email: email });
  }
}
