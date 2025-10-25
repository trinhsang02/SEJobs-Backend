import { NotFoundError } from "@/utils/errors";
import { CreateUserDto } from "@/dtos/user/CreateUser.dto";
import { Database } from "@/types/database";
import userRepository from "@/repositories/user.repository";

type UserUpdate = Partial<Database["public"]["Tables"]["users"]["Update"]>;

export class UserService {
  async getAllUsers() {
    const users = await userRepository.getAll();
    return users;
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError({ message: `User with ID ${id} not found` });
    }
    return user;
  }

  async createUser(userData: CreateUserDto) {
    const newUser = await userRepository.create({
      name: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });

    return newUser;
  }

  async updateUser(id: string, userData: Partial<CreateUserDto>) {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new NotFoundError({ message:`User with ID ${id} not found` });
    }

    const updateData: UserUpdate = {};
    // TODO: CLEAN OBJECT, DONT CHECK
    if (userData.username) updateData.name = userData.username;
    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password;
    if (userData.role) updateData.role = userData.role;

    const updatedUser = await userRepository.update(id, updateData);
    return updatedUser;
  }

  async deleteUser(id: string) {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new NotFoundError({ message: `User with ID ${id} not found` });
    }

    const deletedUser = await userRepository.delete(id);
    return deletedUser;
  }
}

export default new UserService();
