import User, { IUser } from '../models/User';

export class UserService {
  async getOrCreateUser(
    telegramId: number,
    firstName?: string,
    lastName?: string,
    username?: string
  ): Promise<IUser> {
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId, firstName, lastName, username });
      await user.save();
    }
    return user;
  }

  async getUserByTelegramId(telegramId: number): Promise<IUser | null> {
    return await User.findOne({ telegramId });
  }
}

export default new UserService();
