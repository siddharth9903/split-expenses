import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { UserKey, UserModel } from 'src/users/entities/user.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    @InjectModel('users') private userRepository: Model<UserModel, UserKey>,
  ) {}

  async register(createUserInput: RegisterDto) {
    createUserInput.password = await this.getEncryptedPassword(
      createUserInput.password,
    );
    try {
      const userGEt = await this.userRepository.findOne({
        email: createUserInput.email,
      });
      if (userGEt) {
        throw new BadRequestException('User already exist').getResponse();
      }
      const user = await this.userService.create(createUserInput);
      const { id } = user;
      const payload = { id };
      const asscesstoken = this.jwtService.sign({ payload });
      return {
        statusCode: 200,
        token: asscesstoken,
        message: 'User Created successfully',
      };
    } catch (error) {
      return error;
    }
  }
  async login(loginInput: LoginDto) {
    const user = await this.userRepository.findOne({
      email: loginInput.email,
    });
    if (user) {
      const login = await this.authorizedPassword(
        loginInput.password,
        user.password,
      );
      console.log(login);
      if (login) {
        const { id } = user;
        const payload = { id };
        const asscesstoken = this.jwtService.sign({ payload });
        return {
          statusCode: 200,
          message: 'Login Successfully',
          token: asscesstoken,
        };
      } else {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Enter Valid Password.',
        });
      }
    } else {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User Not found.',
      });
    }
  }
  private async authorizedPassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }

  private async getEncryptedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
