export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Manager' | 'Employee';
  rfidTag?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}