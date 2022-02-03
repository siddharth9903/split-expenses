import * as mongoose from 'mongoose';
import { UserSchema } from './user.schema';

export class UserModel {
  email: string;
  name: string;
  password: string;
  profile_img?: string;
  phone?: string;
  currency?: string;
  balance?: number;
}

export type UserKey = {
  id?: string;
};

export const User=mongoose.model('User',UserSchema);

// const User=mongoose.model('User',UserSchema);
// module.exports=User;
