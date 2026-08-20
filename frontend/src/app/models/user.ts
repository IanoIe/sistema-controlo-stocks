export interface UserModel {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export interface UserCollection {
  member: UserModel[];
}

export type User = UserModel;
