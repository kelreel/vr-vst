import bcrypt from "bcryptjs";

import { User, UserRole } from "../models/UserSchema";
import { HttpException } from "../utils/errorHandler";
import { DecodedUserTokenType, generateToken } from "./AuthService";

class UserService {
  /**
   * User auth with login and password. Returns login and JWT token.
   */
  async loginUser(
    login: string,
    password: string
  ): Promise<{ login: string; token: string }> {
    try {
      const user = await User.findOne({ login });
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        throw new HttpException(401, "Wrong login or password");
      } else {
        return {
          login,
          token: generateToken(user._id, login, user.role),
        };
      }
    } catch (error) {
      throw new HttpException(401, "Wrong login or password");
    }
  }

  /**
   * Create new user
   */
  createUser = async (
    login: string,
    password: string,
    email?: string
  ): Promise<{ login: string; token: string }> => {
    let findUser = await User.findOne({ login });

    if (findUser) throw new HttpException(400, "User already exists");
    if (!password) throw new HttpException(400, "Password not provided");

    let role = "user";

    if ((await User.count({})) === 0) {
      role = "admin";
    }

    let user = new User({
      login,
      password: this.getPasswordHash(password),
      email,
      role,
    });

    try {
      await user.save();
      return {
        login,
        token: generateToken(user._id, user.login, user.role),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * Edit user (as user or admin)
   * @param  {DecodedUserTokenType} initiator_user
   * @param  {{_id:string;email?:string;role?:UserRole;score?:number;}} data
   * @returns number
   */
  editUser = async (
    initiator_user: DecodedUserTokenType,
    data: {
      _id: string;
      email?: string;
      role?: UserRole;
      score?: number;
    }
  ) => {
    try {
      let user = await User.findById(data._id);
      if (!user) throw new HttpException(404, "User not found");

      if (initiator_user.role === UserRole.admin) {
        await user.update({ data });
        return await User.findById(data._id);
      } else {
        if (user._id !== initiator_user._id) {
          throw new HttpException(
            401,
            "You are not authorized for this action"
          );
        }
        await User.updateOne({ _id: initiator_user._id }, {});
        return await User.findById(initiator_user._id);
      }
    } catch (error) {
      throw error;
    }
  };

  getPasswordHash = (pass: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
  };
}

export default new UserService();
