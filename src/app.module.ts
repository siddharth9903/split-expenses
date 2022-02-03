import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesModule } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    UsersModule,
    GroupsModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.n23bk.mongodb.net/splitwise?retryWrites=true&w=majority',
    ),
    ExpensesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {  }
