import _ from "lodash";
import { NotFoundError } from "@/utils/errors";
import userRepository from "@/repositories/user.repository";
import { CreateUserDto } from "@/dtos/user/CreateUser.dto";
import { UpdateUserDto } from "@/dtos/user/UpdateUser.dto";

export class UserService {
  async getAllUsers() {
    const users = await userRepository.getAll();
    return users;
  }

  async getUserById(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError({ message: `User with ID ${userId} not found` });
    }
    return user;
  }

  async createUser(input: { userData: CreateUserDto }) {

    // TODO: HASH_PASSWORD
    const newUser = await userRepository.create({ userData: {
      ...input.userData,
      avatar: _.get(input, 'userData.avatar', null),
    }});

    return newUser;
  }

  async updateUser(input: { userId: number, userData: UpdateUserDto }) {
    const existingUser = await this.getUserById(input.userId);
    if (!existingUser) {
      throw new NotFoundError({ message: `User with ID ${input.userId} not found` });
    }

    const updatedUser = await userRepository.update({ userId: input.userId, userData: {
      ...input.userData,
      avatar: _.get(input, 'userData.avatar', null),
    }});

    return updatedUser;
  }

  async deleteUser(userId: number) {
    const deletedUser = await userRepository.delete(userId);

    if (!deletedUser) {
      throw new NotFoundError({ message: `User with ID ${userId} not found` });
    }

    return deletedUser;
  }
}

export default new UserService();
