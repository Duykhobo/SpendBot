import { Context } from 'telegraf';
import userService from '../services/UserService';

// Mở rộng Context của Telegraf để chứa thông tin dbUser
export interface MyContext extends Context {
  dbUser?: any;
}

export const userMiddleware = async (ctx: MyContext, next: () => Promise<void>) => {
  if (ctx.from) {
    const { id, first_name, last_name, username } = ctx.from;
    const user = await userService.getOrCreateUser(id, first_name, last_name, username);
    ctx.dbUser = user;
  }
  return next();
};
