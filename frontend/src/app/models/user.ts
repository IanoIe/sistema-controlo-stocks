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


// Dados enviados no registo
export interface RegisterModel {
  name: string;
  email: string;
  password: string;
}

// Dados enviados no login
export interface LoginModel {
  email: string;
  password: string;
}


