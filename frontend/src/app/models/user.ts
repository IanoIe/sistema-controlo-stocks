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

// Data sent in the log
export interface RegisterModel {
  name: string;
  email: string;
  password: string;
}

// Data sent upon login
export interface LoginModel {
  email: string;
  password: string;
}


