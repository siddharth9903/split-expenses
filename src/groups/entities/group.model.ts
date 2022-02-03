import { UserModel } from 'src/users/entities/user.model';

export class GroupModel {
  name: string;
  owner: UserModel;
  users: [UserModel];
}
export type GroupKey = {
  id?: number;
};
