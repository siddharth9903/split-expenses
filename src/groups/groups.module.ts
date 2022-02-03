import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController, UserExpenseController } from './groups.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from './entities/group.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from 'src/users/entities/user.schema';
import { ExpensesSchema } from '../expenses/entities/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'groups', schema: GroupSchema },
      { name: 'users', schema: UserSchema },
      {name:'expenses',schema: ExpensesSchema }
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [GroupsController,UserExpenseController],
  providers: [GroupsService],
})
export class GroupsModule {}
