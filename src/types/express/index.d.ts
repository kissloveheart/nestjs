import { User } from '@modules/user';
export {};

declare global {
  namespace Express {
    export interface Request {
      user: User;
      email: string;
    }
  }
}
